const Food = require("../models/foodModel");

exports.deleteFood = async (req, res) => {
  const { foodId } = req.params;
  try {
    await Food.findByIdAndDelete(foodId);
    res.json({ message: "Food deleted successfully" });
  } catch (err) {
    console.error("Delete food error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find({ isAvailable: true });
    res.json(foods);
  } catch (err) {
    console.error("Get all foods error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.createFood = async (req, res) => {
  const { name, description, price } = req.body;
  if (!name || !description || !price) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const food = await Food.create({
      name,
      description,
      price,
    });
    res.status(201).json(food);
  } catch (err) {
    console.error("Add food error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateFood = async (req, res) => {
  try {
    const { name, description, price, isAvailable } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = price;
    if (isAvailable) updateData.isAvailable = isAvailable;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields to update provided" });
    }

    const { foodId } = req.params;

    const updatedFood = await Food.findOneAndUpdate(
      { _id: foodId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedFood) {
      return res
        .status(404)
        .json({ message: "Food not found or user not authorized" });
    }

    res.json(updatedFood);
  } catch (err) {
    console.error("Update food error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
