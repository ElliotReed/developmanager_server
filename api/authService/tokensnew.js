const jwt = require("jsonwebtoken");

const tokenPayload = {
  user: {
    id: null,
  },
};

function setTokenPayloadUserId(id) {
  console.log("tokenPayload: ", tokenPayload);
  console.log("Object.create(tokenPayload): ", Object.create(tokenPayload));
  const payload = Object.create(tokenPayload);
  payload.user.id = id;
  return payload;
}

function createAccessToken(user) {
  const newTokenPayload = setTokenPayloadUserId(user.id);
  console.log("newTokenPayload: ", newTokenPayload);
  return jwt.sign(newTokenPayload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 60,
  });
}

function verifyAccessToken(accessToken) {
  return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
}

function createRefreshToken(user) {
  return jwt.sign(
    { user: { id: user.id } },
    process.env.REFRESH_TOKEN_SECRET + user.password
  );
}

function verifyRefreshToken(refreshToken, password) {
  return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET + password);
}

async function authenticateRefreshToken(refreshToken, getUserById) {
  const payload = await jwt.decode(refreshToken);

  if (!payload) {
    throw new Error("What's up JWT!");
  }

  const user = await getUserById(payload.user.id);
  const verifiedPayload = await verifyRefreshToken(refreshToken, user.password);
  verifiedPayload.user.password = user.password;
  return verifiedPayload;
}

module.exports = {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  authenticateRefreshToken,
  verifyRefreshToken,
};
