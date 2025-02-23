require("dotenv").config();
const express = require("express");
const validator = require("email-validator");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

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
    console.log("New User Created:", newUser);

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // ✅ Set HTTP-Only Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Change to `true` in production
      sameSite: "Lax",
    });

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// 📌 Login User
userControllers.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔴 Validate Required Fields
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔴 Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ Compare Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // ✅ Set Cookie with Token
    res.cookie("token", token, {
      httpOnly: true,
    });

    res.status(200).json({ message: "User logged in successfully", user });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// 📌 Logout User
userControllers.logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true, secure: false, sameSite: "Lax" });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// 📌 Get User Profile
userControllers.getUserProfile = async (req, res) => {
  try {
    const token = req.cookies.token; // ✅ Retrieve Cookie

    console.log("Retrieved Cookie Token:", token);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findOne({ email: decoded.email }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = userControllers;
