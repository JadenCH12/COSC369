const express = require('express');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'mealmatch-secret',
  resave: false,
  saveUninitialized: false
}));

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 MealMatch running at http://localhost:${PORT}`);
});
