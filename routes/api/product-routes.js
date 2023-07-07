const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [Category, Tag],
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get one product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [Category, Tag],
    });

    if (!product) {
      res.status(404).json({ message: "No product found with this id!" });
      return;
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new product
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);

    if (req.body.tagIds && req.body.tagIds.length) {
      const productTags = req.body.tagIds.map((tagId) => {
        return {
          product_id: product.id,
          tag_id: tagId,
        };
      });
      await ProductTag.bulkCreate(productTags);
    }

    res.status(201).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Update a product by ID
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      res.status(404).json({ message: "No product found with this id!" });
      return;
    }

    await product.update(req.body);

    if (req.body.tagIds && req.body.tagIds.length) {
      const productTags = req.body.tagIds.map((tagId) => {
        return {
          product_id: product.id,
          tag_id: tagId,
        };
      });

      await ProductTag.destroy({ where: { product_id: product.id } });
      await ProductTag.bulkCreate(productTags);
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Delete a product by ID
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      res.status(404).json({ message: "No product found with this id!" });
      return;
    }

    await ProductTag.destroy({ where: { product_id: product.id } });
    await product.destroy();

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
