const moment = require("moment-timezone");
const timezoneEnum = require("./util/timezone");
console.log(!!timezoneEnum["a"]);

console.log(moment.tz("2021-01-01", "asia/seoul").add(1, "day"));

console.log(moment.tz("2022-01-29T11:00:00.000Z", "asia/seoul"));

console.log(moment());

const startDate = moment.tz("2021-01-01 12:00", "asia/seoul");
const endDate = moment.tz("2021-01-31 11:00", "asia/seou");
