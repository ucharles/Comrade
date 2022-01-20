# Memo

---

## Frontend

### Cookie

- 백엔드에 정보를 요청할 때, 인증정보가 들어있는 쿠키를 보낼텐데,
  이것을 프론트에서 어떻게 활용하는지 확인 필요.
  (실습에서는 Authorization 헤더에, 'Bearer ' + 토큰 을 추가하고 있음.)

### Authentication

- 사이트 최초 접근 시, 백엔드에서 쿠키 여부 검사 (payload 내용도 확인)

1. 인증 성공 → 로그인 처리
2. 인증 실패 → 쿠키 삭제...?

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

### Jest

- beforeEach vs beforeAll

  - 테스트에 필요한 조건을 설정할 때 사용.
  - beforeEach를 기본값으로 설정하는 것이 좋을 수 있음.
    사람의 실수 방지: 한 테스트가 다음 테스트의 설정을 변경할 수도 있으므로.
    초기화에 시간이 걸리거나 계산 비용이 많이 드는 경우 beforeAll을 고려할 필요 있음.
  - beforeAll: 네트워크 호출에 사용.
  - beforeEach: 테스트에 사용되는 데이터 객체를 설정할 때 사용.

- toBe vs toEqual : 오브젝트 비교 시...
  - toBe는 같은 객체를 가리키고 있는지 확인한다.
  - 객체의 내용이 같더라도 서로 다른 메모리의 객체는 toBd 사용 시 false를 반환.
  - 객체의 내용만을 비교하려면 toEqual을 사용하자.
