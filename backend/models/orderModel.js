const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" ,required: true},
  amount: Number,
  paymentMethod: String, // "COD" or "Online"
  paymentStatus: { type: String, default: "pending" },
  transactionId: String,
  status: { type: String, default: "Confirmed" },
  address: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
