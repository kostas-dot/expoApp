const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const authenticate = require('../middleware/authenticate');

router.post('/', authenticate, reservationController.createReservation);
router.get('/my', authenticate, reservationController.getUserReservations);
router.put('/:id', authenticate, reservationController.updateReservation);
router.delete('/:id', authenticate, reservationController.deleteReservation);
router.put('/:id', authenticate, reservationController.updateReservation);

module.exports = router;
