const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticate } = require("../middleware/authMiddleware");

// All booking routes are protected
router.use(authenticate);

router.post("/", orderController.createOrder);
router.get("/", orderController.getAllOrders);
router.get("/ordersByDate", orderController.getOrdersByDate);

module.exports = router;
