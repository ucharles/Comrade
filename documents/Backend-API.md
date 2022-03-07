# Backend API

GET 요청에 Body를 첨부하면 Backend에서 POST 요청으로 해석합니다.
404 에러의 원인이 될 수 있습니다. GET 요청엔 Body를 첨부하지 마십시오.

---

## users-controllers

- GET
  - /api/users
    - 모든 유저 정보 획득. 테스트용
- POST
  - /api/users/login
    - email, 이메일인지 체크
    - password, 6자 이상인지 체크
  - /api/users/signup
    - username, 필수
    - email, 이메일인지 체크
    - password, 입력 시 공백 제외 6자 이상
    - confirmPassword, 공백 제외 6자 이상, password와 같아야 함

**⬇︎ Authentication required ⬇︎**

- GET
  - /api/users/:id
- PATCH

  - /api/users/:id
    - username, 필수
    - email, 이메일인지 체크
    - password, null 가능, 공백 제외 6자 이상
    - confirmPassword, null 가능, 공백 제외 6자 이상, password와 같아야 함

- DELETE
  - /api/users/:id

---

## events-controllers

**⬇︎ Authentication required ⬇︎**
(현재는 비활성화 중, 인증 정보 없어도 접근 가능)

- GET

  - **/api/events**
    - 모든 이벤트 획득
  - **/api/events/calendar/:calendarId/date/:date/:timezone**
    - calendarId 기준, date 기준, timezone 기준 교집합 획득
    - date 형식은 YYYY-MM-DD
    - timezone 을 설정할 때 encodeURIComponent() 사용 필요 ('/'가 들어가기 때문)
      - localStorage에 timezone을 저장할 때 인코딩 후 저장
    - 멤버가 많고, 시간이 긴 최대 5개의 교집합 이벤트를 출력
  - **/api/events/calendar/:calendarId/month/:month/:timezone**

    - calendarId 기준, Month 기준, timezone 기준 교집합 획득
    - date 형식은 YYYY-MM
    - timezone 을 설정할 때 encodeURIComponent() 사용 필요 ('/'가 들어가기 때문)
      - localStorage에 timezone을 저장할 때 인코딩 후 저장

  - **/api/events/user/:userId/date/:date/:timezone**
    - userId 기준, date 기준, timezone 기준 이벤트 출력
    - date 형식은 YYYY-MM-DD
    - timezone 을 설정할 때 encodeURIComponent() 사용 필요 ('/'가 들어가기 때문)
      - localStorage에 timezone을 저장할 때 인코딩 후 저장

- POST
  - /api/events
    - date, 형식은 YYYY-MM-DD
    - startTime
    - endTime
    - timezone
- DELETE
  - /api/events (미구현)
    - axios 를 사용하여 DELETE 요청에도 body 를 받아올 수 있다. (원랜 안됨)
      참고 [https://ukcasso.tistory.com/90]

---

## calendar-controllers

(미구현)

- /api/calendars/
