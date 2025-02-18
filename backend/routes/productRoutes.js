const express = require("express");
const router = express.Router();
const productControllers = require("../controllers/productControllers");

router.post("/add", productControllers.addProduct); // ✅ Define route properly

module.exports = router; // ✅ Export router
