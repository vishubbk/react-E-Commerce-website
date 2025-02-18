require("dotenv").config();  // Ensure dotenv is required first
const express = require("express");
const http = require("http");
const config = require("config");
const cors = require("cors");
const mongoose = require("mongoose");
const connectdb = require("./db/db");
const userRoutes = require("./routes/userRoutes");
const homeRoutes = require("./routes/homeRoutes");
const productRoutes = require("./routes/productRoutes");
const ownerRoutes = require("./routes/ownerRoutes");

const app = express();
const port = process.env.PORT || 3000;

// 🔹 Connect Database
connectdb();

// 🔹 Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// 🔹 Testing Route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 🔹 Define Routes

app.use("/products", productRoutes);
app.use("/owner", ownerRoutes);
app.use("/users", userRoutes);
app.use("/home", homeRoutes);

// 🔹 Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// 🔹 Start Server
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server connected successfully on port ${port}`);
});
