require("dotenv").config(); // Load environment variables first
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const connectdb = require("./db/db");
const path = require("path");

// Import Routes
const userRoutes = require("./routes/userRoutes");
const homeRoutes = require("./routes/homeRoutes");
const productRoutes = require("./routes/productRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const orderRoutes = require("./routes/orderRoute");
const aiRoutes = require("./routes/airoute");

// Import Middleware
const authMiddleware = require("./middlewares/AuthMiddleware");

const app = express();
const port = process.env.PORT || 4000;

// 🔹 Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🔹 CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://biggest-shop-mart.onrender.com",
      "https://react-e-commerce-website-olx6.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔹 Connect to Database
connectdb()
  .then(() => console.log("✅ Database connected successfully!"))
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });

// 🔹 Simple Health Check Route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "✅ Server is running!" });
});

// 🔹 API Routes (all prefixed with /api)
app.use("/api/products", productRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/ai-help", aiRoutes);

// 🔹 Example Protected Route (optional, if not already inside userRoutes)
app.get("/api/users/profile-check", authMiddleware, (req, res) => {
  res.json({ message: "Profile data", user: req.user });
});

// 🔹 Error Handling Middleware (for API errors)
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ message: "Internal Server Error" });
});

// 🔹 Serve static files from React build folder
app.use(express.static(path.join(__dirname, "client/build")));

// 🔹 React fallback route for client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// 🔹 Start Server
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
