const express = require("express");
const { body, validationResult } = require("express-validator");
const cookieParser = require("cookie-parser");
const authentication = require("../middlewares/userAuthMiddleware");

const {registerOwner,loginOwner,logoutOwner,getOwnerProfile,Ownerdashboard} = require("../controllers/ownerControllers");


const router = express.Router();
router.use(cookieParser());



router.post("/register", registerOwner);
router.post("/login", loginOwner);
router.post("/logout", logoutOwner);
router.get("/profile",authentication , getOwnerProfile);
router.get("/dashboard",authentication, Ownerdashboard);
// router.get("/All-Items", getItems);
// router.post("/Add-Items", AddItems);



module.exports = router;
