const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // ✅ Extract token from cookies instead of headers
  const token = req.cookies.token;
  console.log("Received Token from Cookies:", token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    // ✅ Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = authMiddleware;
