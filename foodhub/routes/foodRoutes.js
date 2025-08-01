const express = require("express");
const router = express.Router();
const foodController = require("../controllers/foodController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

router.get("/", foodController.getAllFoods);

router.use(authenticate);
router.post("/", authorize("admin"), foodController.createFood);
router.put("/:foodId", authorize("admin"), foodController.updateFood);

module.exports = router;
