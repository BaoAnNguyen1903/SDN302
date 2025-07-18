const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, appointmentController.bookAppointment);
router.get('/', auth, appointmentController.getAllAppointments);
router.get('/byDate', auth, appointmentController.getAppointmentsByDate);

module.exports = router; 