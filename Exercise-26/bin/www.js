#!/usr/bin/env node

const https = require("https");
const fs = require("fs");
const app = require("../app");

const port = process.env.PORT || 3000;
app.set("port", port);

const options = {
  key: fs.readFileSync(__dirname + "/key.pem"),
  cert: fs.readFileSync(__dirname + "/cert.pem"),
};

const server = https.createServer(options, app);
server.listen(port, () => {
  console.log("HTTPS server running at https://localhost:" + port);
});
