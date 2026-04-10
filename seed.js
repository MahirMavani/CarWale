require('dotenv').config();
const mongoose = require('mongoose');
const Car = require('./models/Car');
const Brand = require('./models/Brand');
const UsedCar = require('./models/UsedCar');
const News = require('./models/News');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/carwale';

const brands = [
  { name: 'Maruti Suzuki', slug: 'maruti-suzuki', country: 'Japan/India', isPopular: true, carCount: 18 },
  { name: 'Tata', slug: 'tata', country: 'India', isPopular: true, carCount: 15 },
  { name: 'Mahindra', slug: 'mahindra', country: 'India', isPopular: true, carCount: 12 },
  { name: 'Hyundai', slug: 'hyundai', country: 'South Korea', isPopular: true, carCount: 14 },
  { name: 'Toyota', slug: 'toyota', country: 'Japan', isPopular: true, carCount: 10 },
  { name: 'Kia', slug: 'kia', country: 'South Korea', isPopular: true, carCount: 8 },
  { name: 'Skoda', slug: 'skoda', country: 'Czech Republic', isPopular: true, carCount: 6 },
  { name: 'BMW', slug: 'bmw', country: 'Germany', isPopular: true, carCount: 20 },
  { name: 'Renault', slug: 'renault', country: 'France', isPopular: true, carCount: 7 },
  { name: 'Nissan', slug: 'nissan', country: 'Japan', isPopular: true, carCount: 5 },
  { name: 'Mercedes-Benz', slug: 'mercedes-benz', country: 'Germany', isPopular: true, carCount: 25 },
  { name: 'MG', slug: 'mg', country: 'UK/China', isPopular: true, carCount: 7 },
  { name: 'Honda', slug: 'honda', country: 'Japan', isPopular: false, carCount: 6 },
  { name: 'Volkswagen', slug: 'volkswagen', country: 'Germany', isPopular: false, carCount: 5 },
  { name: 'Audi', slug: 'audi', country: 'Germany', isPopular: false, carCount: 15 },
  { name: 'Jeep', slug: 'jeep', country: 'USA', isPopular: false, carCount: 4 },
  { name: 'Land Rover', slug: 'land-rover', country: 'UK', isPopular: false, carCount: 8 },
  { name: 'Citroen', slug: 'citroen', country: 'France', isPopular: false, carCount: 3 },
];

