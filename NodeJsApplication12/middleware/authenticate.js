/* global process */
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({error: 'No token provided'});
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // add decoded info to req
        next();
    } catch (err) {
        return res.status(401).json({error: 'Invalid token'});
    }
    console.log('[JWT_SECRET]', process.env.JWT_SECRET);
    console.log('[Auth Header]', authHeader);
};
