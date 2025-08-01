const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name must be required"],
    },
    description: {
      type: String,
      required: [true, "Description must be required"],
    },
    price: {
      type: Number,
      required: [true, "Price must be required"],
      min: 0,
    },
    isAvailable: {
      type: Boolean,
      required: [true, "isAvailable must be required"],
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", foodSchema);
