const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config"); // ✅ Import multer-config
const {
  addProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  suggestedProduct
} = require("../controllers/productControllers");

// ✅ Corrected Route for Adding Product with multiple images
router.post(
  "/addProduct",
  upload.fields([{ name: "images", maxCount: 5 }]),
  addProduct
);

router.get("/", getAllProducts);
router.get("/suggest/:id", suggestedProduct);
router.get("/:id", getProductById);
router.delete("/:id", deleteProduct);

module.exports = router; // ✅ Export router correctly
