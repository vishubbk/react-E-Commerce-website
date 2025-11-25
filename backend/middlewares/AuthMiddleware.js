require("dotenv").config();
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // 🟡 Check authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // 🟡 Validate Bearer format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Invalid token format" });
    }

    // 🟡 Extract token
    const token = authHeader.split(" ")[1];

    // 🟡 Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🟡 Add user payload to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();

  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

module.exports = authMiddleware;
