const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },

    // UI Customization fields
    bgcolor: { type: String },
    panelcolor: { type: String },
    textcolor: { type: String },

    details: { type: String },
    information: { type: String },

    category: { type: String, required: true },   // ⭐ Suggested product logic
    rating: { type: Number, default: 0 },         // stars

    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
  },
  { timestamps: true } // auto add createdAt & updatedAt 📦
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
