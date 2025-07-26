const express = require("express");
const router = express.Router();
const laptopController = require("../controllers/laptopController");
const { authenticate } = require("../middleware/authMiddleware");

router.use(authenticate);

router.get("/", laptopController.getAllLaptops);
router.post("/", laptopController.addLaptop);
router.delete("/:laptopId", laptopController.deleteLatop);

module.exports = router;
