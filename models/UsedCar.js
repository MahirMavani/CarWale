const mongoose = require('mongoose');

const usedCarSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  km: { type: Number, required: true },
  fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'] },
  transmission: { type: String, enum: ['Manual', 'Automatic'] },
  city: { type: String, required: true },
  image: { type: String, default: '' },
  owner: { type: String, enum: ['1st Owner', '2nd Owner', '3rd Owner', '4th+ Owner'], default: '1st Owner' },
  description: { type: String },
  isCertified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('UsedCar', usedCarSchema);
