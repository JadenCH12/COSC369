const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'mealmatch.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    dietary_preference TEXT DEFAULT 'none',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`, (err) => {
  if (err) console.error('Schema error:', err);
  else console.log('✅ Users table ready');
});

module.exports = db;
