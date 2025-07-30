require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

const taskRoutes = require("./routes/taskRoutes");
app.use("/tasks", taskRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 3000;

mongoose
  .connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/task_management",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
