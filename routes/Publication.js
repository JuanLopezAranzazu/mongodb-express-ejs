const express = require("express");
const router = express.Router();
// models
const User = require("./../models/User");
const Publication = require("./../models/Publication");
const Category = require("./../models/Category");
// middlewares
const { verifyToken } = require("./../middlewares/Authenticated");

router.get("/", async (req, res, next) => {
  try {
    const publications = await Publication.find({})
      .populate("user")
      .populate("category");
    res.json(publications);
  } catch (error) {
    next(error);
  }
});

router.get("/filter-category", async (req, res, next) => {
  try {
    const { CategoryId } = req.body;
    const publications = await Publication.find({ category: CategoryId })
      .populate("user")
      .populate("category");
    res.json(publications);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const publicationFound = await Publication.findById(id).populate("user");
    if (!publicationFound) {
      throw new Error("No publication found");
    }
    res.json(publicationFound);
  } catch (error) {
    next(error);
  }
});

router.post("/", verifyToken, async (req, res, next) => {
  try {
    const { body, user } = req;
    const { CategoryId, ...rest } = body;
    const categoryFound = await Category.findById(CategoryId);
    if (!categoryFound) {
      throw new Error("No category found");
    }
    const publicationSaved = await Publication.create({
      ...rest,
      CategoryId,
      user: user.id,
    });
    if (!publicationSaved) {
      throw new Error("Error saved publication");
    }
    // saved publications user
    await User.findByIdAndUpdate(user.id, {
      $push: { publications: publicationSaved._id },
    });
    res.status(201).json(publicationSaved);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
