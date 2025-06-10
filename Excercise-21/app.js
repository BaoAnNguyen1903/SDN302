const express = require("express");
const sessionMiddleware = require("./config/sessionConfig");
const articleRouter = require("./routes/articleRouter");

const app = express();
app.use(express.json());
app.use(sessionMiddleware);

app.post("/login", (req, res) => {
  const { username } = req.body;
  req.session.user = username;
  res.send("Session created");
});

app.use("/articles", articleRouter);

app.listen(3000, () => console.log("Server running on port 3000"));
