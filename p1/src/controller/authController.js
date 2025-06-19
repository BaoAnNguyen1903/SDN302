const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

module.exports = {
  registerAPI: async (req, res) => {
    const { username, password, role } = req.body;
    const user = new User({ username, password, role });
    await user.save();
    res.status(201).json({
      user,
      message: "User registered successfully"
    });
  },

  loginAPI: async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
    const token = jwt.sign(
      { id: user._id, role: user.role }, // Thêm role
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ user, token });
  },

  protectedAPI: (req, res) => {
    res.json({ message: "Access granted", userId: req.user.id });
  }
};
