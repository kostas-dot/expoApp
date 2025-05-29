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
exports.updateReservation = (req, res) => {
    reservationService.update(req.params.id, req.body)
            .then(result => res.json(result))
            .catch(err => res.status(500).json({error: err.message}));
};

exports.deleteReservation = async (req, res) => {
  const id = req.params.id;
  console.log('[DeleteReservation]', id, 'by user', req.user);

  try {
    await reservationService.remove(id);

    const responseBody = JSON.stringify({
      success: true,
      message: 'Reservation deleted successfully',
    });

    res
      .status(200)
      .set('Content-Type', 'application/json')
      .set('Content-Length', Buffer.byteLength(responseBody))
      .send(responseBody);
  } catch (err) {
    console.error('[DeleteReservation Error]', err.message);
    res
      .status(500)
      .json({ error: err.message || 'Failed to delete reservation' });
  }
};






