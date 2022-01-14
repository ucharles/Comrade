# Memo

---

## Frontend

### Cookie

- 백엔드에 정보를 요청할 때, 인증정보가 들어있는 쿠키를 보낼텐데,
  이것을 프론트에서 어떻게 활용하는지 확인 필요.
  (실습에서는 Authorization 헤더에, 'Bearer ' + 토큰 을 추가하고 있음.)

---

## Backend

### express-validator

라우터의 POST 요청에 배열 형식으로 추가 가능. 메소드 종류 확인 필요.
프론트의 유효성 검사와 백엔드의 유효성 검사를 동일하게 하는 것이 좋음.

### Mongoose timestamp

이 옵션을 true로 할 경우, 자동적으로 이하의 요소가 추가됨
createdAt, updatedAt.

### JWT Refresh Token?

- 기존의 Access Token의 유효기간을 짧게 설정, Refresh Token 이라는 새로운 토큰을 발급한다. OAuth2와 관련된 내용인가?
- REST는 Stateless. 클라이언트를 신경쓰지 않는다. 그래서 세션을 사용하지 않음.
- JWT Token은 서버에서 생성됨. 서버에서만 확인할 수 있는 정보가 포함됨.  
  클라이언트는 모든 요청에 이 토큰을 포함함.
