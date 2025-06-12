const express = require("express");
const authController = require("../controller/authController");
const router = express.Router();


router.post("/login", authController.loginAPI);
module.exports = router;