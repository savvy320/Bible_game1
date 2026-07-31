import { getStore } from "@netlify/blobs";

export default async (req) => {
  const url = new URL(req.url);
  const code = (url.searchParams.get("code") || "").trim().toUpperCase();

  if (!code) {
    return new Response(JSON.stringify({ error: "code required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const store = getStore("versegame-rooms");

  if (req.method === "GET") {
    const value = await store.get(code, { type: "json" });
    return new Response(JSON.stringify({ value: value || null }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: "invalid json" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 탭 종료 시 sendBeacon으로 오는 가벼운 "나감" 신호: 저장된 값에 부분 병합
    if (body && body.__action === "leave" && body.name) {
      const current = (await store.get(code, { type: "json" })) || null;
      if (current) {
        const leftPlayers = Array.from(new Set([...(current.leftPlayers || []), body.name]));
        await store.setJSON(code, { ...current, leftPlayers });
      }
      return new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    await store.setJSON(code, body);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (req.method === "DELETE") {
    await store.delete(code);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Method not allowed", { status: 405 });
};
