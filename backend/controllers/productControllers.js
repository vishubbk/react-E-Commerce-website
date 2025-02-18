const mongoose = require("mongoose");
const ownerModel = require("../models/ownerModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const validator = require("email-validator");
require("dotenv").config();


const productControllers = {};

productControllers.addProduct = (req,res)=>{
  try {
    console.log("hello, I am product");
    res.status(200).json({ message: "Product added successfully" }); // ✅ Send response
  } catch (error) {
    console.error(error); // ✅ Log the error
    res.status(500).json({ error: "Internal Server Error" }); // ✅ Send error response
  }
}





module.exports = productControllers;