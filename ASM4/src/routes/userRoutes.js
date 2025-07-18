const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware');

router.get('/', auth, userController.getAllUsers);
router.delete('/:userId', auth, userController.deleteUser);

module.exports = router; 