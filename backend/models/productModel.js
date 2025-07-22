// models/productModel.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  bgcolor: { type: String },
  panelcolor: { type: String },
  textcolor: { type: String },
  details: { type: String },
  information: { type: String },
  image: {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
  },
});

// Create the Product model if it doesn't already exist
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
