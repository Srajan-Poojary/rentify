const express = require("express");
const router = express.Router();

const userController = require("../controllers/userControllers");

router.post("/signup", userController.login);

module.exports = router;