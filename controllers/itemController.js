const category = require("../models/category");
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
  });
});

// Display item form on GET
exports.item_create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();

  return res.render("item_form", {
    title: "Add Item",
    categories: allCategories,
    item: null,
    errors: null,
  });
});

exports.item_create_post = [
  // Validate and sanitize fields.
  body("name", "Name must have at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description", "Description must have at least 3 colours")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("price", "Price must be greater than 0").isFloat({ gt: 0 }).toFloat(),
  body("stock", "Number in stock value must be greater than 0")
    .isFloat({ gt: 0 })
    .toFloat(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract validation errors from the request.
    const errors = validationResult(req);

    // Create an Item object with escaped and trimmed data.
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      const allCategories = await Category.find().sort({ name: 1 }).exec();

      res.render("item_form", {
        title: "Create Item",
        categories: allCategories,
        item: item,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from the form is valid.
      // Check if an item with the same name exists
      const itemExists = await Item.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();

      if (itemExists) {
        // Item exists. Redirect to its detail page.
        res.redirect(itemExists.url);
      } else {
        await item.save();
        // New item saved. Redirect to its detail page.
        res.redirect(item.url);
      }
    }
  }),
];
