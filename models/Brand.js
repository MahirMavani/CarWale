const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  logo: { type: String, default: '' },
  slug: { type: String, required: true, unique: true },
  country: { type: String },
  isPopular: { type: Boolean, default: false },
  carCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Brand', brandSchema);
