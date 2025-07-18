const Appointment = require('../models/appointmentModel');
const Doctor = require('../models/doctorModel');

exports.bookAppointment = async (req, res) => {
  const { doctorId, timeSlot } = req.body;
  const userId = req.user.userId;
  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    if (!doctor.availableTimeSlots.includes(timeSlot)) {
      return res.status(400).json({ message: 'Time slot not available' });
    }
    const exists = await Appointment.exists({ doctor: doctorId, timeSlot });
    if (exists) return res.status(400).json({ message: 'Time slot already booked' });
    const appointment = new Appointment({ user: userId, doctor: doctorId, timeSlot });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ message: 'Error booking appointment' });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('user', 'username').populate('doctor', 'name specialization');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAppointmentsByDate = async (req, res) => {
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).json({ message: 'Start and end date are required' });
  }

  if (start === end || new Date(start) >= new Date(end)) {
    return res.status(400).json({ message: 'Start date must be before end date' });
  }

  try {
    const appointments = await Appointment.find({
      createdAt: { $gte: new Date(start), $lte: new Date(end) }
    })
      .populate('user', 'username')
      .populate('doctor', 'name specialization');

    if (appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found in the selected date range' });
    }

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