const cars = [
  { name: 'Maruti Swift', brand: 'Maruti Suzuki', model: 'Swift', priceMin: 579000, priceMax: 880000, bodyType: 'Hatchback', fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 5, slug: 'maruti-swift', isTrending: true, rating: 4.2, reviewCount: 1240, description: 'India\'s most loved hatchback with sporty design and great fuel efficiency.' },
  { name: 'Maruti Baleno', brand: 'Maruti Suzuki', model: 'Baleno', priceMin: 599000, priceMax: 910000, bodyType: 'Hatchback', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, slug: 'maruti-baleno', isTrending: true, rating: 4.1, reviewCount: 980, description: 'Premium hatchback with spacious cabin and advanced features.' },
  { name: 'Maruti Dzire', brand: 'Maruti Suzuki', model: 'Dzire', priceMin: 626000, priceMax: 931000, bodyType: 'Sedan', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, slug: 'maruti-dzire', isTrending: true, rating: 4.3, reviewCount: 2100, description: 'The bestselling compact sedan in India.' },
  { name: 'Maruti Fronx', brand: 'Maruti Suzuki', model: 'Fronx', priceMin: 685000, priceMax: 1198000, bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, slug: 'maruti-fronx', isTrending: false, rating: 4.0, reviewCount: 560, description: 'Stylish coupe-SUV with Turbo power.' },
  { name: 'Maruti Brezza', brand: 'Maruti Suzuki', model: 'Brezza', priceMin: 826000, priceMax: 1301000, bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, slug: 'maruti-brezza', rating: 4.2, reviewCount: 870 },
  { name: 'Maruti Grand Vitara', brand: 'Maruti Suzuki', model: 'Grand Vitara', priceMin: 1077000, priceMax: 1972000, bodyType: 'SUV', fuelType: 'Hybrid', transmission: 'Automatic', seatingCapacity: 5, slug: 'maruti-grand-vitara', rating: 4.3, reviewCount: 430 },
  { name: 'Maruti Wagon R', brand: 'Maruti Suzuki', model: 'Wagon R', priceMin: 499000, priceMax: 695000, bodyType: 'Hatchback', fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 5, slug: 'maruti-wagon-r', rating: 4.0, reviewCount: 1500 },
  { name: 'Maruti Ertiga', brand: 'Maruti Suzuki', model: 'Ertiga', priceMin: 880000, priceMax: 1294000, bodyType: 'MPV', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 7, slug: 'maruti-ertiga', rating: 4.2, reviewCount: 760 },
  { name: 'Tata Punch', brand: 'Tata', model: 'Punch', priceMin: 560000, priceMax: 1055000, bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 5, slug: 'tata-punch', isTrending: false, rating: 4.1, reviewCount: 1100, description: 'Micro SUV with 5-star safety rating.' },
  { name: 'Tata Nexon', brand: 'Tata', model: 'Nexon', priceMin: 732000, priceMax: 1415000, bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, slug: 'tata-nexon', isTrending: false, rating: 4.4, reviewCount: 2300, description: 'India\'s #1 SUV with GNCAP 5-star rating.' },
  { name: 'Tata Tiago', brand: 'Tata', model: 'Tiago', priceMin: 457000, priceMax: 782000, bodyType: 'Hatchback', fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 5, slug: 'tata-tiago', rating: 4.0, reviewCount: 870 },
  { name: 'Tata Harrier', brand: 'Tata', model: 'Harrier', priceMin: 1289000, priceMax: 2525000, bodyType: 'SUV', fuelType: 'Diesel', transmission: 'Automatic', seatingCapacity: 5, slug: 'tata-harrier', rating: 4.4, reviewCount: 980 },
  { name: 'Tata Safari', brand: 'Tata', model: 'Safari', priceMin: 1329000, priceMax: 2596000, bodyType: 'SUV', fuelType: 'Diesel', transmission: 'Automatic', seatingCapacity: 7, slug: 'tata-safari', rating: 4.3, reviewCount: 640 },
  { name: 'Tata Sierra', brand: 'Tata', model: 'Sierra', priceMin: 1149000, priceMax: 2129000, bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, slug: 'tata-sierra', isUpcoming: false, rating: 4.5, reviewCount: 210, category: 'new' },
  { name: 'Tata Punch EV', brand: 'Tata', model: 'Punch EV', priceMin: 809000, priceMax: 1259000, bodyType: 'SUV', fuelType: 'Electric', transmission: 'Automatic', seatingCapacity: 5, slug: 'tata-punch-ev', rating: 4.2, reviewCount: 430 },
  { name: 'Tata Harrier EV', brand: 'Tata', model: 'Harrier EV', priceMin: 2149000, priceMax: 3023000, bodyType: 'SUV', fuelType: 'Electric', transmission: 'Automatic', seatingCapacity: 5, slug: 'tata-harrier-ev', rating: 4.6, reviewCount: 120 },
  { name: 'Hyundai Creta', brand: 'Hyundai', model: 'Creta', priceMin: 1079000, priceMax: 2020000, bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, slug: 'hyundai-creta', isTrending: false, rating: 4.5, reviewCount: 3200, description: 'The most popular SUV in India.' },
  { name: 'Hyundai Venue', brand: 'Hyundai', model: 'Venue', priceMin: 800000, priceMax: 1569000, bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, slug: 'hyundai-venue', rating: 4.2, reviewCount: 1800 },
  { name: 'Hyundai Verna', brand: 'Hyundai', model: 'Verna', priceMin: 1098000, priceMax: 1840000, bodyType: 'Sedan', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, slug: 'hyundai-verna', isTrending: true, rating: 4.4, reviewCount: 1200, description: 'Premium sedan with turbo petrol engine.' },
  { name: 'Hyundai i20', brand: 'Hyundai', model: 'i20', priceMin: 599000, priceMax: 1057000, bodyType: 'Hatchback', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, slug: 'hyundai-i20', isTrending: true, rating: 4.3, reviewCount: 1600 },
  { name: 'Hyundai Grand i10 Nios', brand: 'Hyundai', model: 'Grand i10 Nios', priceMin: 555000, priceMax: 792000, bodyType: 'Hatchback', fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 5, slug: 'hyundai-grand-i10-nios', rating: 4.1, reviewCount: 890 },
  { name: 'Hyundai Aura', brand: 'Hyundai', model: 'Aura', priceMin: 600000, priceMax: 854000, bodyType: 'Sedan', fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 5, slug: 'hyundai-aura', rating: 4.0, reviewCount: 540 },
  { name: 'Kia Seltos', brand: 'Kia', model: 'Seltos', priceMin: 1099000, priceMax: 2019000, bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, slug: 'kia-seltos', rating: 4.5, reviewCount: 2100, description: 'Feature-loaded SUV with premium interiors.' },
  { name: 'Kia Sonet', brand: 'Kia', model: 'Sonet', priceMin: 730000, priceMax: 1409000, bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, slug: 'kia-sonet', rating: 4.3, reviewCount: 1400 },
  { name: 'Mahindra Scorpio N', brand: 'Mahindra', model: 'Scorpio N', priceMin: 1349000, priceMax: 2434000, bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 7, slug: 'mahindra-scorpio-n', rating: 4.5, reviewCount: 1800 },
  { name: 'Mahindra Thar', brand: 'Mahindra', model: 'Thar', priceMin: 999000, priceMax: 1719000, bodyType: 'SUV', fuelType: 'Diesel', transmission: 'Manual', seatingCapacity: 4, slug: 'mahindra-thar', rating: 4.6, reviewCount: 2200 },
  { name: 'Mahindra Thar Roxx', brand: 'Mahindra', model: 'Thar Roxx', priceMin: 1239000, priceMax: 2225000, bodyType: 'SUV', fuelType: 'Diesel', transmission: 'Automatic', seatingCapacity: 5, slug: 'mahindra-thar-roxx', rating: 4.7, reviewCount: 340 },
  { name: 'Mahindra XUV 3XO', brand: 'Mahindra', model: 'XUV 3XO', priceMin: 737000, priceMax: 1455000, bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, slug: 'mahindra-xuv-3xo', rating: 4.3, reviewCount: 760 },
  { name: 'Mahindra XUV 7XO', brand: 'Mahindra', model: 'XUV 7XO', priceMin: 1366000, priceMax: 2492000, bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 7, slug: 'mahindra-xuv-7xo', rating: 4.4, reviewCount: 430 },
  { name: 'Mahindra BE 6', brand: 'Mahindra', model: 'BE 6', priceMin: 1890000, priceMax: 2849000, bodyType: 'SUV', fuelType: 'Electric', transmission: 'Automatic', seatingCapacity: 5, slug: 'mahindra-be-6', rating: 4.6, reviewCount: 180 },
  { name: 'Toyota Innova Hycross', brand: 'Toyota', model: 'Innova Hycross', priceMin: 1915000, priceMax: 3238000, bodyType: 'MPV', fuelType: 'Hybrid', transmission: 'Automatic', seatingCapacity: 8, slug: 'toyota-innova-hycross', rating: 4.6, reviewCount: 870 },
  { name: 'Toyota Glanza', brand: 'Toyota', model: 'Glanza', priceMin: 646000, priceMax: 944000, bodyType: 'Hatchback', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, slug: 'toyota-glanza', rating: 4.2, reviewCount: 430 },
  { name: 'Toyota Urban Cruiser Hyryder', brand: 'Toyota', model: 'Urban Cruiser Hyryder', priceMin: 1099000, priceMax: 2019000, bodyType: 'SUV', fuelType: 'Hybrid', transmission: 'Automatic', seatingCapacity: 5, slug: 'toyota-hyryder', rating: 4.4, reviewCount: 560 },
  { name: 'Skoda Kylaq', brand: 'Skoda', model: 'Kylaq', priceMin: 759000, priceMax: 1299000, bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, slug: 'skoda-kylaq', rating: 4.5, reviewCount: 280, description: 'European SUV with premium build quality.' },
  { name: 'Skoda Slavia', brand: 'Skoda', model: 'Slavia', priceMin: 1000000, priceMax: 1799000, bodyType: 'Sedan', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, slug: 'skoda-slavia', rating: 4.4, reviewCount: 540 },
  { name: 'Volkswagen Taigun', brand: 'Volkswagen', model: 'Taigun', priceMin: 1142000, priceMax: 1919000, bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, slug: 'volkswagen-taigun', isTrending: true, rating: 4.4, reviewCount: 780 },
  { name: 'Volkswagen Virtus', brand: 'Volkswagen', model: 'Virtus', priceMin: 1050000, priceMax: 1900000, bodyType: 'Sedan', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, slug: 'volkswagen-virtus', rating: 4.3, reviewCount: 620 },
  { name: 'Honda Amaze', brand: 'Honda', model: 'Amaze', priceMin: 752000, priceMax: 1000000, bodyType: 'Sedan', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, slug: 'honda-amaze', rating: 4.1, reviewCount: 760 },
  { name: 'Honda Elevate', brand: 'Honda', model: 'Elevate', priceMin: 1164000, priceMax: 1990000, bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, slug: 'honda-elevate', rating: 4.3, reviewCount: 430 },
  { name: 'Renault Kwid', brand: 'Renault', model: 'Kwid', priceMin: 430000, priceMax: 599000, bodyType: 'Hatchback', fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 5, slug: 'renault-kwid', rating: 3.9, reviewCount: 980 },
  { name: 'Renault Triber', brand: 'Renault', model: 'Triber', priceMin: 576000, priceMax: 860000, bodyType: 'MPV', fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 7, slug: 'renault-triber', isTrending: true, rating: 4.0, reviewCount: 560 },
  { name: 'Renault Kiger', brand: 'Renault', model: 'Kiger', priceMin: 576000, priceMax: 1120000, bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, slug: 'renault-kiger', rating: 4.0, reviewCount: 430 },
  { name: 'Renault Duster', brand: 'Renault', model: 'Duster', priceMin: 950000, priceMax: 1900000, bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, slug: 'renault-duster', isTrending: true, isUpcoming: false, rating: 4.3, reviewCount: 90, category: 'new' },
  { name: 'Nissan Gravite', brand: 'Nissan', model: 'Gravite', priceMin: 565000, priceMax: 894000, bodyType: 'MPV', fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 7, slug: 'nissan-gravite', rating: 3.9, reviewCount: 120 },
  { name: 'MG Windsor EV', brand: 'MG', model: 'Windsor EV', priceMin: 1198000, priceMax: 1595000, bodyType: 'SUV', fuelType: 'Electric', transmission: 'Automatic', seatingCapacity: 5, slug: 'mg-windsor-ev', rating: 4.3, reviewCount: 320 },
  { name: 'Jeep Compass', brand: 'Jeep', model: 'Compass', priceMin: 1799000, priceMax: 3200000, bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, slug: 'jeep-compass', rating: 4.3, reviewCount: 540 },
  { name: 'Citroen C3', brand: 'Citroen', model: 'C3', priceMin: 495000, priceMax: 945000, bodyType: 'Hatchback', fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 5, slug: 'citroen-c3', rating: 3.9, reviewCount: 230 },
  { name: 'Nissan Tekton', brand: 'Nissan', model: 'Tekton', priceMin: 1100000, priceMax: 1800000, bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, slug: 'nissan-tekton', isUpcoming: true, category: 'upcoming', launchDate: 'Mar 2026' },
  { name: 'Toyota Urban Cruiser Ebella', brand: 'Toyota', model: 'Urban Cruiser Ebella', priceMin: 1600000, priceMax: 1950000, bodyType: 'SUV', fuelType: 'Electric', transmission: 'Automatic', seatingCapacity: 5, slug: 'toyota-urban-cruiser-ebella', isUpcoming: true, category: 'upcoming', launchDate: 'Mar 2026' },
  { name: 'Skoda Kushaq Facelift', brand: 'Skoda', model: 'Kushaq Facelift', priceMin: 1100000, priceMax: 1900000, bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, slug: 'skoda-kushaq-facelift', isUpcoming: true, category: 'upcoming', launchDate: 'Mar 2026' },
];

