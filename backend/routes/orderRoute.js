const express = require("express");
const {
  placeOrder,
  getPaymentInfo,
  cancelOrder,
} = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/placeorder",authMiddleware, placeOrder); // ✅ Protected Route
router.get("/paymentInfo", authMiddleware, getPaymentInfo); // ✅ Protected Route
// router.delete("/myorders/:orderId", authMiddleware, cancelOrder); // ✅ Protected Route

module.exports = router;
