const jwt = require("jsonwebtoken");
require("dotenv").config;

exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  //   check token exists and valid
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        res.redirect("/login");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};
