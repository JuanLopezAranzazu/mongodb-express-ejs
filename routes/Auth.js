const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { hash, verify } = require("argon2");
// models
const User = require("./../models/User");
const Role = require("./../models/Role");
// middlewares
const { checkExistingUser } = require("./../middlewares/VerifyUser");
const { JWT_SECRET } = require("./../config");

router.post("/register", checkExistingUser, async (req, res, next) => {
  try {
    const { roles, password, ...rest } = req.body;
    // hash
    const passwordHash = await hash(password);
    const newUser = new User({ ...rest, password: passwordHash });

    if (roles) {
      const rolesFound = await Role.find({ name: { $in: roles } });
      newUser.roles = rolesFound.map((role) => role._id);
    } else {
      const role = await Role.findOne({ name: "user" });
      newUser.roles = [role._id];
    }
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
