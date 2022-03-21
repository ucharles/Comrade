module.exports.diffDate = function (date, time) {
  let div;
  if (time === "min" || time === "m") {
    div = 60;
  } else if (time === "hour" || time === "h") {
    div = 60 / 60;
  } else {
    div = 1;
  }
  return (
    (new Date(date).getTime() - new Date(Date.now()).getTime()) / 1000 / div
  );
};
