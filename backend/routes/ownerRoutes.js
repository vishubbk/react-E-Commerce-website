const express = require("express");
const { body, validationResult } = require("express-validator");
const cookieParser = require("cookie-parser");
const authentication = require("../middlewares/userAuthMiddleware");
const upload = require("../config/multer-config");
const {
  registerOwner,
  loginOwner,
  logoutOwner,
  getOwnerProfile,
  Ownerdashboard,
  editProfile,
  OwnerAllOrders
} = require("../controllers/ownerControllers");

const router = express.Router();
router.use(cookieParser());

// Auth routes
router.post("/register", registerOwner);
router.post("/login", loginOwner);
router.post("/logout", logoutOwner);

// Protected routes
router.get("/profile", authentication, getOwnerProfile);
router.get("/dashboard", authentication, Ownerdashboard);
router.get("/orders", OwnerAllOrders);
router.post("/editprofile",
  authentication,
  upload.single("profilePicture"),
  editProfile
);

module.exports = router;
