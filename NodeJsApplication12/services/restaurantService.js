const db = require('../config/db');

exports.fetchRestaurants = async () => {
  const [results] = await db.query('SELECT * FROM restaurants');
  return results;
};
