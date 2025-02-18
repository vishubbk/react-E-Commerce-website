const express = require("express");
const { body, validationResult } = require("express-validator");
const cookieParser = require("cookie-parser");

const {registerOwner,loginOwner,logoutOwner,getOwnerProfile} = require("../controllers/ownerControllers");


const router = express.Router();
router.use(cookieParser());



router.post("/register", registerOwner);
router.post("/login", loginOwner);
router.post("/logout", logoutOwner);
router.get("/profile", getOwnerProfile);



module.exports = router;
