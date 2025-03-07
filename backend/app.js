require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const connectdb = require("./db/db");
const path = require("path");

const app = express(); // ✅ App initialization
const port = process.env.PORT || 4000;

// 🔹 Connect to Database
connectdb().catch((err) => {
  console.error("❌ Database connection failed:", err);
  process.exit(1);
});

// 🔹 Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ CORS Setup
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "https://react-e-commerce-website-1.onrender.com", // Deployed Frontend
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle Preflight Requests
app.options("*", cors());

// ✅ Custom CORS Headers (Extra Security)
app.use((req, res, next) => {
  const origin = allowedOrigins.includes(req.headers.origin)
    ? req.headers.origin
    : "";
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// 🔹 Import Routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const authMiddleware = require("./middlewares/AuthMiddleware");

// 🔹 Define Routes
app.use("/products", productRoutes);
app.use("/owner", ownerRoutes);
app.use("/users", userRoutes);

// 🔹 Basic Testing Route
app.get("/", (req, res) => {
  res.send("✅ Server is running!");
});

// 🔹 Set & Get Cookie Routes (For Debugging)
app.get("/set-cookie", (req, res) => {
  res.cookie("token", process.env.JWT_SECRET, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.json({ message: "✅ Cookie has been set!" });
});

app.get("/get-cookie", (req, res) => {
  console.log("🍪 Cookies received from client:", req.cookies);
  res.json({ cookies: req.cookies });
});

// 🔹 Protected Profile Route (Requires Auth)
app.get("/users/profile", authMiddleware, (req, res) => {
  res.json({ message: "🔒 Profile data", user: req.user });
});

// 🔹 Serve Static Files (React Frontend Build)
app.use(express.static(path.join(__dirname, "frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
});

// 🔹 Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ message: "⚠️ Internal Server Error" });
});

// 🔹 Start Server
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
