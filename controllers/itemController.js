const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
  // Get counts of of all categories and items.

  const [numCategories, numItems] = await Promise.all([
    Category.countDocuments({}).exec(),
    Item.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Home",
    category_count: numCategories,
    item_count: numItems,
  });
});

// Display a list of all items
exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find().populate("category").exec();

  return res.render("item_list", {
    title: "Items",
    items: allItems,
  });
});

// Display details for a specific item.
exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate("category").exec();

  return res.render("item_detail", {
    title: item.name,
    item,
  })
})