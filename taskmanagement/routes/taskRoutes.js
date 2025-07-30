const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const { authenticate } = require("../middleware/authMiddleware");

router.use(authenticate);

router.get("/", taskController.getAllTasksByUserId);
router.post("/", taskController.addTask);
router.put("/:taskId", taskController.updateTask);
router.delete("/:taskId", taskController.deleteTask);

module.exports = router;
