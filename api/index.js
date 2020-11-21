const express = require("express");
const api = express();

const AuthService = require("./authService");
const projectRouter = require("./routes/projects");
const userRouter = require("./routes/users");

api.get("/", (req, res) => {
  res.send({
    message: "Hello from the API",
  });
});

api.use("/auth", AuthService.authRouter);
api.use(AuthService.authenticate);
api.use("/projects", projectRouter);
api.use("/users", userRouter);

module.exports = api;
