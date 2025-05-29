const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const db = require('../config/db');

// Protected route to get current user's info
router.get('/me', authenticate, (req, res) => {
  const { id, name, email } = req.user;
  res.json({ id, name, email });
});
module.exports = router;
