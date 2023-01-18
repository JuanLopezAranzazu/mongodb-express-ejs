const express = require("express");
const router = express.Router();
// models
const User = require("./../models/User");

router.get("/", async (req, res, next) => {
  try {
    const users = await User.find({}).populate("publications");
    console.log(users);
    res.render("index", { users });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
