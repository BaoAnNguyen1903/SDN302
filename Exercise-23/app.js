const express = require("express");
const cookieParser = require("cookie-parser");
const articleRouter = require("./routes/articleRouter");

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use("/articles", articleRouter);

// login route for demo
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  res.cookie("username", username);
  res.cookie("password", password);
  res.send("Cookies set");
});

app.listen(3000, () => console.log("Server running on port 3000"));
