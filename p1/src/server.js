const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const apiRoutes = require("./route/api");
const app = express();

// config req.body
app.use(express.json()); // for json
app.use(express.urlencoded({ extended: true })); // for form data

//route
app.use("/v1/api/", apiRoutes);

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
