const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

// All booking routes are protected
router.use(authenticate);

router.post("/", bookingController.bookStudio);
router.get("/", authorize("admin"), bookingController.getAllBookings);
router.get(
  "/bookingsByDate",
  authorize("admin"),
  bookingController.getBookingsByDate
);

module.exports = router;
