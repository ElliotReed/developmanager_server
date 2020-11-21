const userRouter = require("express").Router();
const bcrypt = require("bcryptjs");

const db = require("../../models");
const Op = db.Sequelize.Op;

const {
  registerValidation,
  loginValidation,
} = require("../authService/validation");

/* GET users listing. */
userRouter.get("/", async function (req, res, next) {
  const users = await db.user.findAll();
  res.send(users);
});

userRouter.post("/", async (req, res, next) => {
  const { error } = registerValidation(req.body);
  if (error)
    return res.status(400).send({ error: `${error.details[0].message}` });

  const { email, password } = req.body;
  try {
    const user = await db.user.findOne({
      where: {
        email: { [Op.eq]: email },
      },
    });

    if (user) throw new Error("User already exists");
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.user.create({
      email: email,
      password: hashedPassword,
    });
    res.status(201).send({ user: newUser });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

userRouter.get("/user", async (req, res, next) => {
  const userId = req.user.id;

  const user = await db.user.findOne({
    where: {
      id: { [Op.eq]: userId },
    },
  });

  if (!user) throw new Error("User doesn't exist");

  delete user.dataValues.password;
  res.status(200).json(user);
});

module.exports = userRouter;
