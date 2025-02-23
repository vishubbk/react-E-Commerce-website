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
    const user = await userModel
      .findOne({ email: req.user.email })
      .select("-password"); // Password hata diya response se

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Convert Buffer to Base64 (agar image buffer format me ho)
    let profilePictureBase64 = null;
    if (user.profilePicture && user.profilePicture.data) {
      profilePictureBase64 = `data:${user.profilePicture.contentType};base64,${user.profilePicture.data.toString("base64")}`;
    }

    res.status(200).json({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      contact: user.contact,
      profilePicture: profilePictureBase64, // ✅ Base64 format me send ho rahi hai
    });
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



userControllers.updateUserProfile = async (req, res) => {
  try {
    const { firstname, lastname, contact, email } = req.body;

    // ✅ Token fetch karo cookies se
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // ✅ Token verify karke email nikalo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.email; // JWT se email extract kiya

    // ✅ Ab database se user dhoondo using JWT email
    const user = await userModel.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Update user fields
    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (contact) user.contact = contact;

    let newToken = null; // Store new token if email changes

    // ✅ Agar email change ho raha hai toh naye email ka check karo
    if (email && email !== user.email) {
      const emailExists = await userModel.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }

      user.email = email; // Update email
      newToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" }); // ✅ Generate new token

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
      user.profilePicture = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
      token: newToken || token, // ✅ Return updated token if changed
    });

  } catch (error) {
    console.error("Error updating user profile:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



module.exports = userControllers;
