const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: Product,
    });
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: Product,
    });

    if (!tag) {
      res.status(404).json({ message: "No tag found with this id!" });
      return;
    }

    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const tag = await Tag.create(req.body);
    res.status(200).json(tag);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);

    if (!tag) {
      res.status(404).json({ message: "No tag found with this id!" });
      return;
    }

    await tag.update(req.body);

    if (req.body.tagIds && req.body.tagIds.length) {
      const tagProducts = req.body.tagIds.map((productId) => {
        return {
          product_id: productId,
          tag_id: tag.id,
        };
      });

      await ProductTag.destroy({ where: { tag_id: tag.id } });
      await ProductTag.bulkCreate(tagProducts);
    }

    res.status(200).json(tag);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);

    if (!tag) {
      res.status(404).json({ message: "No tag found with this id!" });
      return;
    }

    await ProductTag.destroy({ where: { tag_id: tag.id } });
    await tag.destroy();

    res.status(200).json({ message: "Tag deleted successfully." });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
