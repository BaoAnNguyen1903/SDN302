const User = require('../models/userModel');
const Appointment = require('../models/appointmentModel');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const hasAppointment = await Appointment.exists({ user: userId });
    if (hasAppointment) {
      return res.status(400).json({ message: 'Cannot delete users with existing appointments.' });
    }
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 