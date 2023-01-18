const express = require("express");
const router = express.Router();
// models
const Role = require("./../models/Role");
// middlewares
const { verifyToken } = require("./../middlewares/Authenticated");
const { checkRoles } = require("./../middlewares/check");

router.get("/", async (req, res, next) => {
  try {
    const roles = await Role.find({});
    res.json(roles);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const roleFound = await Role.findById(id);
    if (!roleFound) {
      throw new Error("No role found");
    }
    res.json(roleFound);
  } catch (error) {
    next(error);
  }
});

router.post("/", verifyToken, checkRoles("admin"), async (req, res, next) => {
  try {
    const { body } = req;
    const roleSaved = await Category.create(body);
    if (!roleSaved) {
      throw new Error("Error saved category");
    }
    res.status(201).json(roleSaved);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
