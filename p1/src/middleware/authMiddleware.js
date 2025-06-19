const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader) return res.status(401).json({ error: "Access denied" });

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Decoded user:", decoded);
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    res.status(400).json({ error: "Invalid token" });
  }
};
