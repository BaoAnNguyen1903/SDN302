const Laptop = require("../models/laptopModel");

exports.deleteLatop = async (req, res) => {
  const { laptopId } = req.params;
  try {
    await Laptop.findByIdAndDelete(laptopId);
    res.json({ message: "Laptop deleted successfully" });
  } catch (err) {
    console.error("Delete Laptop error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAllLaptops = async (req, res) => {
  try {
    const laptops = await Laptop.find();
    res.json(laptops);
  } catch (err) {
    console.error("Get all laptops error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.addLaptop = async (req, res) => {
  const { name, brand, price, stockQuantity } = req.body;
  if (!name || !brand || !price || !stockQuantity) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const laptop = await Laptop.create({
      name,
      brand,
      price,
      stockQuantity,
    });
    res.status(201).json(laptop);
  } catch (err) {
    console.error("Add laptop error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
