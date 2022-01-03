# Comrade

일정 조율 웹 어플리케이션

## MERN (Mongo + Express + React + Node.js)

[공식 문서](https://docs.nestjs.com/techniques/mongodb)

mongoose schema를 정의할 땐 자바스크립트 타입을 작성할 것.  
타입스크립트 타입 말고!!

nestjs + mongo db(mongoose)
[YouTube](https://youtu.be/PqZY-L2EgC0)

node js + mongo db(mongoose) + jwt
[Blog](https://www.bezkoder.com/node-js-mongodb-auth-jwt/)

nest js + mongo db(mongoose) + jwt
[Blog](https://mohaned-benmansour.medium.com/jwt-authentication-using-node-nestjs-mongoose-passport-ionic5-part1-bd07becc7a52)

Module: DB 정의  
MongooseModule.forFeature([
{ name: 'Auth', schema: AuthSchema, collection: 'auth' },
]),  
1st param - name <String> model name  
2nd param - [schema] <Schema> schema name  
3rd param - [collection] <String> collection name (optional, induced from model name)  
4th param - [skipInit] <Boolean> whether to skip initialization (defaults to false)

### 삽질1

추상화가 무엇인가  
동기-비동기 처리  
Promise, async, await, rxjs 비교, 장단점을 알아보자

### TIMEZONE을 구하는 여러가지 방법

Asia/Seoul
console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);

GMT+0900 (한국 표준시)
console.log(new Date().toTimeString().slice(9));

9
console.log(new Date().getTimezoneOffset() / -60);

Local Timezone은 OS에 의존한다.
