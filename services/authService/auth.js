const router = require("express").Router();
const bcrypt = require("bcryptjs");
const verify = require("./verifyToken");

const db = require("../../models");
const Op = db.Sequelize.Op;

const { loginValidation } = require("../../validation");
const {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} = require("./tokens");

router.post("/register", (req, res) => {
  res.send("Register");
});

router.post("/login", async (req, res) => {
  // console.log("req.body: ", req.body);
  const { error } = loginValidation(req.body);
  if (error)
    return res.status(400).send({ error: `${error.details[0].message}` });

  const { email, password } = req.body;
  try {
    const user = await db.user.findOne({
      where: { email: { [Op.eq]: email } },
      attributes: ["id", "email", "password"],
    });

    if (!user) throw new Error(`No user with email ${email} exists`);

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error("Incorrect password");

    const accessToken = await createAccessToken(user);
    const refreshToken = await createRefreshToken(user);
    const cookieOptions = {
      httpOnly: true,
      // expires: new Date(Date.now() + 1000 * 60),
    };
    res.cookie("refresh-token", refreshToken, cookieOptions);
    res.set("Access-Control-Expose-Headers", "token");
    res.set("token", accessToken);
    res.status(200).send({ token: accessToken });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.post("/logout", (req, res, next) => {
  console.log("logout route");
  res.clearCookie("refresh-token");
  res.status(200).send({ message: "logged out" });
});

router.get("/tokens", async (req, res) => {
  console.log("server tokens route: ");
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + 1000 * 60),
  };
  // console.log("access t error: ", err.message);
  const refreshToken = req.cookies["refresh-token"];
  // if (!refreshToken) return res.status(403).send({ error: "Access denied" });
  try {
    console.log("refreshToken: ", refreshToken);
    const { user } = await verifyRefreshToken(refreshToken);
    console.log("refresh user: ", user);
    req.user = user;
  } catch (err) {
    // console.log("error21: ", err.message);
    return res.status(403).send({ error: "Access denied" });
  }

  const newAccessToken = await createAccessToken(req.user);
  console.log("newAccessToken: ", newAccessToken);
  const newRefreshToken = await createRefreshToken(req.user);
  res.set("Access-Control-Expose-Headers", "token");
  res.set("token", newAccessToken);
  res.cookie("refresh-token", newRefreshToken, cookieOptions);

  res.status(200).send({ token: newAccessToken });
});

module.exports = router;
