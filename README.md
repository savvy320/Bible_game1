# 말씀 채우기 — Netlify 배포 가이드

## 폴더 구성
```
index.html                     ← 게임 화면 (프론트엔드)
netlify/functions/room.js      ← 방 데이터 저장/조회 서버리스 함수
netlify.toml                   ← Netlify 빌드 설정
package.json                   ← @netlify/blobs 의존성
```

## 배포 방법 (권장: Git 연동)
드래그 앤 드롭 배포로는 `package.json`의 의존성이 자동 설치되지 않을 수 있어서,
**GitHub 저장소를 만들어 연결하는 방식**을 권장해요.

1. 이 폴더를 새 GitHub 저장소에 올린다.
2. https://app.netlify.com → **Add new site → Import an existing project** → 방금 만든 저장소 선택.
3. Build settings는 기본값 그대로 두고 **Deploy site** 클릭.
   - `netlify.toml`이 이미 `publish = "."`, `functions = "netlify/functions"`로 설정돼 있어서 별도 입력 불필요.
4. 배포가 끝나면 Netlify가 자동으로 `https://[사이트이름].netlify.app` 주소를 줘요.
   - Netlify Blobs는 사이트에 자동으로 연결되어 별도 설정(환경변수, DB 가입) 없이 바로 동작해요.
5. 그 주소를 참가자들에게 공유하면, 각자 폰/PC 브라우저에서 접속해 방 코드로 함께 플레이할 수 있어요.

## 간단 배포 (CLI, Git 없이)
Netlify CLI를 쓰면 폴더에서 바로 배포할 수 있어요:
```bash
npm install
npm install -g netlify-cli
netlify deploy --prod
```
CLI가 로그인 → 새 사이트 생성 여부 → 배포 경로(현재 폴더) 순으로 물어봐요. 완료되면 배포 URL이 출력돼요.

## 확인
배포된 사이트에서 방을 하나 만든 뒤, 다른 기기(또는 다른 브라우저)로 같은 방 코드에 참가해서
점수/차례가 양쪽에 잘 반영되는지 확인해 보세요.
