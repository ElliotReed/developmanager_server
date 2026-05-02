const tokenService = require("./tokenService");
const cookieOptions = require("./cookieOptions");

module.exports = function setResponseCredentials(user, res) {
  const accessToken = tokenService.createAccessToken(user);
  const refreshToken = tokenService.createRefreshToken(user);

  res.set("Access-Control-Expose-Headers", "x-access-token");
  res.set("x-access-token", accessToken);
  res.cookie(process.env.REFRESH_COOKIE_NAME, refreshToken, cookieOptions());
  return res;
};
