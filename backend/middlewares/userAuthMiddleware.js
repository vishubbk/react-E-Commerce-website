
const jwt = require("jsonwebtoken");

const userAuthMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
   return res.redirect("/login");

  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.redirect("/login");
  }
};

module.exports = userAuthMiddleware;
