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
    const token =  req.headers.authorization?.split(" ")[1];;
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
      return res.status(404).json({ message: "Owner not found" });
    }

    // Convert profile picture buffer to Base64 if it exists
    // Convert profile picture buffer to Base64 if it exists
let profilePictureBase64 = null;

if (owner.profilePicture && owner.profilePicture.data) {
  profilePictureBase64 = `data:${owner.profilePicture.contentType};base64,${owner.profilePicture.data.toString("base64")}`;
}

// Send owner profile without password & with profile picture
const ownerData = {
  ...owner._doc,
  password: undefined, // Remove password
  profilePicture: profilePictureBase64 || null,  // Ensure null if no picture exists
};


    res.status(200).json({
      message: "Owner profile fetched successfully",
      owner: ownerData
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 📌 Owner Dashboard
ownerControllers.Ownerdashboard = async (req, res) => {
  try {
    const token =  req.headers.authorization?.split(" ")[1];;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized. Please log in first." });
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
    const { firstname, lastname, contact, email } = req.body;


    // ✅ Fetch token from cookies
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }


    // ✅ Verify token and extract email
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const ownerEmail = decoded.email;

    // ✅ Find owner by email
    const owner = await ownerModel.findOne({ email: ownerEmail });
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    // ✅ Update owner details
    if (firstname) owner.firstname = firstname;
    if (lastname) owner.lastname = lastname;
    if (contact) owner.contact = contact;

    let newToken = null; // Store new token if email changes

    // ✅ If email is updated, check for conflicts and update
    if (email && email !== owner.email) {
      const emailExists = await ownerModel.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }

      owner.email = email; // Update email
      newToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });

      // ✅ Save new token in cookies
      res.cookie("token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
    }

    // ✅ Handle profile picture upload
    if (req.file) {
      owner.profilePicture = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    await owner.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      owner,
      token: newToken || token, // ✅ Return updated token if changed
    });

  } catch (error) {
    console.error("Error updating owner profile:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

ownerControllers.OwnerAllOrders = async (req, res) => {
  try {
    const users = await userModel.find().populate({
      path: "orders.productId",
      model: "Product",
      select: "name price", // Fetching product name, price, and image
    });

    const orders = users.flatMap((user) =>
      user.orders.map((order) => ({
        orderId: order._id,
        userId: user._id,
        userName: `${user.firstname} ${user.lastname}`,
        email: user.email,
        contact: user.contact || "Not provided", // Ensure contact is included
        orderName: order.productId ? order.productId.name : "Unknown", // Ensure order name is displayed

        price: order.price,
        status: order.status,
        orderDate: order.orderDate,
      }))
    );

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};
ownerControllers.OwnerOrderStatus = async (req, res) => {
  try {
    console.log(`hit the api`)
    const { status, orderId } = req.body;
    console.log(orderId)
    console.log(status)

    const updatedUser = await userModel.findOneAndUpdate(
      { "orders._id": orderId },
      { $set: { "orders.$.status": status } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ success: true, message: "Order updated", updatedUser });
  } catch (error) {
    console.error("Server Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};





module.exports = ownerControllers;
