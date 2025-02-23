require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("email-validator");
const userModel = require("../models/userModel");

const userControllers = {};

// 📌 Register User
userControllers.registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, contact, password } = req.body;

    if (!firstname || !lastname || !email || !contact || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!validator.validate(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      firstname,
      lastname,
      email,
      contact,
      password: hashedPassword,
    });

    await newUser.save();

    // ✅ Generate Token with 7 Days Expiry
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // ✅ Secure Cookie Settings
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "Strict", // Better CSRF protection
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiry
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        firstname,
        lastname,
        email,
        contact,
      },
      token,
    });
  } catch (error) {
    console.error("Registration Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// 📌 Login User
userControllers.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ Generate Secure Token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // ✅ Store token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "User logged in successfully",
      user: { firstname: user.firstname, lastname: user.lastname, email: user.email, contact: user.contact },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// 📌 Logout User
userControllers.logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// 📌 Get User Profile
userControllers.getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.user.email }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error.message);

    // ✅ Clear invalid token on error
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = userControllers;
