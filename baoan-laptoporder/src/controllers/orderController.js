const Order = require("../models/orderModel");
const Laptop = require("../models/laptopModel");

exports.createOrder = async (req, res) => {
  const { laptopId, quantity } = req.body;
  const userId = req.user.userId;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ message: "Invalid or missing userId" });
  }
  if (!laptopId || typeof laptopId !== "string") {
    return res.status(400).json({ message: "Invalid or missing laptopId" });
  }
  const laptop = await Laptop.findById(laptopId);
  if (!quantity) {
    return res.status(400).json({ message: "Missing quantity" });
  }
  if (quantity > laptop.stockQuantity) {
    return res.status(400).json({ message: "Invalid quantity" });
  }
  try {
    const laptop = await Laptop.findById(laptopId);
    if (!laptop) return res.status(404).json({ message: "Laptop not found" });

    if (laptop.stockQuantity > 0) {
      const order = await Order.create({
        user: userId, 
        laptop: laptopId,
        quantity
      });
      laptop.stockQuantity -= 1;
      await laptop.save();
      res.json(order);
    } else {
      return res.status(400).json({ message: "Laptop is out of stock" });
    }
  } catch (err) {
    console.error("Order laptop error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "username")
      .populate("laptop", "name brand price")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error("Get all orders error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getOrdersByDate = async (req, res) => {
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).json({ message: "Start and end date are required" });
  }

  if (start === end || new Date(start) >= new Date(end)) {
    return res
      .status(400)
      .json({ message: "Start date must be before end date" });
  }

  try {
    const orders = await Order.find({
      createdAt: { $gte: new Date(start), $lte: new Date(end) }
    })
      .populate("user", "username")
      .populate("laptop", "name brand price");

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found in the selected date range" });
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
