// services/userService.js
const db = require('../config/db');


exports.getProfile = async (userId) => {
  const [rows] = await db.query(
    'SELECT user_id AS id, name, email FROM users WHERE user_id = ?',
    [userId]
  );
  if (rows.length === 0) {
    throw new Error('User not found');
  }
  return rows[0];
};

exports.updateProfile = async (userId, name, email) => {
  const [result] = await db.query(
    'UPDATE users SET name = ?, email = ? WHERE user_id = ?',
    [name, email, userId]
  );
  if (result.affectedRows === 0) {
    throw new Error('User not found');
  }
  return { message: 'Profile updated successfully' };
};
