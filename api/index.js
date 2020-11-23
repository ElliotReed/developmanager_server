const express = require("express");
const api = express();

const authService = require("./authService");
const projectRouter = require("./routes/projects");
const userRouter = require("./routes/users");

api.get("/", (req, res) => {
  res.send({
    message: "Hello from the API",
  });
});

api.use("/auth", authService.authRouter);
api.use(authService.authenticate);
api.use("/projects", projectRouter);
api.use("/users", userRouter);

module.exports = api;
