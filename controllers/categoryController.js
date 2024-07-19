const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display a list of all categories
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();
  return res.render("category_list", {
    title: "Categories",
    categories: allCategories,
  });
});

// Display details for a specific category
exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, categoryItems] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, "name description"),
  ]);
  return res.render("category_detail", {
    title: category.name,
    category,
    categoryItems,
  });
});

// Handle create category on get
exports.category_create_get = (req, res, next) => {
  return res.render("category_form", {
    title: "Create Category",
    category: null,
    errors: null,
  });
};

// Handle create category on POST
exports.category_create_post = [
  // Validate and sanitize fields
  body("name", "Category name must contain at atleast 3 letters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description", "Category description must contain at least 3 letters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Category object with escaped and trimmed data.
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("category_form", {
        title: "Create Category",
        category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from the form is valid.
      // Check if a category with the same name exists.
      const categoryExists = await Category.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (categoryExists) {
        // Category exists. Redirect to its detail page.
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        // New category saved. Redirect to category detail page.
        res.redirect(category.url)
      }
    }
  }),
];
