const mongoose = require('mongoose');

const timeSlotRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  timeSlot: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return timeSlotRegex.test(value);
      },
      message: props => `${props.value} is not a valid time slot. Expected format: HH:mm (24h)`
    }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
