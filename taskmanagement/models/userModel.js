const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  fullName: {
    type: String,
    required: [true, "Full name is required"],
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 characters"],
    trim: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    required: true,
    default: "user",
  },
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
