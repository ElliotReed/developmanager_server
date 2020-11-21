const db = require("../../models");
const Op = db.Sequelize.Op;

const {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  authenticateRefreshToken,
} = require("./tokens");

const { cookieOptions } = require("./cookie");

const getUserById = async (id) => {
  return (user = await db.user.findOne({
    where: { id: { [Op.eq]: id } },
    attributes: ["id", "password", "email"],
  }));
};

function getAccessTokenFromRequest(req) {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return false;
  } else {
    return authorizationHeader.split(" ")[1];
  }
}

module.exports = async (req, res, next) => {
  const accessToken = getAccessTokenFromRequest(req);

  if (accessToken) {
    try {
      const payload = await verifyAccessToken(accessToken);
      req.user = payload.user;
      return next();
    } catch (err) {}
  }

  const refreshToken = req.cookies["refresh-token"];
  if (!refreshToken) {
    const err = new Error("You must be signed in for access.");
    err.statusCode = 403;
    return next(err);
  }

  try {
    const { user } = await authenticateRefreshToken(refreshToken, getUserById);
    const newAccessToken = createAccessToken(user);
    const newRefreshToken = createRefreshToken(user);
    // remove password from user?
    req.user = user;
    res.set("Access-Control-Expose-Headers", "token");
    res.set("token", newAccessToken);
    res.cookie("refresh-token", newRefreshToken, cookieOptions());
    return next();
  } catch (err) {
    const error = new Error(err);
    return next(error);
  }
};
