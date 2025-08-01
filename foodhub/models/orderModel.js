const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: (v) => mongoose.Types.ObjectId.isValid(v),
        message: "Invalid userId",
      },
    },
    items: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          required: true,
          validate: {
            validator: (v) => mongoose.Types.ObjectId.isValid(v),
            message: "Invalid Food ID",
          },
        },
        quantity: {
          type: Number,
          min: 0,
          required: [true, "Quantity is required"],
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: [true, "Total Price is required"],
    },
    deliveryAddress: {
      type: String,
      required: [true, "Delivery Address must be required"],
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Delivered", "Cancelled"],
      default: "Pending",
      required: [true, "Status Address must be required"],
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
