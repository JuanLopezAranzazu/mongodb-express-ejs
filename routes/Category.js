const express = require("express");
const router = express.Router();
// models
const Category = require("./../models/Category");

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

module.exports = router;
