const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const userController = require("../controllers/userController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

router.use(authenticate);

router.get("/users", authorize("admin"), userController.getAllUsers);
router.get("/tasks", authorize("admin"), taskController.getAllTasks);

module.exports = router;
