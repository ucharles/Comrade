# Backend API

GET, DELETE 요청엔 Body를 첨부하지 마십시오. 404 에러의 원인이 될 수 있습니다.  
GET 요청에 Body 를 첨부하면 Backend 에서 POST 요청으로 해석합니다.

(참고) axios 를 사용하면 DELETE 요청에도 body 를 실을 수 있음

---

## users-controllers

### GET

- **/api/users**
  - 모든 유저 정보 획득. 테스트용. 삭제 예정

### POST

- **/api/users/login**
  - email, 이메일인지 체크
  - password, 6자 이상인지 체크
- **/api/users/signup**
  - username, 필수
  - email, 이메일인지 체크
  - password, 입력 시 공백 제외 6자 이상
  - confirmPassword, 공백 제외 6자 이상, password와 같아야 함

**⬇︎ Authentication required ⬇︎**  
cookie: token(userId)

### GET

- **/api/users/:id**

### PATCH

- **/api/users/:id**

  - username, 필수
  - email, 이메일인지 체크
  - password, null 가능, 공백 제외 6자 이상
  - confirmPassword, null 가능, 공백 제외 6자 이상, password와 같아야 함

### DELETE

- **/api/users/:id**

---

## events-controllers

**⬇︎ Authentication required ⬇︎**  
cookie: token(userId)  
(현재는 비활성화 중, 인증 정보 없어도 접근 가능)

### GET

(timezone 을 쿠키에 넣으면 URL에 싣지 않아도 된다... 리팩토링 고려.)  
(URL에 쿼리를 사용할까 고민중. / 로만 구분하는 건 지저분해 보이고, URL 을 구성하는 순서도 지켜야함.)

- **/api/events**
  - 모든 이벤트 획득
- **/api/events/intersection/calendar/:calendarId/date/:date/:timezone**
  - calendarId 기준, date 기준, timezone 기준 교집합 획득
  - date 형식은 YYYY-MM-DD
  - timezone 을 설정할 때 encodeURIComponent() 사용 필요 ('/'가 들어가기 때문)
    - cookie 에 timezone을 저장할 때 인코딩 후 저장
  - 멤버가 많고, 시간이 긴 최대 5개의 교집합 이벤트를 출력
- **/api/events/intersection/calendar/:calendarId/month/:month/:timezone**

  - calendarId 기준, Month 기준, timezone 기준 교집합 획득
  - date 형식은 YYYY-MM
  - timezone 을 설정할 때 encodeURIComponent() 사용 필요 ('/'가 들어가기 때문)
    - cookie 에 timezone을 저장할 때 인코딩 후 저장

- **/api/events/user/calendar/:calendarId/month/:month/:timezone**
  - (미구현)
  - userId 기준, date 기준, timezone 기준 이벤트 출력
  - date 형식은 YYYY-MM-DD
  - timezone 을 설정할 때 encodeURIComponent() 사용 필요 ('/'가 들어가기 때문)
    - cookie 에 timezone을 저장할 때 인코딩 후 저장
- **/api/events/calendar/:calendarId/date/:date/:timezone**

  - (미구현)
  - date 기준, timezone 기준 이벤트 출력
  - date 형식은 YYYY-MM-DD
  - timezone 을 설정할 때 encodeURIComponent() 사용 필요 ('/'가 들어가기 때문)
    - cookie 에 timezone을 저장할 때 인코딩 후 저장

### POST

- **/api/events**
  - body: {date, startTime, endTime, (timezone, 쿠키로 대체 가능성 있음)}
  - date, 형식은 YYYY-MM-DD
  - 중복 시간 체크 필요
- **/api/events/delete**
  - POST 요청이지만 DELETE를 수행함
    - DELETE 요청은 body를 갖지 않음
  - body: {eventIds:[(삭제할 이벤트의 Id들)]}

---

## calendar-controllers

(테스트 코드 작성 필요)

**⬇︎ Authentication required ⬇︎**  
cookie: token(userId)

### GET

- **/api/calendar**
  - getCalendarsByUserId
  - cookie: token(userId)
- **/api/calendar/:calendarId**
  - getCalendarByCalendarId
  - cookie: token(userId)
  - :calendarId 에 대응되는 캘린더에 user 가 속해 있는지 확인함.

### POST

- **/api/calendar**
  - createCalendar
  - cookie: token(userId)
  - body: {name, description}, image 입력 있음
    - name 은 입력 필수, 최대 길이 15
    - description 은 입력 선택, 최대 길이 50
- **/api/calendar/join**
  - addMemberToCalendar
  - cookie: token(userId)
  - body: {calendarId, nickname, role}
    - nickname 은 입력 선택, 미입력시 User.username 을 대입함, 최대길이 10
    - role 은 입력 선택, 미입력시 "" 을 대입함, 최대길이 10
- **/api/calendar/fix-event**

  - (미구현)

### PATCH

- **/api/calendar**
  - updateCalendarById
  - cookie: token(userId)
  - body: {calendarId, name, description}, image 입력 있음
    - name 은 입력 필수, 미입력시 변경 없음
    - description 은 입력 선택, 미입력시 "" 가 대입됨.
- **/api/calendar/admin**
  - setMemberToAdministratorOrNot
  - cookie: token(userId)
  - body: {userId, calendarId, administrator}
  - userId 는 관리자로 임명될 혹은 관리자에서 해임될 user 의 id
  - administrator 는 true(1) 혹은 false(0), 이외의 값은 error
- **/api/calendar/owner**

  - setMemberToOwner
  - cookie: token(userId)
  - body: {userId, calendarId}
  - userId 는 Owner 로 임명될 user 의 id

### DELETE

- **/api/calendar/:calendarId**
  - deleteCalendar
  - cookie: token(userId)
- **/api/calendar/:calendarId/:userId**
  - deleteUserFromCalendar
  - cookie: token(userId)
- **/api/calendar/:calendarId/fix-event/:fix-eventId**
  - (미구현)
