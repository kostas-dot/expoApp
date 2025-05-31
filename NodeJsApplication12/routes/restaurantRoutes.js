const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const authenticate = require('../middleware/authenticate');

router.get('/', authenticate, restaurantController.getRestaurants);

module.exports = router;
