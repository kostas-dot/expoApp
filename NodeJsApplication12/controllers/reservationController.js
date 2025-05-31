const reservationService = require('../services/reservationService');

exports.createReservation = (req, res) => {
    reservationService.create(req.user.id, req.body)
            .then(result => res.json(result))
            .catch(err => res.status(500).json({error: err.message}));
};

exports.getUserReservations = async (req, res) => {
    try {
        console.log('[API] Fetching reservations for user ID:', req.user.id);
        const reservations = await reservationService.getUserReservations(req.user.id);
        console.log('[API] Reservations found:', reservations);
        res.json(reservations);
    } catch (err) {
        console.error('[API] Error fetching reservations:', err);
        res.status(500).json({error: 'Failed to fetch reservations'});
    }
};

exports.updateReservation = async (req, res) => {
  try {
    const result = await reservationService.update(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    console.error('[UpdateReservation Error]', err.message);
    res.status(500).json({ error: err.message || 'Failed to update reservation' });
  }
};

// controllers/reservationController.js
exports.deleteReservation = async (req, res) => {
  const id = req.params.id;
  console.log('[DeleteReservation] ID:', id, 'User:', req.user);

  try {
    await reservationService.remove(id);

    // ✓ Simplified, Axios-friendly JSON
    res.status(200).json({
      success: true,
      message: 'Reservation deleted successfully',
    });
  } catch (err) {
    console.error('[DeleteReservation Error]', err.message);
    res.status(500).json({
      error: err.message || 'Failed to delete reservation',
    });
  }
};








