const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

// Protect all user routes
router.use(authenticate);

router.get("/", authorize("librarian"), userController.getAllUsers);
router.delete("/:userId", authorize("librarian"), userController.deleteUser);

module.exports = router;
