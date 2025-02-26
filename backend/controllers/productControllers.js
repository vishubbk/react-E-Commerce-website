const mongoose = require("mongoose");
const productModel = require("../models/productModel");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cloudinary = require("../utiles/cloudinary");
const upload = require("../Config/multer-config");

const productControllers = {};

productControllers.addProduct = async (req, res) => {
  try {


    const { name, price, discount, bgcolor, panelcolor, textcolor, Details } = req.body;
    const image = req.file;

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    if (!name || !price || !discount || !bgcolor || !panelcolor || !textcolor || !Details) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload_stream({ folder: "products" }, async (error, result) => {
      if (error) {
        return res.status(500).json({ message: "Cloudinary upload failed", error: error.message });
      }

      const product = new productModel({
        name,
        price,
        discount,
        bgcolor,
        panelcolor,
        textcolor,
        Details,
        image: result.secure_url,
      });

      await product.save();
      res.status(200).json({ message: "Product added successfully", product });
    }).end(image.buffer);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

productControllers.getAllProducts = async (req, res) => {
  try {
  
    const products = await productModel.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

productControllers.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

productControllers.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = productControllers;