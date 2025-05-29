const db = require('../config/db');

exports.create = async (userId, data) => {
  const { restaurant_id, date, time, people_count } = data;
  try {
    await db.query(
      'INSERT INTO reservations (user_id, restaurant_id, date, time, people_count) VALUES (?, ?, ?, ?, ?)',
      [userId, restaurant_id, date, time, people_count]
    );
    return { message: 'Reservation created successfully' };
  } catch (err) {
    throw err;
  }
};

exports.getUserReservations = async (userId) => {
  try {
    const [results] = await db.query(`
      SELECT
        r.*,
        rest.name AS restaurant_name,
        rest.location,
        rest.description
      FROM reservations r
      JOIN restaurants rest ON r.restaurant_id = rest.restaurant_id
      WHERE r.user_id = ?
    `, [userId]);

    return results;
  } catch (err) {
    throw err;
  }
};

exports.getByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    const query = `
    SELECT r.reservation_id, r.date, r.time, r.people_count,
            res.restaurant_id, res.name AS restaurant_name,
            res.location, res.description
    FROM reservations r
    JOIN restaurants res ON r.restaurant_id = res.restaurant_id
    WHERE r.user_id = ?
    ORDER BY r.date DESC
    `;

    db.query(query, [userId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};



exports.remove = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      'DELETE FROM reservations WHERE reservation_id = ?',
      [id],
      (err, results) => {
        if (err) {
          console.error('[DB Delete Error]', err);  // <- Add this
          return reject(err);
        }

        if (results.affectedRows === 0) {
          console.warn('[DeleteReservation] No reservation found with ID', id);  // <- Add this
          return reject(new Error('Reservation not found'));
        }

        console.log('[DeleteReservation] Deleted reservation ID', id);  // <- Add this
        resolve({ message: 'Reservation deleted' });
      }
    );
  });
};
