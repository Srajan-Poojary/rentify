const express = require("express");
const connectDB = require("../db/db");
const router = express.Router();

const userRouter = require("./userRoutes");

// Health check route
router.get("/status", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

router.use("/users", userRouter);

connectDB();

module.exports = router;
