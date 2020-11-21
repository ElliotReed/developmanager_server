const authRouter = require("express").Router();
const bcrypt = require("bcryptjs");
const authenticate = require("./authenticate");

const db = require("../../models");
const Op = db.Sequelize.Op;

const { loginValidation } = require("./validation");

const { createAccessToken, createRefreshToken } = require("./tokens");

const { cookieOptions } = require("./cookie");

authRouter.post("/register", (req, res) => {
  res.send("Register");
});

authRouter.post("/login", async (req, res) => {
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

    res.cookie("refresh-token", refreshToken, cookieOptions());
    res.set("Access-Control-Expose-Headers", "token");
    res.set("token", accessToken);
    res.status(200).send({ token: accessToken });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

authRouter.post("/logout", (req, res, next) => {
  res.clearCookie("refresh-token");
  res.status(200).send({ message: "logged out" });
});

authRouter.get("/tokens", authenticate, async (req, res) => {
  console.log("/tokens");
  res.sendStatus(200);
});

module.exports = authRouter;
