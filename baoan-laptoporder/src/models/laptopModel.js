const mongoose = require("mongoose");

const laptopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name must be required"],
    },
    brand: {
      type: String,
      required: [true, "Brand must be required"],
    },
    price: {
      type: Number,
      required: [true, "Price must be required"],
      min: 0,
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    createdAt: { type: Date, default: Date.now }
  },
);

module.exports = mongoose.model("Laptop", laptopSchema);