const usedCars = [
  { name: 'Toyota Fortuner 2020', brand: 'Toyota', model: 'Fortuner', year: 2020, price: 2800000, km: 45000, fuelType: 'Diesel', transmission: 'Automatic', city: 'Delhi', owner: '1st Owner', isCertified: true },
  { name: 'Hyundai Verna 2021', brand: 'Hyundai', model: 'Verna', year: 2021, price: 780000, km: 32000, fuelType: 'Petrol', transmission: 'Automatic', city: 'Mumbai', owner: '1st Owner', isCertified: true },
  { name: 'Maruti Swift DZire 2019', brand: 'Maruti Suzuki', model: 'Swift DZire', year: 2019, price: 520000, km: 55000, fuelType: 'Petrol', transmission: 'Manual', city: 'Bangalore', owner: '2nd Owner' },
  { name: 'Mahindra Thar 2022', brand: 'Mahindra', model: 'Thar', year: 2022, price: 1450000, km: 18000, fuelType: 'Diesel', transmission: 'Manual', city: 'Pune', owner: '1st Owner', isCertified: true },
  { name: 'Volkswagen Polo 2018', brand: 'Volkswagen', model: 'Polo', year: 2018, price: 480000, km: 68000, fuelType: 'Petrol', transmission: 'Manual', city: 'Hyderabad', owner: '2nd Owner' },
  { name: 'Tata Nexon 2021', brand: 'Tata', model: 'Nexon', year: 2021, price: 920000, km: 28000, fuelType: 'Petrol', transmission: 'Automatic', city: 'Delhi', owner: '1st Owner', isCertified: true },
  { name: 'Hyundai Creta 2020', brand: 'Hyundai', model: 'Creta', year: 2020, price: 1150000, km: 42000, fuelType: 'Petrol', transmission: 'Automatic', city: 'Mumbai', owner: '1st Owner' },
  { name: 'Kia Seltos 2021', brand: 'Kia', model: 'Seltos', year: 2021, price: 1280000, km: 35000, fuelType: 'Diesel', transmission: 'Automatic', city: 'Gurgaon', owner: '1st Owner', isCertified: true },
  { name: 'Maruti Baleno 2022', brand: 'Maruti Suzuki', model: 'Baleno', year: 2022, price: 680000, km: 22000, fuelType: 'Petrol', transmission: 'Automatic', city: 'Chennai', owner: '1st Owner' },
  { name: 'Honda City 2019', brand: 'Honda', model: 'City', year: 2019, price: 780000, km: 58000, fuelType: 'Petrol', transmission: 'Automatic', city: 'Kolkata', owner: '2nd Owner' },
];

