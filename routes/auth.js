const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../database/db');
const router = express.Router();

// US-01: Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'All fields are required' });
  try {
    const hash = await bcrypt.hash(password, 10);
    db.run(`INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`, [username, email, hash], function (err) {
      if (err) return res.status(400).json({ error: 'Username or email already exists' });
      res.status(201).json({ message: 'Account created', userId: this.lastID });
    });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// US-02: Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });
    req.session.userId = user.id;
    req.session.username = user.username;
    res.json({ message: 'Logged in', username: user.username });
  });
});

// US-02: Logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ message: 'Logged out' }));
});

// US-02: Session Check
router.get('/me', (req, res) => {
  if (req.session.userId) res.json({ loggedIn: true, username: req.session.username, diet: req.session.diet });
  else res.json({ loggedIn: false });
});

// US-03: Set Diet
router.post('/preference', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not logged in' });
  db.run(`UPDATE users SET dietary_preference = ? WHERE id = ?`, [req.body.preference, req.session.userId], (err) => {
    if (err) return res.status(500).json({ error: 'Failed' });
    req.session.diet = req.body.preference;
    res.json({ message: 'Saved' });
  });
});

module.exports = router;
