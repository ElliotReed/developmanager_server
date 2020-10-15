const {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} = require("./tokens");

module.exports = (req, res, next) => {
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60),
  };
  const accessToken = req.headers.authorization.split(" ")[1];
  console.log("accessToken: ", accessToken);

  if (accessToken) {
    try {
      const { user } = verifyAccessToken(accessToken);
      req.user = user;
    } catch (err) {
      // console.log("access t error: ", err.message);
      const refreshToken = req.cookies["refresh-token"];
      if (!refreshToken)
        return res.status(403).send({ error: "Access denied" });
      try {
        const { user } = verifyRefreshToken(refreshToken);
        console.log("refresh user: ", user);
        req.user = user;
      } catch (err) {
        // console.log("error21: ", err.message);
        return res.status(403).send({ error: "Access denied" });
      }

      const newAccessToken = createAccessToken(req.user);
      const newRefreshToken = createRefreshToken(req.user);
      // console.log("newAccessToken: ", newAccessToken);
      res.set("Access-Control-Expose-Headers", "token");
      res.set("token", newAccessToken);
      res.cookie("refresh-token", newRefreshToken, cookieOptions);
    }
  }
  console.log("req.user: ", req.user);
  next();
};
