const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  const code = (params.code || "").trim().toUpperCase();

  if (!code) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "code required" }),
    };
  }

  const store = getStore("versegame-rooms");

  if (event.httpMethod === "GET") {
    const value = await store.get(code, { type: "json" });
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: value || null }),
    };
  }

  if (event.httpMethod === "POST") {
    let body;
    try {
      body = JSON.parse(event.body || "{}");
    } catch (e) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "invalid json" }),
      };
    }
    await store.setJSON(code, body);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true }),
    };
  }

  return { statusCode: 405, body: "Method not allowed" };
};
