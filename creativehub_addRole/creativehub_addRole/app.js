// Entry point for MediCare Medical Appointment Booking System
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

// Import and use authentication routes
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

// Import and use user routes (protected)
const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);

// Import and use studio routes (protected)
const studioRoutes = require("./routes/studioRoutes");
app.use("/studios", studioRoutes);

// Import and use booking routes (protected)
const bookingRoutes = require("./routes/bookingRoutes");
app.use("/bookings", bookingRoutes);

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/crativehub", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
