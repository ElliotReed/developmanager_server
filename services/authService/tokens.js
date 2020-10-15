const jwt = require("jsonwebtoken");

const db = require("../../models");
const Op = db.Sequelize.Op;

const getPassword = async (user) => {
  const password = db.user.findOne({
    where: { id: { [Op.eq]: user.id } },
    attributes: ["password"],
  });

  return await password;
};

function createTokens(user) {
  
}
function createAccessToken(user) {
  return jwt.sign({ user: { id: user.id } }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 15,
  });
}

function createRefreshToken(user) {
  return jwt.sign(
    { user: { id: user.id } },
    process.env.REFRESH_TOKEN_SECRET + getPassword(user),
    {
      expiresIn: "1m",
    }
  );
}

function verifyAccessToken(accessToken) {
  return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
}

function verifyRefreshToken(refreshToken) {
  const { user } = jwt.decode(refreshToken);
  // console.log("user: ", user);
  return jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET + getPassword(user)
  );
}

module.exports = {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
