// controllers/userController.js
const userService = require('../services/userService');

// Existing: get current user
exports.getMe = async (req, res) => {
  try {
    // pull the fresh record from DB
    const profile = await userService.getProfile(req.user.id);
    res.json(profile);
  } catch (err) {
    console.error('[GetMe Error]', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.updateMe = async (req, res) => {
  const { name, email } = req.body;
  if (!name?.trim() || !email?.trim()) {
    return res.status(400).json({ error: 'Name and email cannot be empty' });
  }
  try {
    const result = await userService.updateProfile(req.user.id, name, email);
    res.json(result);
  } catch (err) {
    console.error('[UpdateMe Error]', err.message);
    res.status(500).json({ error: err.message });
  }
};