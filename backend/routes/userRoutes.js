const express = require("express");
const { registerUser, loginUser, logoutUser, getUserProfile } = require("../controllers/userControllers");
const authMiddleware = require("../middlewares/userAuthMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile", authMiddleware, getUserProfile); // ✅ Protected Route

module.exports = router;
