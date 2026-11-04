const express = require('express');
const db = require('../database/db');
const router = express.Router();

// US-04, 05, 12: Browse, Filter, Search
router.get('/', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not logged in' });
  let sql = "SELECT * FROM meals WHERE 1=1";
  let params = [];
  
  if (req.query.category && req.query.category !== 'All' && req.query.category !== 'none') {
    sql += " AND category = ?";
    params.push(req.query.category);
  }
  if (req.query.search) {
    sql += " AND name LIKE ?";
    params.push(`%${req.query.search}%`);
  }

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

module.exports = router;
