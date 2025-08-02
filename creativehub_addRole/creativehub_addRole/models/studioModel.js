const mongoose = require("mongoose");

const studioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [3, "Name must be at least 3 characters"],
    trim: true,
  },
  equipment: [
    {
      type: String,
      required: true,
      minlength: [3, "Equipment must be at least 3 characters"],
      trim: true,
    },
  ],
  hourlyRate: {
    type: Number,
    required: true,
    min: 0,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Studio", studioSchema);
