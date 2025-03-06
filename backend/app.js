require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const connectdb = require("./db/db");

// Import Routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const ownerRoutes = require("./routes/ownerRoutes");

// Import Middleware
const authMiddleware = require("./middlewares/AuthMiddleware");

const app = express();
const port = process.env.PORT || 4000;

// 🔹 Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🔹 CORS Configuration (✅ Fix for cookies in frontend)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://react-e-commerce-website-knsc.onrender.com",
    ],
    credentials: true, // ✅ Allow cookies from frontend
  })
);

// 🔹 Connect to Database
connectdb().catch((err) => {
  console.error("Database connection failed:", err);
  process.exit(1);
});

// 🔹 Basic Testing Route
app.get("/", (req, res) => {
  res.send("✅ Server is running!");
});

// 🔹 Set Cookie Route (For Testing)
app.get("/set-cookie", (req, res) => {
  res.cookie("token", process.env.JWT_SECRET, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.json({ message: "Cookie has been set!" });
});

// 🔹 Get Cookie Route (To Debug Token)
app.get("/get-cookie", (req, res) => {
  console.log("Cookies received from client:", req.cookies);
  res.json({ cookies: req.cookies });
});

// 🔹 Define Routes
app.use("/products", productRoutes);
app.use("/owner", ownerRoutes);
app.use("/users", userRoutes);

// 🔹 Protected Profile Route (Requires Auth)
app.get("/users/profile", authMiddleware, (req, res) => {
  res.json({ message: "Profile data", user: req.user });
});

// 🔹 Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// 🔹 Start Server
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
