// Import required modules
const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");

// Load environment variables
require("dotenv").config();

// Create an instance of Express
const app = express();
const port = 3000;

// Connect to the database using Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
  }
);

// Define the models (Category, Product, Tag, ProductTag)
const Category = sequelize.define("Category", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  category_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  product_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    validate: {
      isDecimal: true,
    },
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10,
    validate: {
      isNumeric: true,
    },
  },
});

const Tag = sequelize.define("Tag", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  tag_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const ProductTag = sequelize.define("ProductTag", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
});

// Define the associations between models
Category.hasMany(Product);
Product.belongsTo(Category);

Product.belongsToMany(Tag, { through: ProductTag });
Tag.belongsToMany(Product, { through: ProductTag });

// Sync the models with the database
sequelize
  .sync({ force: true }) // This will drop existing tables and recreate them
  .then(() => {
    console.log("Database synced successfully.");

    // Seed test data
    return Promise.all([
      Category.create({ category_name: "Category 1" }),
      Category.create({ category_name: "Category 2" }),
      Product.create({ product_name: "Product 1", price: 10.99, stock: 5 }),
      Product.create({ product_name: "Product 2", price: 19.99, stock: 8 }),
      Tag.create({ tag_name: "Tag 1" }),
      Tag.create({ tag_name: "Tag 2" }),
    ]);
  })
  .then(([category1, category2, product1, product2, tag1, tag2]) => {
    // Associate products with categories
    category1.addProduct(product1);
    category2.addProduct(product2);

    // Associate products with tags
    product1.addTag(tag1);
    product2.addTag(tag2);

    console.log("Test data seeded successfully.");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

// Define the API routes
app.get("/categories", (req, res) => {
  Category.findAll({ include: Product })
    .then((categories) => {
      res.json(categories);
    })
    .catch((error) => {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Internal server error" });
    });
});

app.get("/products", (req, res) => {
  Product.findAll({ include: [Category, Tag] })
    .then((products) => {
      res.json(products);
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Internal server error" });
    });
});

app.get("/tags", (req, res) => {
  Tag.findAll({ include: Product })
    .then((tags) => {
      res.json(tags);
    })
    .catch((error) => {
      console.error("Error fetching tags:", error);
      res.status(500).json({ error: "Internal server error" });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
