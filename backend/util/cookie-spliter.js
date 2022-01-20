module.exports.cookieSplit = (cookieHeader, cookieName) => {
  const cookieArray = cookieHeader
    .find((v) => {
      if (v.startsWith(cookieName + "=")) {
        return true;
      }
    })
    .split(";");

  return cookieArray[0].substr(cookieName.length + 1);
};