const newsData = [
  { title: 'Chery Lepas L6 Patented in India', excerpt: 'Lepas is a new sub-brand that targets young audiences.', author: 'Dwij Bhandut', category: 'News', slug: 'chery-lepas-l6-patented-india', publishedAt: new Date('2026-03-14') },
  { title: "Here's Why Automatics Are Becoming Standard across Lower Variants", excerpt: "India's mass-market car segment has seen a clear shift in buyer preferences.", author: 'Sagar Bhanushali', category: 'News', slug: 'automatics-becoming-standard-lower-variants', publishedAt: new Date('2026-03-14') },
  { title: 'Ferrari 849 Testarossa Debuts in India at Rs. 10.37 Crore', excerpt: 'Ferrari has unveiled the new Ferrari 849 Testarossa in India today.', author: 'Haji Chakralwale', category: 'News', slug: 'ferrari-849-testarossa-india', publishedAt: new Date('2026-03-14') },
  { title: "Vinfast Introduces 'Trade Gas for Electric' Program", excerpt: 'The Vietnamese automaker is offering additional discounts on EVs.', author: 'Dwij Bhandut', category: 'News', slug: 'vinfast-trade-gas-electric-program', publishedAt: new Date('2026-03-14') },
  { title: 'Maruti Suzuki Dzire Graces 3 Million Sales Milestone', excerpt: 'The compact sedan has surpassed 3 million cumulative sales.', author: 'Haji Chakralwale', category: 'News', slug: 'maruti-suzuki-dzire-3-million-sales', publishedAt: new Date('2026-03-13') },
  { title: 'Kia Carens Clavis 1.5 T-GDi DCT Long-Term Review: City Report', excerpt: 'After a month with the Clavis, it has become my go-to for the daily grind.', author: 'Santosh Nair', category: 'Review', slug: 'kia-carens-clavis-long-term-review', publishedAt: new Date('2026-03-13') },
  { title: 'BMW M2 CS First Look Review', excerpt: 'We take a look at the new BMW M2 CS, aimed at purists.', author: 'Santosh Nair', category: 'Review', slug: 'bmw-m2-cs-first-look-review', publishedAt: new Date('2026-03-13') },
  { title: 'Tata Punch EV Facelift First Drive Review', excerpt: 'Sometimes a facelift arrives in the form of strategic upgrades.', author: 'Desirazu Venkat', category: 'Review', slug: 'tata-punch-ev-facelift-first-drive', publishedAt: new Date('2026-02-28') },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB...');
    await Car.deleteMany({});
    await Brand.deleteMany({});
    await UsedCar.deleteMany({});
    await News.deleteMany({});
    await Brand.insertMany(brands);
    await Car.insertMany(cars);
    await UsedCar.insertMany(usedCars);
    await News.insertMany(newsData);
    console.log('✅ Seed data inserted successfully!');
    console.log(`  - ${brands.length} brands`);
    console.log(`  - ${cars.length} cars`);
    console.log(`  - ${usedCars.length} used cars`);
    console.log(`  - ${newsData.length} news articles`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
