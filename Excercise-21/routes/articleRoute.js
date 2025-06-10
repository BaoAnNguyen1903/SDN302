const express = require("express");
const router = express.Router();
const authenticate = require("../authentication/auth");

router.get("/", authenticate, (req, res) => {
  res.send("Accessed protected articles.");
});

module.exports = router;
