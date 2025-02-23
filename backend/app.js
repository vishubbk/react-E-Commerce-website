require("dotenv").config(); // Load environment variables first
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const connectdb = require("./db/db");
const userRoutes = require("./routes/userRoutes");
const homeRoutes = require("./routes/homeRoutes");
const productRoutes = require("./routes/productRoutes");
const ownerRoutes = require("./routes/ownerRoutes");

const app = express();
const port = process.env.PORT || 3000;

// 🔹 Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Change this to your frontend URL
    credentials: true, // Allows cookies to be sent with requests
  })
);

// 🔹 Connect Database
connectdb().catch((err) => {
  console.error("Database connection failed:", err);
  process.exit(1);
});

// 🔹 Testing Route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 🔹 Set Cookie Route (Fixed)
app.get("/set-cookie", (req, res) => {
  res.cookie("token", process.env.JWT_SECRET, {
    httpOnly: false, // Change to `true` if you don't want frontend access
    secure: false,   // Set to `true` in production with HTTPS
    sameSite: "Lax", // Use "None" for cross-domain requests with `Secure`
  });
  res.json({ message: "Cookie has been set!" });
});
``
// 🔹 Get Cookie Route
app.get("/get-cookie", (req, res) => {
  console.log("Cookies received from client:", req.cookies);
  res.json({ cookies: req.cookies });
});

// 🔹 Define Routes
app.use("/products", productRoutes);
app.use("/owner", ownerRoutes);
app.use("/users", userRoutes);
app.use("/home", homeRoutes);

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
