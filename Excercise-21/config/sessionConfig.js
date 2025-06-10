const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/session-demo");

const sessionMiddleware = session({
  secret: "mySecret",
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: "mongodb://localhost:27017/session-demo" })
});

module.exports = sessionMiddleware;
