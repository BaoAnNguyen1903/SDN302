const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const dataFilePath = path.join(__dirname, "data.json");

app.get("/data", (req, res) => {
  fs.readFile(dataFilePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read data file." });
    }
    res.json(JSON.parse(data));
  });
});

app.post("/update", (req, res) => {
  const newData = req.body;
  fs.writeFile(
    dataFilePath,
    JSON.stringify(newData, null, 2),
    "utf8",
    (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to update data file." });
      }
      res.json({ message: "Data updated successfully!", data: newData });
    }
  );
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
