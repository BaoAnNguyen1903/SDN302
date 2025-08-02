const Booking = require("../models/bookingModel");
const Studio = require("../models/studioModel");

exports.bookStudio = async (req, res) => {
  const { studioId, bookingDate, startTime } = req.body;
  const userId = req.user.userId;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ message: "Invalid or missing userId" });
  }
  if (!studioId || typeof studioId !== "string") {
    return res.status(400).json({ message: "Invalid or missing studioId" });
  }
  if (!bookingDate) {
    return res.status(400).json({ message: "Missing bookingDate" });
  }
  if (!startTime || typeof startTime !== "string") {
    return res.status(400).json({ message: "Invalid or missing startTime" });
  }
  try {
    const studio = await Studio.findById(studioId);
    if (!studio) return res.status(404).json({ message: "Studio not found" });

    const isBooked = await Booking.exists({
      studioId: studioId,
      bookingDate: bookingDate,
      startTime: startTime,
    });
    if (isBooked)
      return res.status(400).json({ message: "Studio is already booked" });
    const booking = await Booking.create({
      userId,
      studioId,
      bookingDate,
      startTime,
    });
    res.json(booking);
  } catch (err) {
    console.error("Book studio error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "email")
      .populate("studioId", "name equipment hourlyRate");
    res.json(bookings);
  } catch (err) {
    console.error("Get all bookings error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getBookingsByDate = async (req, res) => {
  const { from, to } = req.query;
  // Validate type and empty string
  if (
    typeof from !== "string" ||
    typeof to !== "string" ||
    !from.trim() ||
    !to.trim()
  ) {
    return res
      .status(400)
      .json({ message: "Start and end date must be non-empty strings" });
  }
  // Parse date
  const startDate = new Date(from);
  const endDate = new Date(to);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).json({ message: "Invalid date format" });
  }

  // Check not in the future
  // const now = new Date();
  // if (startDate > now || endDate > now) {
  //   return res
  //     .status(400)
  //     .json({ message: "Start and end date cannot be in the future" });
  // }

  // if (endDate < startDate) {
  //   return res
  //     .status(400)
  //     .json({ message: "End date must be after start date" });
  // }

  if (endDate <= startDate) {
    return res.status(400).json({ message: "Invalid date range." });
  }
  try {
    if (to.length === 10) {
      endDate.setHours(23, 59, 59, 999);
    }
    const bookings = await Booking.find({
      bookingDate: { $gte: startDate, $lte: endDate },
    })
      .populate("userId", "email")
      .populate("studioId", "name equipment hourlyRate");
    res.json(bookings);
  } catch (err) {
    console.error("Get bookings by date error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
