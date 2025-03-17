const jwt = require("jsonwebtoken");

const AuthMiddleware = (req, res, next) => {
  // Token ko check karo (Cookies ya Headers se)
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.warn("Unauthorized: No token provided");
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    // Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // User information request me store karo
    req.user = decoded;

    console.log("User Authenticated:", decoded);
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized: Token expired" });
    }

    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = AuthMiddleware;
