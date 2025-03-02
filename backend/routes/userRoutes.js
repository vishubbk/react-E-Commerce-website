const express = require("express");
const { registerUser, loginUser, logoutUser, getUserProfile ,updateUserProfile,Addtocart,getCartItems,} = require("../controllers/userControllers");
const upload = require("../config/multer-config");
const authMiddleware = require("../middlewares/userAuthMiddleware");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
require("dotenv").config();

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/addtocart", Addtocart);

router.post("/logout", logoutUser);
router.get("/profile", authMiddleware, getUserProfile); // ✅ Protected Route
router.get("/getCartItems", authMiddleware, getCartItems); // ✅ Protected Route

router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const options = {
      amount: amount * 100, // Amount in paise (INR)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order" });
  }
});

// Route to verify payment
router.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    res.status(200).json({ message: "Payment verified successfully" });
  } catch (error) {
    console.error("Payment verification failed:", error);
    res.status(500).json({ message: "Error verifying payment" });
  }
});

// Route to get order details
router.get("/order/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await razorpay.orders.fetch(orderId);
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ message: "Error fetching order details" });
  }
});
router.post("/removeCart/:itemId", async (req, res) => {
  try {


    const token = req.cookies.token;
    const cartItemId = req.params.itemId; // Ye cart item ka _id hai, productId nahi

    if (!token || !cartItemId) {
      return res.status(401).json({ message: "Unauthorized: No token or Cart Item ID provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Sirf cart ke andar se cart item ka `_id` remove karo
    const updatedUser = await userModel.findByIdAndUpdate(
      user._id, // ✅ Correct User ID
      { $pull: { cart: cartItemId } }, // ✅ Directly cartItemId use kar raha hai
      { new: true }
    );;

    return res.status(200).json({ message: "Item removed successfully", cart: updatedUser.cart });

  } catch (error) {
    console.error("Error removing item from cart:", error);
    return res.status(500).json({ message: "Error removing item from cart" });
  }
});


router.post("/profile/edit", authMiddleware, upload.single("profilePicture"), updateUserProfile); // ✅ Protected Route




module.exports = router;
