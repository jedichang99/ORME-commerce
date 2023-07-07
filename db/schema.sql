-- DROP DATABASE
DROP DATABASE IF EXISTS ecommerce_db;

-- CREATE DATABASE
CREATE DATABASE ecommerce_db;

USE ecommerce_db;

-- Create the Category table
CREATE TABLE Category (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category_name VARCHAR(255) NOT NULL
);

-- Create the Product table
CREATE TABLE Product (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 10,
  category_id INT,
  FOREIGN KEY (category_id) REFERENCES Category(id)
);

-- Create the Tag table
CREATE TABLE Tag (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tag_name VARCHAR(255) NOT NULL
);

-- Create the ProductTag table
CREATE TABLE ProductTag (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT,
  tag_id INT,
  FOREIGN KEY (product_id) REFERENCES Product(id),
  FOREIGN KEY (tag_id) REFERENCES Tag(id)
);
