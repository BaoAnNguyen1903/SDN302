const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

router.use(authenticate);

//Admin
router.get("/", authorize("admin"), orderController.getAllOrders);
router.patch(
  "/:orderId/status",
  authorize("admin"),
  orderController.updateOrderStatus
);

//Customer
router.post("/", authorize("customer"), orderController.createOrder);
router.get(
  "/my-history",
  authorize("customer"),
  orderController.getMyOrderHistory
);

module.exports = router;
