const jwt = require("jsonwebtoken");
// config
const { JWT_SECRET } = require("./../config");
// models
const User = require("./../models/User");

const verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) return res.status(403).json({ message: "No token provided" });

  try {
    const user = await jwt.verify(token, JWT_SECRET);
    console.log("AUTHENTICATED TOKEN", user);
    req.user = user;

    const userFound = await User.findById(req.user.id);
    if (!userFound) return res.status(404).json({ message: "No user found" });

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
};

module.exports = { verifyToken };
