const mongoose = require("mongoose");

// Define the schema
const productSchema = new mongoose.Schema({
  name: {
    type: String, required: true
  },
  price: {
    type: Number, required: true
  },
  discount: {
    type: Number, default: 0
  },
  bgcolor: {
    type: String
  },
  panelcolor: {
    type: String
  },
  textcolor: {
    type: String
  },
  Details: {
    type: String
  },
  image: {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
  },
});

// Create the model
const Product = mongoose.model("Product", productSchema);

// Export the model
module.exports = Product;
