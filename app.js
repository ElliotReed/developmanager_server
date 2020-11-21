require("dotenv/config");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const api = require("./api");

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

app.use("/api", api);

app.use((req, res, next) => {
  res.status = 404;
  const error = new Error(
    `The url: ${req.originalUrl} was not found on this server.`
  );
  next(error);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode || 500);
  res.json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = app;
