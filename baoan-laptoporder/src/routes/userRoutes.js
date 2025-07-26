const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate } = require("../middleware/authMiddleware");

// Protect all user routes
router.use(authenticate);

router.get("/", userController.getAllUsers);
router.delete("/:userId", userController.deleteUser);

module.exports = router;
