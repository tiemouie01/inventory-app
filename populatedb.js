#! /usr/bin/env node

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require("./models/category");
const Item = require("./models/item");

const categories = [];
const items = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function categoryCreate(index, name, description) {
  const category = new Category({ name: name, description: description });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function itemCreate(index, name, description, category, price, stock) {
  const item = new Item({
    name: name,
    description: description,
    category: category,
    price: price,
    stock: stock,
  });
  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(0, "Fruits", "Fresh and juicy fruits"),
    categoryCreate(1, "Vegetables", "Green and healthy vegetables"),
    categoryCreate(2, "Dairy", "Milk, cheese, and other dairy products."),
    categoryCreate(3, "Bakery", "Freshly baked bread and pastries"),
    categoryCreate(4, "Beverages", "Cold and hot beverages"),
  ]);
}

async function createItems() {
  console.log("Adding items");
  await Promise.all([
    itemCreate(0, "Apple", "A sweet red fruit", categories[0], 1200, 100),
    itemCreate(1, "Banana", "A ripe yellow fruit", categories[0], 500, 150),
    itemCreate(
      2,
      "Broccoli",
      "A healthy green vegetable",
      categories[1],
      1000,
      75
    ),
    itemCreate(
      3,
      "Carrot",
      "A crunchy orange vegetable",
      categories[1],
      800,
      120
    ),
    itemCreate(4, "Milk", "A bottle of fresh milk", categories[2], 1500, 50),
    itemCreate(
      5,
      "Cheese",
      "A block of cheddar cheese",
      categories[2],
      3000,
      30
    ),
    itemCreate(
      6,
      "Bread",
      "A loaf of whole wheat bread",
      categories[3],
      2000,
      40
    ),
    itemCreate(
      7,
      "Croissant",
      "A buttery French pastry",
      categories[3],
      1500,
      60
    ),
    itemCreate(
      8,
      "Orange Juice",
      "A bottle of fresh orange juice",
      categories[4],
      2500,
      80
    ),
    itemCreate(9, "Coffee", "A pack of ground coffee", categories[4], 4000, 25),
  ]);
}
