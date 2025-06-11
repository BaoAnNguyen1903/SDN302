const express = require('express');
const {getHomepage} = require('../controller/homeController');
const router = express.Router();

router.get('/', getHomepage);


module.exports = router;