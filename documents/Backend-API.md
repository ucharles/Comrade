# Backend API

GET, DELETE 요청엔 Body를 첨부하지 마십시오. 404 에러의 원인이 될 수 있습니다.  
GET 요청에 Body 를 첨부하면 Backend 에서 POST 요청으로 해석합니다.

(참고) axios 를 사용하면 DELETE 요청에도 body 를 실을 수 있음

---

## users-controllers

### GET

- **/api/users/logout**
  - logout
  - 로그아웃
  - 브라우저에 저장된 모든 쿠키 삭제

### POST

- **/api/users/login**
  - login
  - body: {email, password}
    - email, 이메일인지 체크
    - password, 6자 이상인지 체크
- **/api/users/signup**
  - signup
  - body: {username, email, password, confirmPassword}
    - username, 필수
    - email, 이메일인지 체크
    - password, 입력 시 공백 제외 6자 이상
    - confirmPassword, 공백 제외 6자 이상, password와 같아야 함

**⬇︎ Authentication required ⬇︎**  
cookie: at(userId), rt(uuid)

### GET

- **/api/users**
  - getUserById
  - cookie: at(userId)
  - 쿠키에 저장된 userId로 유저 정보 획득.

### PATCH

- **/api/users**
  - editUser
  - cookie: at(userId)
  - body: {username, email, password, confirmPassword}
    - username, 필수
    - email, 이메일인지 체크
    - password, null 가능, 공백 제외 6자 이상
    - confirmPassword, null 가능, 공백 제외 6자 이상, password와 같아야 함

### DELETE

- **/api/users**
  - deleteUser
  - cookie: at(userId)

---

## events-controllers

**⬇︎ Authentication required ⬇︎**  
cookie: at(userId), rt(uuid)

### GET

(timezone 을 쿠키에 넣으면 URL에 싣지 않아도 된다. 리팩토링 고려.)  
(URL에 쿼리를 사용할까 고민중. / 로만 구분하는 건 지저분해 보이고, URL 을 구성하는 순서도 지켜야함.)

- **/api/events**

  - getEvents
  - 모든 이벤트 획득 (테스트용, 삭제 예정)

- **/api/events/calendar/:calendarId/int-day/:date/:timezone**
  - getIntersectionEventsByDay
  - calendarId 기준, date 기준, timezone 기준 멤버들의 **이벤트들**과 **교집합** 획득
  - date 형식은 YYYY-MM-DD
  - timezone 을 설정할 때 encodeURIComponent() 사용 필요 ('/'가 들어가기 때문)
    - cookie 에 timezone을 저장할 때 인코딩 후 저장
  - 멤버가 많고, 시간이 긴 최대 5개의 교집합 이벤트를 출력
- **/api/events/calendar/:calendarId/int-month/:date/:timezone**

  - getIntersectionEventsByMonth
  - calendarId 기준, Month 기준, timezone 기준 교집합 획득
  - date 형식은 YYYY-MM-DD, YYYY-MM 도 가능
  - timezone 을 설정할 때 encodeURIComponent() 사용 필요 ('/'가 들어가기 때문)
    - cookie 에 timezone을 저장할 때 인코딩 후 저장

- **/api/events/calendar/:calendarId/one-user-month/:date/:timezone**
  - getEventsByMonth
  - cookie: at(userId)
  - userId 기준, date 기준, timezone 기준 이벤트 출력
  - date 형식은 YYYY-MM-DD
  - timezone 을 설정할 때 encodeURIComponent() 사용 필요 ('/'가 들어가기 때문)
    - cookie 에 timezone을 저장할 때 인코딩 후 저장

### POST

- **/api/events**
  - createEvents
  - cookie: at(userId)
  - body: {date, startTime, endTime, (timezone, 쿠키로 대체 가능성 있음)}
    - date, 형식은 YYYY-MM-DD
  - 추후 구현: 중복 시간 체크 필요
- **/api/events/delete**
  - cookie: at(userId)
  - POST 요청이지만 DELETE를 수행함
    - DELETE 요청은 body를 갖지 않음
  - body: {eventsId:[(삭제할 event의 id), (...), ...]}

---

## calendar-controllers

**⬇︎ Authentication required ⬇︎**  
cookie: at(userId), rt(uuid)

### GET

- **/api/calendar**
  - getCalendarsByUserId
  - cookie: at(userId)
  - userId 가 속해있는 calendar 들의 name, image, members, owner 를 획득
  - members 는 자신의 정보만 포함되어 있음
  - owner 는 userId === owner 인 경우만 표시됨, 아닌 경우는 null
- **/api/calendar/:calendarId**
  - getCalendarByCalendarId
  - cookie: at(userId)
  - :calendarId 에 대응되는 캘린더에 user 가 속해 있는지 확인함.
- **/api/calendar/admin**
  - getCalendarAdminByUserId
  - cookie: at(userId)
  - userId가 속해있는 calendar에서 userId의 관리자 여부 정보를 출력
  - 출력예: {calendarsAdmin: [{calendarId: xxx, isAdmin: true|false}, {...}]}

### POST

- **/api/calendar**
  - createCalendar
  - cookie: at(userId)
  - body: {name, description}, image 입력 있음
    - name 은 입력 필수, 최대 길이 15
    - description 은 입력 선택, 최대 길이 50
- **/api/calendar/join**
  - addMemberToCalendar
  - cookie: at(userId)
  - body: {calendarId, nickname, role}
    - nickname 은 입력 선택, 미입력시 User.username 을 대입함, 최대길이 10
    - role 은 입력 선택, 미입력시 "" 을 대입함, 최대길이 10
- **/api/calendar/fix-event**

  - (미구현)
  - 프론트(ViewDayEvents)와 동시 개발 예정

### PATCH

- **/api/calendar**
  - updateCalendarById
  - cookie: at(userId)
  - body: {calendarId, name, description}, image 입력 있음
    - name 은 입력 필수, 미입력시 변경 없음
    - description 은 입력 선택, 미입력시 "" 가 대입됨.
- **/api/calendar/admin**
  - setMemberToAdministratorOrNot
  - cookie: at(userId)
  - body: {userId, calendarId, administrator}
  - userId 는 관리자로 임명될 혹은 관리자에서 해임될 user 의 id
  - administrator 는 true(1) 혹은 false(0), 이외의 값은 error
- **/api/calendar/owner**

  - setMemberToOwner
  - cookie: at(userId)
  - body: {userId, calendarId}
  - userId 는 Owner 로 임명될 user 의 id

### DELETE

- **/api/calendar/:calendarId**
  - deleteCalendar
  - cookie: at(userId)
- **/api/calendar/:calendarId/:userId**
  - deleteUserFromCalendar
  - cookie: at(userId)
  - URL의 userId는 삭제할 유저의 정보. 쿠키의 userId와는 다름
- **/api/calendar/:calendarId/fix-event/:fix-eventId**
  - (미구현)
  - 프론트(ViewDayEvents)와 동시 개발 예정

---

## invite-controllers

(미구현)

**⬇︎ Authentication required ⬇︎**  
cookie: at(userId), rt(uuid)

### GET

- **/api/invite/calendar/:calendarId**
  - cookie: at(userId)
  - 초대 링크 작성용, 획득용
  - calendar 에 가입한 유저라면 누구든지 작성 가능
  - 만료 기한 있음(하루?) 만료 기한 있음/없음을 선택 가능하게 할 건지 고민중
- **/api/invite/uuid/:uuid**
  - cookie: at(userId)
  - 초대 링크로 calendar 가입용, calendarId 획득 가능
