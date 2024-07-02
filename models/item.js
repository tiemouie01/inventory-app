const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { String, required: true },
  description: { String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  price: { Number, required: true },
  stock: Number,
});

ItemSchema.virtual("url").get(function () {
  return `/shop/item/${this._id}`;
});
