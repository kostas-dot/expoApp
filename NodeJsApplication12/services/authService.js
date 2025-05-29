/* global process */

const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (name, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
        throw new Error('Email already in use');
    }

    await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
        name,
        email,
        hashedPassword,
    ]);

    return {message: 'User registered successfully'};
};

// Make sure .env is loaded at the entry point (main.js)

exports.login = async (identifier, password) => {
    const isEmail = identifier.includes('@');
    const field = isEmail ? 'email' : 'name';

    const [results] = await db.query(
            `SELECT * FROM users WHERE ${field} = ? LIMIT 1`,
            [identifier]
            );

    if (results.length === 0) {
        throw new Error('Invalid credentials');
    }

    const user = results[0];
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
            {id: user.user_id, name: user.name, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
    );
    console.log('[Token Issued]', token);
    return token;
    
};