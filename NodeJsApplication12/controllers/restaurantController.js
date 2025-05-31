const restaurantService = require('../services/restaurantService');

exports.getRestaurants = async (req, res) => {
  try {
    console.log('[Controller] Fetching restaurants...');
    const restaurants = await restaurantService.fetchRestaurants();
    console.log('[Controller] Restaurants fetched:', restaurants.length);
    res.json(restaurants);
  } catch (err) {
    console.error('[Controller ERROR]', err); // 👈 Add this
    res.status(500).json({ error: err.message });
  }
};


