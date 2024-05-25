const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleErrors = (err) => {
  let errors = {
    email: "",
    passwords: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    password: "",
  };

  //   incorrect email
  if (err.message === "incorrect email") {
    errors.email = "email is not registered";
    return errors;
  }
  if (err.message === "incorrect password") {
    errors.email = "password is incorrect";
    return errors;
  }

  if (err.code === 11000) {
    //   duplicate error code
    errors.email = "email is already registered ";
    return errors;
  }
  //   validation errors
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};
const maxAge = 3 * 24 * 60 * 60; // in seconds
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

exports.signUp = async (req, res) => {
  const { email, password, first_name, last_name, phone_number } = req.body;

  try {
    const user = await User.create({
      email,
      password,
      first_name,
      last_name,
      phone_number,
    });

    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);

    const token = createToken(user._id);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

exports.logout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
