const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  priceMin: { type: Number, required: true },
  priceMax: { type: Number, required: true },
  bodyType: { type: String, enum: ['SUV', 'Hatchback', 'Sedan', 'MPV', 'Coupe', 'Convertible', 'Pickup'], required: true },
  fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'], required: true },
  transmission: { type: String, enum: ['Manual', 'Automatic', 'CVT', 'DCT'] },
  seatingCapacity: { type: Number },
  image: { type: String, default: '' },
  slug: { type: String, required: true, unique: true },
  isTrending: { type: Boolean, default: false },
  isUpcoming: { type: Boolean, default: false },
  launchDate: { type: String },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  reviewCount: { type: Number, default: 0 },
  description: { type: String },
  features: [String],
  colors: [String],
  category: { type: String, enum: ['new', 'upcoming'], default: 'new' }
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);
