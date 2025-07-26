const User = require("../models/userModel");
const Order = require("../models/orderModel");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const hasOrder = await Order.exists({ userId });
    if (hasOrder) {
      return res
        .status(400)
        .json({ message: "Cannot delete users with existing orders." });
    }
    await User.findByIdAndDelete(userId);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
