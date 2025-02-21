const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config"); // Import multer config

const {addProduct} = require("../controllers/productControllers");

router.post("/add", addProduct , upload.single("image")); // ✅ Define route properly

module.exports = router; // ✅ Export router
