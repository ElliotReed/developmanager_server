require("dotenv/config");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./routes/index");
// const authRouter = require("./routes/auth");
const projectsRouter = require("./routes/projects");
const usersRouter = require("./routes/users");
// const verify = require("./routes/verifyToken");

const AuthService = require("./services/authService");

const corsOptions = {
  origin:
    process.env === "production"
      ? process.env.DEPLOYED_HOST
      : process.env.LOCAL_HOST,
  credentials: true,
};

const app = express();

app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/", indexRouter);
app.use("/api/auth", AuthService.authRouter);
app.use(AuthService.verify);
app.use("/api/users", usersRouter);
app.use("/api/projects", projectsRouter);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.send({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
