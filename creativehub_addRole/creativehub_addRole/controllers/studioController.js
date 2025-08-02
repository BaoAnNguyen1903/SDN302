const Studio = require("../models/studioModel");

exports.deleteStudio = async (req, res) => {
  const { studioId } = req.params;
  try {
    await Studio.findByIdAndDelete(studioId);
    res.json({ message: "Studio deleted successfully" });
  } catch (err) {
    console.error("Delete studio error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAllStudios = async (req, res) => {
  try {
    const studios = await Studio.find();
    res.json(studios);
  } catch (err) {
    console.error("Get all studios error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.addStudio = async (req, res) => {
  const { name, equipment, hourlyRate } = req.body;
  if (!name || !equipment || !hourlyRate) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const studio = await Studio.create({
      name,
      equipment,
      hourlyRate,
    });
    res.status(201).json(studio);
  } catch (err) {
    console.error("Add studio error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
