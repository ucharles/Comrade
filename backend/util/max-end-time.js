module.exports.maxEndTime = (events) => {
  let compareEndTime = new Date(events[0].endTime);
  for (let i = 1; i < events.length; i++) {
    let currentEndTime = new Date(events[i].endTime);
    compareEndTime < currentEndTime
      ? (compareEndTime = events[i].endTime)
      : null;
  }
  return compareEndTime;
};
