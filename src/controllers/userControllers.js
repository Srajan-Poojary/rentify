const userModel = require("../models/User");

exports.login = (req, res) => {
  console.log("User login endpoint hit");
  res.status(200).send("User logged in!");
};

exports.signUp = (req, res) => {};
