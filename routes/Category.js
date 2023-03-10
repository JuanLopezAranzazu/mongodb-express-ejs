const express = require("express");
const router = express.Router();
// models
const Category = require("./../models/Category");
// middlewares
const { verifyToken } = require("./../middlewares/Authenticated");
const { checkRoles } = require("./../middlewares/check");

router.get("/", async (req, res, next) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const categoryFound = await Category.findById(id);
    if (!categoryFound) {
      throw new Error("No category found");
    }
    res.json(categoryFound);
  } catch (error) {
    next(error);
  }
});

router.post("/", verifyToken, checkRoles("admin"), async (req, res, next) => {
  try {
    const { body } = req;
    const categorySaved = await Category.create(body);
    if (!categorySaved) {
      throw new Error("Error saved category");
    }
    res.status(201).json(categorySaved);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
