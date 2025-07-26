const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: (v) => mongoose.Types.ObjectId.isValid(v),
      message: "Invalid userId"
    }
  },
  laptop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Laptop",
    required: true,
    validate: {
      validator: (v) => mongoose.Types.ObjectId.isValid(v),
      message: "Invalid Laptop ID"
    }
  },
  quantity: {
    type: Number,
    min: 0,
    required: [true, "Quantity is required"]
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
