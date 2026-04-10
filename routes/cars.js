const express = require('express');
const router = express.Router();
const Car = require('../models/Car');

// GET all cars with filters
router.get('/', async (req, res) => {
  try {
    const { brand, bodyType, fuelType, transmission, minPrice, maxPrice, trending, upcoming, search, limit = 20, page = 1 } = req.query;
    const filter = {};
    if (brand) filter.brand = new RegExp(brand, 'i');
    if (bodyType) filter.bodyType = bodyType;
    if (fuelType) filter.fuelType = fuelType;
    if (transmission) filter.transmission = transmission;
    if (trending === 'true') filter.isTrending = true;
    if (upcoming === 'true') filter.isUpcoming = true;
    if (search) filter.$or = [
      { name: new RegExp(search, 'i') },
      { brand: new RegExp(search, 'i') },
      { model: new RegExp(search, 'i') }
    ];
    if (minPrice || maxPrice) {
      filter.priceMin = {};
      if (minPrice) filter.priceMin.$gte = Number(minPrice);
      if (maxPrice) filter.priceMin.$lte = Number(maxPrice);
    }
    const skip = (Number(page) - 1) * Number(limit);
    const cars = await Car.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 });
    const total = await Car.countDocuments(filter);
    res.json({ success: true, data: cars, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single car
router.get('/:slug', async (req, res) => {
  try {
    const car = await Car.findOne({ slug: req.params.slug });
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' });
    res.json({ success: true, data: car });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create car
router.post('/', async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();
    res.status(201).json({ success: true, data: car });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT update car
router.put('/:id', async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' });
    res.json({ success: true, data: car });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE car
router.delete('/:id', async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' });
    res.json({ success: true, message: 'Car deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
