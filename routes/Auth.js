const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { hash, verify } = require("argon2");
// models
const User = require("./../models/User");
// middlewares
const { checkExistingUser } = require("./../middlewares/VerifyUser");
const { JWT_SECRET } = require("./../config");

router.post("/register", checkExistingUser, async (req, res, next) => {
  try {
    const { password, ...rest } = req.body;

    // hash
    const passwordHash = await hash(password);
    const newUser = new User({ ...rest, password: passwordHash });
    // save user db
    const userSaved = await newUser.save();
    // create token
    const token = await jwt.sign(
      { id: userSaved._id, username: userSaved.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const userFound = await User.findOne({ username });
    if (!userFound) {
      throw new Error("User not found");
    }
    // verify
    const passwordCorrect = await verify(userFound.password, password);
    if (!passwordCorrect) {
      throw new Error("Incorrect password");
    }
    // create token
    const token = await jwt.sign(
      { id: userFound._id, username: userFound.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
});

router.get("/register", async (req, res, next) => {
  try {
    res.render("register", {});
  } catch (error) {
    next(error);
  }
});

router.get("/login", async (req, res, next) => {
  try {
    res.render("login", {});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
