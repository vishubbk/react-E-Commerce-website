const mongoose = require("mongoose");
const ownerModel = require("../models/ownerModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const validator = require("email-validator");
const userModel = require("../models/userModel");
require("dotenv").config();
const productModel = require("../models/productModel");

const ownerControllers = {};

// 📌 Register Owner
ownerControllers.registerOwner = async (req, res) => {
    try {
        const { firstname, lastname, email, contact, password } = req.body;

        // 🔴 Validate Required Fields
        if (!firstname || !lastname || !email || !contact || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 🔴 Validate Email Format
        if (!validator.validate(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // 🔴 Check if owner already exists
        const existingOwner = await ownerModel.findOne();
        if (existingOwner) {
            return res.status(400).json({ message: "Owner already exists. Please log in." });
        }

        // 🔴 Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 🔴 Create New Owner
        const newOwner = new ownerModel({
            firstname,
            lastname,
            email,
            contact,
            password: hashedPassword,
        });

        // 🔴 Save New Owner to Database
        await newOwner.save();

        // 🔴 Generate JWT Token
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // 🔴 Set Cookie with Token
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
        });

        // 🔴 Send Success Response
        res.status(201).json({ message: "Owner registered successfully", owner: newOwner, token });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 📌 Login Owner
ownerControllers.loginOwner = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 🔴 Validate Required Fields
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 🔴 Check if owner exists
        const owner = await ownerModel.findOne({ email });
        if (!owner) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // 🔴 Check Password
        const validPassword = await bcrypt.compare(password, owner.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // 🔴 Generate JWT Token
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // 🔴 Set Cookie with Token
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
        });

        // 🔴 Send Success Response
        res.status(200).json({ message: "Owner logged in successfully", owner, token });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 📌 Logout Owner
ownerControllers.logoutOwner = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Owner logged out successfully" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 📌 Get Owner Profile
ownerControllers.getOwnerProfile = async (req, res) => {
  try {
      const token = req.cookies.token;
      if (!token) {
          return res.status(401).json({ message: "Unauthorized" });
      }

      let decoded;
      try {
          decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
          return res.status(401).json({ message: "Invalid or expired token" });
      }

      const owner = await ownerModel.findOne({ email: decoded.email });

      if (!owner) {
          return res.status(401).json({ message: "Unauthorized" });
      }

      // Convert buffer to Base64
      let profilePictureBase64 = null;
      if (owner.profilePicture?.data) {
          profilePictureBase64 = `data:${owner.profilePicture.contentType};base64,${owner.profilePicture.data.toString("base64")}`;
      }

      res.status(200).json({
          message: "Owner profile fetched successfully",
          owner: {
              ...owner._doc,
              profilePicture: profilePictureBase64
          }
      });
  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};


// 📌 Owner Dashboard
ownerControllers.Ownerdashboard = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized. Please log in first." });
        }
        console.log("token", token);

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        const owner = await ownerModel.findOne({ email: decoded.email });

        if (!owner) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // 🔹 Get all users
        const users = await userModel.find();

        // 🔹 Get total number of users

        const totalUsers = users.length;

        // 🔹 Get all products
        const products = await productModel.find();

        // 🔹 Get total number of products
        const totalProducts = products.length;

        res.status(200).json({
            message: "Owner dashboard fetched successfully",
            owner,
            totalUsers,
            users,
            products,
            totalProducts,
            token,
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 📌 Update Owner Profile
ownerControllers.editProfile = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const owner = await ownerModel.findOne({ email: decoded.email });

    if (!owner) {
      return res.status(401).json({ message: "Owner not found" });
    }

    // Update profile fields
    owner.firstname = req.body.firstName;
    owner.lastname = req.body.lastName;
    owner.contact = req.body.phoneNumber;
    owner.bio = req.body.bio; // Added bio

    // Prevent email modification
    if (req.body.email && req.body.email !== owner.email) {
      return res.status(400).json({ message: "Email cannot be changed" });
    }

    // Handle profile image upload
    if (req.file) {
      owner.profilePicture = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    await owner.save();

    res.status(200).json({ message: "Profile updated successfully", owner });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = ownerControllers;
