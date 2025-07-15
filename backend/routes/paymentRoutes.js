const express = require("express");
const router = express.Router();
const { razorpay } = require("../utiles/razorPayInstance");

router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    console.log("🔹 Amount received from frontend:", amount);
    console.log("✅ Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);
    console.log("✅ Razorpay Secret:", process.env.RAZORPAY_SECRET);

    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options); // ✅ working now
    res.status(200).json(order);
  } catch (error) {
    console.error("❌ Error creating Razorpay order:", error);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
});

module.exports = router;
