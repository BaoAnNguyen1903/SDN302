require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Import and use authentication routes
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

// Import and use user routes (protected)
const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);

// Import and use book routes (protected)
const laptopRoutes = require("./routes/laptopRoutes");
app.use("/laptops", laptopRoutes);

// Import and use borrows routes (protected)
const orderRoutes = require("./routes/orderRoutes");
app.use("/orders", orderRoutes);

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/laptoporder", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
