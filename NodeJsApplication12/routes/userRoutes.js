const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const userController = require('../controllers/userController');

// GET fresh profile from DB
router.get('/me', authenticate, userController.getMe);
// PUT updates
router.put('/me', authenticate, userController.updateMe);

module.exports = router;
