const express = require("express");
const { registerUser, loginUser, logoutUser, getUserProfile ,updateUserProfile} = require("../controllers/userControllers");
const upload = require("../config/multer-config");
const authMiddleware = require("../middlewares/userAuthMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile", authMiddleware, getUserProfile); // ✅ Protected Route
router.post("/profile/edit", authMiddleware, upload.single("profilePicture"), updateUserProfile); // ✅ Protected Route




module.exports = router;
