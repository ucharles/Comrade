# Comraids

일정 조율 웹 어플리케이션

## Next js + mongo DB

[공식 문서](https://docs.nestjs.com/techniques/mongodb)

mongoose schema를 정의할 땐 자바스크립트 타입을 작성할 것. <br/>
타입스크립트 타입 말고!!<br/>

nestjs + mongo db(mongoose)
[YouTube](https://youtu.be/PqZY-L2EgC0)

node js + mongo db(mongoose) + jwt
[Blog](https://www.bezkoder.com/node-js-mongodb-auth-jwt/)

nest js + mongo db(mongoose) + jwt
[Blog](https://mohaned-benmansour.medium.com/jwt-authentication-using-node-nestjs-mongoose-passport-ionic5-part1-bd07becc7a52)

Module: DB 정의<br/>
MongooseModule.forFeature([<br/>
{ name: 'Auth', schema: AuthSchema, collection: 'auth' },<br/>
]),<br/>
1st param - name <String> model name<br/>
2nd param - [schema] <Schema> schema name<br/>
3rd param - [collection] <String> collection name (optional, induced from model name)<br/>
4th param - [skipInit] <Boolean> whether to skip initialization (defaults to false)<br/>

### 삽질1

추상화가 무엇인가<br/>
동기-비동기 처리<br/>
Promise, async, await, rxjs 비교, 장단점을 알아보자
