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

exports.getUserById = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(req.user.userId);
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ message: "Invalid or missing userId" });
    }

    const user = await User.findById(userId, "-password");
    res.json(user);
  } catch (err) {
    console.log(req.user.userId);

    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const hasOrderActive = await Order.exists({
      user: userId,
      status: { $in: ["Pending", "Confirmed"] },
    });
    if (hasOrderActive) {
      return res
        .status(400)
        .json({ message: "Cannot delete a customer with active orders." });
    }
    await User.findByIdAndDelete(userId);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
