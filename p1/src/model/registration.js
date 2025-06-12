const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  registrationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Registration", registrationSchema);
