const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
  },
  status: {
    type: String,
    required: [true, "Status is required"],
    enum: ["To Do", "In Progress", "Done"],
    default: "To Do",
    trim: true,
  },
  priority: {
    type: String,
    required: [true, "Priority is required"],
    enum: ["Low", "Medium", "High"],
    default: "Medium",
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: (v) => mongoose.Types.ObjectId.isValid(v),
      message: "Invalid userId",
    },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Task", taskSchema);
