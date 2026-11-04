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
  CREATE TABLE IF NOT EXISTS meals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    calories INTEGER,
    protein INTEGER,
    carbs INTEGER,
    fat INTEGER
  );
  INSERT OR IGNORE INTO meals (name, category, calories, protein, carbs, fat) VALUES
  ('Veggie Stir Fry', 'Vegetarian', 350, 12, 45, 10),
  ('Quinoa Bowl', 'Vegan', 420, 15, 50, 12),
  ('Gluten-Free Pasta', 'Gluten-Free', 480, 18, 60, 15),
  ('Chicken Salad', 'Regular', 320, 25, 10, 18);
`, (err) => {
  if (err) console.error('Schema error:', err);
  else console.log('✅ Database tables ready');
});

module.exports = db;
