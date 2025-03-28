require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("email-validator");
const userModel = require("../models/userModel");
const cartModel = require("../models/productModel");


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
    const token = jwt.sign({ email }, process.env.JWT_SECRET);

    // ✅ Secure Cookie Settings
    res.cookie("token", token, {
      httpOnly: true,

    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        token,
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
    const token = jwt.sign({ email }, process.env.JWT_SECRET);

    // ✅ Store token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
    });

    res.status(200).json({
      message: "User logged in successfully",
      user: { firstname: user.firstname, lastname: user.lastname, email: user.email, contact: user.contact },
      token, // ✅ Send token in response so frontend can store it in localStorage
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

    });

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// 📌 remove cart
userControllers.removeCart = async (req, res) => {
  try {
    console.log("🔹 Hit removeCart API");

    // ✅ Fetch token from cookies
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    if (!user.cart.includes(productId)) {
      return res.status(400).json({ message: "Product is not in the cart" });
    }
    // �� Remove the product from the user's cart using Mongoose's update operation



    const user = await userModel.findOneAndUpdate(
      { email: decoded.email },
      { $pull: { cart: { _id: productId } } }, // 🔥 Remove only the matching product
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "Item removed from cart", cart: user.cart });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


//Add to cart route
userControllers.Addtocart = async (req, res) => {
  try {

    const token = req.cookies.token;

    const productIda = req.params.id;


    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    if (!user.cart.includes(productId)) {
      user.cart.push(productId);
      await user.save();
    }

    return res.status(200).json({ message: "Product added to cart successfully", cart: user.cart });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get Add to cart Route
userControllers.getCartItems = async (req, res) => {
  try {
    const token = req.cookies.token;
    const productId = req.params.itemId;


    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartItems = await cartModel.find({ _id: { $in: user.cart } });

    if (!cartItems || cartItems.length === 0) {
      console.warn("⚠️ No items in cart for user:", email);
      return res.status(200).json([]); // Send an empty array if no items
    }



    return res.status(200).json(cartItems); // ✅ Send the array directly
  } catch (error) {
    console.error("Error in getCartItems:", error.message);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
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
      address: user.address,

      profilePicture: profilePictureBase64, // ✅ Base64 format me send ho rahi hai
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });

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


//Post Update user profile page
userControllers.updateUserProfile = async (req, res) => {
  try {
    const { firstname, lastname, contact, email, address } = req.body;

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

    // ✅ Update Address
    if (address) {
      const parsedAddress = JSON.parse(address);
      user.address = {
        street: parsedAddress.street || user.address.street,
        city: parsedAddress.city || user.address.city,
        state: parsedAddress.state || user.address.state,
        country: parsedAddress.country || user.address.country,
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




// 📌 Buynow User
userControllers.buynowSuccessful = async (req, res) => {
  try {
    const { id: productId } = req.params; // Get product ID from URL
    const { quantity } = req.body; // Get quantity from request body

    // Check if token exists
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify JWT and extract user email
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.email;

    // Find the user
    const user = await userModel.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the product details
    const product = await cartModel.findById(productId);
    console.log("��� Product:", product);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Calculate total price
    const totalPrice = product.price * (quantity || 1);

    // Create order object
    const newOrder = {
      productId,
      quantity: quantity || 1, // Default 1 if not provided
      price: totalPrice,
      status: "pending",
      orderDate: new Date(),
    };

    // Add order to the user's order list
    user.orders.push(newOrder);
    await user.save(); // Save the updated user

    return res.status(201).json({
      message: "Order placed successfully!",
      order: newOrder,
    });

  } catch (error) {
    console.error("🚨 Order Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//MyOrders

const Product = require("../models/productModel"); // Import Product model

userControllers.MyOrders = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.email;

    const user = await userModel.findOne({ email: userEmail }).populate("orders");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch product details for each order using productId
    const ordersWithProductDetails = await Promise.all(
      user.orders.map(async (order) => {
        const product = await Product.findById(order.productId);


        return {
          _id: order._id,
          name: product?.name || "Unknown Product",
          image: product?.image || "",
          price: product?.price || order.price, // If price isn't in product, fallback to order price
          quantity: order.quantity,
          status: order.status,
          orderDate: order.orderDate,
        };
      })
    );

    return res.status(200).json(ordersWithProductDetails);
  } catch (error) {
    console.error("MyOrders Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



module.exports = userControllers;
