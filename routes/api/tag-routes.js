const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tags = Tag.findAll();
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tags = Tag.findByPk(req.params.id, {
      include: [{ model: Traveller, through: Trip, as: "location_travellers" }],
    });

    if (!tags) {
      res.status(404).json({ message: "No location found with this id!" });
      return;
    }

    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", (req, res) => {
  // create a new tag
  try {
    const tags = Tag.create(req.body);
    res.status(200).json(tags);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/:id", (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        Tags.findAll({
          where: { Tags: req.params.id },
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete("/:id", (req, res) => {
  // delete on tag by its `id` value
  try {
    const Tags = Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!Tags) {
      res.status(404).json({ message: "No location found with this id!" });
      return;
    }

    res.status(200).json(Tags);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
