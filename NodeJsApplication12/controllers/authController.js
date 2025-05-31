const authService = require('../services/authService');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    console.log('Received from client:', req.body);
    try {
        const result = await authService.register(name, email, password); // ✅ Pass arguments correctly
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
  const { identifier, password } = req.body;
  console.log('[Login Attempt]', identifier);

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Missing credentials' });
  }

  try {
    const token = await authService.login(identifier, password);
    console.log('[Login Success]', identifier);
    res.json({ token });
  } catch (err) {
    console.error('[Login Error]', err.message);
    res.status(401).json({ error: err.message });
  }
};
