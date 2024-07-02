const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: String,
  description: String,
});

CategorySchema.virtual("url").get(function () {
  return `/shop/category/${this._id}`;
});

module.exports = mongoose.model("Category", CategorySchema);
