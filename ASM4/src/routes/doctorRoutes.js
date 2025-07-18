const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, doctorController.createDoctor);
router.get('/', auth, doctorController.getAllDoctors);

module.exports = router; 