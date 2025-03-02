const express = require("express");
const Razorpay = require("razorpay");
require("dotenv").config();

const router = express.Router();


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

router.post("/create-order", async (req, res) => {
  try {
    console.log("⚡ Received Payment Request:", req.body);

    const { amount } = req.body;
    if (!amount) {
      console.log("❌ Error: Amount is missing in the request!");
      return res.status(400).json({ message: "Amount is required!" });
    }

    const options = {
      amount: amount, // Razorpay requires amount in paise
      currency: "INR",
      receipt: `order_rcptid_${Math.random() * 1000}`,
    };

    console.log("⚡ Creating Razorpay Order with options:", options);

    const order = await razorpay.orders.create(options);
    console.log("✅ Order Created Successfully:", order);

    res.json(order);
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
});

module.exports = router;
