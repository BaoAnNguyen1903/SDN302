const Registration = require("../model/registration");
const Event = require("../model/event");

module.exports = {
  registerEvent: async (req, res) => {
    const { eventId } = req.body;
    const studentId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const currentCount = await Registration.countDocuments({ eventId });
    if (currentCount >= event.capacity) {
      return res.status(400).json({ error: "Event is full" });
    }

    const existed = await Registration.findOne({ studentId, eventId });
    if (existed) return res.status(400).json({ error: "Already registered" });

    const registration = await Registration.create({ studentId, eventId });
    res.status(201).json({ message: "Registered successfully", registration });
  },

  unregisterEvent: async (req, res) => {
    const { registrationId } = req.params;
    const registration = await Registration.findByIdAndDelete(registrationId);
    if (!registration) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Unregistered successfully" });
  },

  listRegistrations: async (req, res) => {
    const list = await Registration.find().populate("studentId eventId").limit(50);
    if (list.length === 0) return res.json({ message: "No registrations yet" });
    res.json(list);
  },

  getRegistrationsByDate: async (req, res) => {
    const { start, end } = req.query;
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (startDate >= endDate) {
      return res.status(400).json({ error: "Start date must be before end date" });
    }

    const result = await Registration.find({
      registrationDate: { $gte: startDate, $lte: endDate }
    }).populate("studentId eventId");

    res.json(result);
  }
};
