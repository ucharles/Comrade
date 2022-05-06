const moment = require("moment-timezone");

module.exports.timeTitle = (startTime, endTime, timezone) => {
  let start = moment.tz(startTime, timezone);
  let end = moment.tz(endTime, timezone);
  let diff = end.diff(start) / 1000 / 60;

  let hour = parseInt(diff / 60);
  let min = diff % 60;

  let timeAmount = "";
  hour === 0 ? null : (timeAmount += `${hour}h`);
  hour * min === 0 ? null : (timeAmount += " ");
  min === 0 ? null : (timeAmount += `${min}m`);

  return `${start.format("HH:mm")}~${end.format("HH:mm")} (${timeAmount})`;
};
