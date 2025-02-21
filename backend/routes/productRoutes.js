const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config"); // Import multer config

const {addProduct,getAllProducts,getProductById,deleteProduct} = require("../controllers/productControllers");

router.post("/add", addProduct , upload.single("image")); 
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.delete("/:id", deleteProduct);

module.exports = router; // ✅ Export router
