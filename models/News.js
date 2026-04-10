const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String },
  content: { type: String },
  author: { type: String, default: 'CarWale Team' },
  category: { type: String, enum: ['News', 'Review', 'Video', 'Launch'], default: 'News' },
  image: { type: String, default: '' },
  slug: { type: String, unique: true },
  views: { type: Number, default: 0 },
  publishedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);
