function cookieOptions() {
  const options = {
    httpOnly: true,
    SameSite: "none",
    // secure: process.env === "production" ? true : false,
    secure: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
  };
  return options;
}

module.exports = { cookieOptions };
