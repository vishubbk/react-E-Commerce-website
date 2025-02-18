const express = require("express");
const { body, validationResult } = require("express-validator");
const cookieParser = require("cookie-parser");

const {registerUser,loginUser,logoutUser,getUserProfile} = require("../controllers/userControllers");


const router = express.Router();
router.use(cookieParser());



router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/profile", getUserProfile);



module.exports = router;
