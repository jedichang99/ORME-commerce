const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

router.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: Product,
    });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: Product,
    });

    if (!category) {
      res.status(404).json({ message: "No category found with this id!" });
      return;
    }

    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      res.status(404).json({ message: "No category found with this id!" });
      return;
    }

    await category.update(req.body);
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      res.status(404).json({ message: "No category found with this id!" });
      return;
    }

    await category.destroy();
    res.status(200).json({ message: "Category deleted successfully." });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
