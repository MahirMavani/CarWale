require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/carwale';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static files FIRST
app.use(express.static(path.join(__dirname, 'public'), {
  index: false
}));

// ✅ Images folder (optional but good)
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// ✅ MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// ✅ API Routes
app.use('/api/cars', require('./routes/cars'));
app.use('/api/brands', require('./routes/brands'));
app.use('/api/used-cars', require('./routes/usedCars'));
app.use('/api/news', require('./routes/news'));
app.use('/api/auth', require('./routes/auth'));

// ✅ MAIN ROUTE (ONLY ONCE)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// 🚀 Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:3000`);
});