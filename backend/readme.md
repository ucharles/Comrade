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
- csurf + jwt 로 access token 발급하기 (https://as-you-say.tistory.com/253)
- CSRF 이해하기 (https://github.com/pillarjs/understanding-csrf/)
- GET 요청에는 JWT Verify Token 하나만 사용, POST, PUT, DELETE는 csrfProtection 토큰을 함께 사용.

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
  - 객체의 내용이 같더라도 서로 다른 메모리의 객체는 toBe 사용 시 false를 반환.
  - 객체의 내용만을 비교하려면 toEqual을 사용하자.

### Mongo DB

- SQL vs NOSQL

  - SQL: DB Level에서 타입과 크기를 강제해야 함. Key를 반드시 정의해야 함.
  - Mongo DB: No Rules, No Process, No Algorithm. 규정된 프로세스는 없다.
  - 스키마를 디자인 하는 데 가장 중요한 것은 주어진 과제, 제품이 잘 작동할 수 있도록 하는 것.

- 스키마 디자인 고려사항 3가지

  - 데이터를 어떻게 저장할 것인지
  - 쿼리 성능
  - 합리적인 양의 자원(서버 비용 등)

- Embedding vs Referencing (포함 vs 참조)
- geolocation data is a native data type in a MongoDB.

- Embedding
  - array or nested object
  - 장점
    - 한 쿼리로 모든 데이터 검색 가능.
    - 조인과 $lookup으로 지불되는 비용을 피할 수 있다.
    - 단일 원자 작업으로 모든 데이터 업데이트 가능
  - 대표적인 것은 location(좌표).
  - 단점
    - 큰 도큐멘트는 오버헤드를 부른다.
    - 도큐먼트엔 16MB의 사이즈 제한이 있다.
      (키가 10 bytes의 long 타입 + 밸류가 64비트 정수일때 20 bytes. 16MB면 약 80만개 저장 가능.)
- Referencing

  - 장점
    - 작은 도큐먼트
    - 도큐먼트 제한 16MB에 도달할 가능성이 적다.
    - 데이터의 중복이 없다.
    - 모든 쿼리에 대해 필요하지 않은 데이터는 선택적으로 접근할 수 있음.
  - 단점
    - 모든 데이터를 가져오기 위해선 두개의 쿼리, 혹은 $lookup이 필요함.

- Mongo DB: every operation is atomic.
- Mongo DB의 document에는 16MB의 제한이 있음.

- Types of Relationships

  - One to One, One to Few, One to Many, One to Squillions, Many to Many
  - Many와 Squillions의 차이는???
    - A PROGRAM FOR LOGS
    - Many는 주체가 많은 연결을 갖고 있는 것.
      (A->B, A->C, A->D, B,C,D는 A에 대한 연결을 갖고 있지 않음.)
    - Squillions는 한 주체에 대해 많은 연결이 있는 것.
      (B->A, C->A, D->A, A는 B,C,D에 대한 연결을 갖고 있지 않음.)
  - Rule 1: 강력한 이유가 없는 한 embedding을 선호.
  - Rule 2: 자체적으로 액세스할 필요가 있는 객체는 embedding을 하지 않을 강력한 이유다. 이 경우엔 referencing을 한다.
  - Rule 3: 가능하다면 JOIN과 $lookup을 피하되, 하지만 그것이 더 나은 스키마 디자인을 제공한다면, 두려워 말고 사용하십시오.
  - Rule 4: 배열은 제한을 두고 크기를 키워야 합니다. 몇 백은 괜찮지만, 몇 천은 referencing로 전환이 필요할 것.
  - Rule 5: 데이터를 모델링 하는 방법은 어플리케이션의 데이터 접근 패턴에 전적으로 의존합니다. ★ 제일 중요 ★

- Design Patterns

  - 스키마 디자인은 데이터 접근 방법에 기초합니다.
  - Outlier Pattern
    - 트위터 인플루언서처럼, 수많은 팔로워를 보유한 경우. "has_extras: true"를 설정하고, document를 추가로 작성하여, followers를 배열로 관리.

- Mongo DB의 유연성: 모든 도큐먼트가 반드시 같은 요소를 가지고 있을 필요는 없다.

- 자원은 유한하기 때문에, 데이터를 효율적으로 읽기, 쓰기할 수 있는 데이터 모델이 필요함.

- Table: DB 내에서 테이블 형식으로 보존되며, 관련 데이터의 모음이다. 열과 행으로 구성됨.

- Simplicity vs Performance

  - Simple, referencing 없이 하나의 document 안에 필요한 정보를 집어 넣음.
  - 디스크 접근이 적다는 장점

- 데이터 설계
  - 첫번째 페이즈에선 데이터 유닛과의 관계를 정의하지 않음.
  - 작업을 수량화: 대기시간, 빈도
  - 각 쓰기 작업의 내구성 식별.
  - 읽기, 쓰기 작업의 나열
