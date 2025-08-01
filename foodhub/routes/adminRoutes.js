const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

router.use(authenticate);

router.get("/users", authorize("admin"), userController.getAllUsers);
router.delete("/users/:userId", authorize("admin"), userController.deleteUser);

module.exports = router;
