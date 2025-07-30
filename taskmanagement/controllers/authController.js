const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    console.log("Login userId:", user._id);
    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Register user
exports.register = async (req, res) => {
  const { username, fullName, password, role } = req.body;
  if (!username || !fullName || !password || !role) {
    return res
      .status(400)
      .json({ message: "Username, fullName, password, and role are required" });
  }
  try {
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ message: "Username already exists" });
    }
    const user = new User({ username, fullName, password, role });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
