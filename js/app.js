/* ==============================================
   CARWALE REPLICA — FRONTEND APP.JS
   Talks to Express API at /api/*
   ============================================== */

const API = '';  // same-origin, adjust if needed

// ── STATE ─────────────────────────────────────
let allCars = [];
let allUsedCars = [];
let allNews = [];
let allBrands = [];
let currentBudgetTab = 'under10';
let currentBodyTab = 'SUV';
let currentFuelTab = 'Electric';
let currentLaunchTab = 'upcoming';
let currentNewsTab = 'News';
let carsPage = 1;
const PAGE_SIZE = 12;

// brand emojis map
const brandEmoji = {
  'Maruti Suzuki': '🔵', 'Tata': '🦁', 'Mahindra': '🟠', 'Hyundai': '🔷',
  'Toyota': '🔴', 'Kia': '⚡', 'Skoda': '🟢', 'BMW': '🏎️', 'Renault': '💎',
  'Nissan': '⭕', 'Mercedes-Benz': '⭐', 'MG': '🌟', 'Honda': '🏍️',
  'Volkswagen': '🔵', 'Audi': '💫', 'Jeep': '🚙', 'Land Rover': '🌲',
  'Citroen': '🇫🇷', 'Ferrari': '🐎', 'Lexus': '💠',
};
const carEmoji = (fuelType) => fuelType === 'Electric' ? '⚡🚗' : fuelType === 'Hybrid' ? '🌿🚗' : '🚗';
const cityEmoji = { 'Delhi': '🏛️', 'Mumbai': '🌆', 'Bangalore': '🌳', 'Pune': '🏔️', 'Hyderabad': '🕌', 'Chennai': '🌊', 'Kolkata': '🌉', 'Ahmedabad': '🏺', 'Jaipur': '🏯', 'Gurgaon': '🏙️', 'Lucknow': '🕍', 'Jaipur': '🏯' };

// ── INIT ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadEverything();
  populateSellForm();
  populateBrandFilter();
});

async function loadEverything() {
  await Promise.all([
    fetchAllCars(),
    fetchAllUsedCars(),
    fetchAllNews(),
    fetchAllBrands(),
  ]);
  renderStats();
  renderTrendingCars();
  renderBudgetCars();
  renderBrands();
  renderUpcomingCars();
  renderFuelCars();
  renderCities();
  renderHomeNews();
  renderAllCarsGrid();
  renderUsedCarsGrid();
  renderFullNews();
}

// ── API CALLS ─────────────────────────────────
async function fetchAllCars() {
  try {
    const res = await fetch(`${API}/api/cars?limit=200`);
    const data = await res.json();
    if (data.success) allCars = data.data;
  } catch { allCars = getFallbackCars(); }
}

async function fetchAllUsedCars() {
  try {
    const res = await fetch(`${API}/api/used-cars?limit=100`);
    const data = await res.json();
    if (data.success) allUsedCars = data.data;
  } catch { allUsedCars = getFallbackUsedCars(); }
}

async function fetchAllNews() {
  try {
    const res = await fetch(`${API}/api/news?limit=50`);
    const data = await res.json();
    if (data.success) allNews = data.data;
  } catch { allNews = getFallbackNews(); }
}

async function fetchAllBrands() {
  try {
    const res = await fetch(`${API}/api/brands?popular=true`);
    const data = await res.json();
    if (data.success) allBrands = data.data;
  } catch { allBrands = getFallbackBrands(); }
}

// ── STATS ─────────────────────────────────────
function renderStats() {
  const carStat = document.getElementById('statCars');
  const usedStat = document.getElementById('statUsed');
  if (carStat) animateCount(carStat, allCars.length);
  if (usedStat) animateCount(usedStat, allUsedCars.length);
}

function animateCount(el, target) {
  let start = 0; const step = Math.ceil(target / 30);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = start + '+';
    if (start >= target) clearInterval(timer);
  }, 40);
}

// ── SECTION NAVIGATION ────────────────────────
function showSection(name, linkEl) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const sec = document.getElementById(`section-${name}`);
  if (sec) sec.classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  if (linkEl) linkEl.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
}

// ── HERO SEARCH ───────────────────────────────
function setSearchTab(btn, type) {
  document.querySelectorAll('.stab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function doHeroSearch() {
  const q = document.getElementById('heroSearch').value;
  showSection('new-cars');
  setTimeout(() => {
    document.getElementById('carsSearch').value = q;
    filterCars();
  }, 100);
}

function quickFilter(bodyType = '', fuelType = '', label = '', maxPrice = '') {
  showSection('new-cars');
  setTimeout(() => {
    if (bodyType) document.getElementById('carsBodyType').value = bodyType;
    if (fuelType) document.getElementById('carsFuelType').value = fuelType;
    if (maxPrice) document.getElementById('carsBudget').value = maxPrice;
    filterCars();
  }, 100);
}

// ── TRENDING CARS ─────────────────────────────
function renderTrendingCars() {
  const trending = allCars.filter(c => c.isTrending).slice(0, 12);
  const el = document.getElementById('trendingCars');
  if (!el) return;
  if (!trending.length) { el.innerHTML = '<div class="loading-row">No trending cars</div>'; return; }
  el.innerHTML = trending.map(c => `
    <div class="trend-card" onclick="openCarModal('${c.slug || c._id}')">
      <div class="trend-img">${carEmoji(c.fuelType)}</div>
      <div class="trend-name">${c.brand}<br/>${c.model}</div>
    </div>
  `).join('');
}

// ── BUDGET CARS ───────────────────────────────
function setBudgetTab(btn, tab) {
  document.querySelectorAll('.btab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentBudgetTab = tab;
  renderBudgetCars();
}

function setBodyTab(btn, type) {
  document.querySelectorAll('.body-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentBodyTab = type;
  renderBudgetCars();
}

function renderBudgetCars() {
  const ranges = {
    under10: [0, 1000000], '10to20': [1000000, 2000000],
    '20to30': [2000000, 3000000], luxury: [3000000, Infinity]
  };
  const [min, max] = ranges[currentBudgetTab];
  let filtered = allCars.filter(c => c.priceMin >= min && c.priceMin < max);
  if (currentBodyTab) filtered = filtered.filter(c => c.bodyType === currentBodyTab);
  const el = document.getElementById('budgetCars');
  if (!el) return;
  renderCarCards(filtered.slice(0, 8), el);
}

// ── BRANDS ───────────────────────────────────
function renderBrands() {
  const el = document.getElementById('brandsGrid');
  if (!el) return;
  const brands = allBrands.length ? allBrands : getFallbackBrands();
  el.innerHTML = brands.map(b => `
    <div class="brand-card" onclick="filterByBrand('${b.name}')">
      <div class="brand-icon">${brandEmoji[b.name] || '🚗'}</div>
      <div class="brand-name">${b.name}</div>
      <div class="brand-count">${b.carCount || ''}${b.carCount ? ' cars' : ''}</div>
    </div>
  `).join('');
}

function filterByBrand(brand) {
  showSection('new-cars');
  setTimeout(() => {
    const sel = document.getElementById('carsBrand');
    if (sel) { sel.value = brand; filterCars(); }
  }, 100);
}

// ── UPCOMING / LAUNCHED ───────────────────────
function setLaunchTab(btn, tab) {
  document.querySelectorAll('.ltab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentLaunchTab = tab;
  renderUpcomingCars();
}

function renderUpcomingCars() {
  let cars;
  if (currentLaunchTab === 'upcoming') {
    cars = allCars.filter(c => c.isUpcoming || c.category === 'upcoming').slice(0, 8);
  } else {
    cars = allCars.filter(c => !c.isUpcoming && c.category === 'new').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);
  }
  const el = document.getElementById('upcomingCars');
  if (!el) return;
  renderCarCards(cars, el, true);
}

// ── FUEL CARS ─────────────────────────────────
function setFuelTab(btn, fuel) {
  document.querySelectorAll('.ftab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentFuelTab = fuel;
  renderFuelCars();
}

function renderFuelCars() {
  const cars = allCars.filter(c => c.fuelType === currentFuelTab).slice(0, 8);
  const el = document.getElementById('fuelCars');
  if (!el) return;
  renderCarCards(cars, el);
}

// ── CITIES ────────────────────────────────────
function renderCities() {
  const cities = [
    { name: 'Delhi', count: '13,600+', from: '₹25,000' },
    { name: 'Mumbai', count: '11,000+', from: '₹30,000' },
    { name: 'Bangalore', count: '7,300+', from: '₹45,000' },
    { name: 'Pune', count: '6,100+', from: '₹45,000' },
    { name: 'Hyderabad', count: '6,200+', from: '₹29,564' },
    { name: 'Ahmedabad', count: '4,400+', from: '₹40,000' },
    { name: 'Chennai', count: '4,200+', from: '₹45,000' },
    { name: 'Kolkata', count: '2,500+', from: '₹45,000' },
    { name: 'Lucknow', count: '3,100+', from: '₹40,000' },
    { name: 'Jaipur', count: '2,200+', from: '₹30,000' },
    { name: 'Gurgaon', count: '5,600+', from: '₹40,000' },
  ];
  const el = document.getElementById('citiesGrid');
  if (!el) return;
  el.innerHTML = cities.map(c => `
    <div class="city-card" onclick="filterUsedByCity('${c.name}')">
      <div class="city-icon">${cityEmoji[c.name] || '🏙️'}</div>
      <div class="city-name">${c.name}</div>
      <div class="city-count">${c.count} Cars</div>
      <div class="city-from">From ${c.from}</div>
    </div>
  `).join('');
}

function filterUsedByCity(city) {
  showSection('used-cars');
  setTimeout(() => {
    const sel = document.getElementById('usedCity');
    if (sel) { sel.value = city; filterUsedCars(); }
  }, 100);
}

// ── HOME NEWS ─────────────────────────────────
function setNewsTab(btn, cat) {
  document.querySelectorAll('.ntab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentNewsTab = cat;
  renderHomeNews();
}

function renderHomeNews() {
  const news = allNews.filter(n => n.category === currentNewsTab).slice(0, 3);
  const el = document.getElementById('newsGrid');
  if (!el) return;
  renderNewsCards(news, el);
}

// ── NEW CARS PAGE ─────────────────────────────
function filterCars() {
  carsPage = 1;
  renderAllCarsGrid();
}

function getFilteredCars() {
  const search = (document.getElementById('carsSearch')?.value || '').toLowerCase();
  const bodyType = document.getElementById('carsBodyType')?.value || '';
  const fuelType = document.getElementById('carsFuelType')?.value || '';
  const budget = document.getElementById('carsBudget')?.value || '';
  const brand = document.getElementById('carsBrand')?.value || '';
  return allCars.filter(c => {
    if (search && !`${c.brand} ${c.model} ${c.name}`.toLowerCase().includes(search)) return false;
    if (bodyType && c.bodyType !== bodyType) return false;
    if (fuelType && c.fuelType !== fuelType) return false;
    if (budget && c.priceMin > Number(budget)) return false;
    if (brand && c.brand !== brand) return false;
    return true;
  });
}

function renderAllCarsGrid() {
  const filtered = getFilteredCars();
  const info = document.getElementById('carsResultsInfo');
  if (info) info.textContent = `Showing ${filtered.length} cars`;
  const start = (carsPage - 1) * PAGE_SIZE;
  const page = filtered.slice(start, start + PAGE_SIZE);
  const el = document.getElementById('allCarsGrid');
  if (el) renderCarCards(page, el);
  renderPagination(filtered.length);
}

function renderPagination(total) {
  const pages = Math.ceil(total / PAGE_SIZE);
  const el = document.getElementById('carsPagination');
  if (!el || pages <= 1) { if (el) el.innerHTML = ''; return; }
  let html = '';
  for (let i = 1; i <= pages; i++) {
    html += `<button class="page-btn${i === carsPage ? ' active' : ''}" onclick="goToPage(${i})">${i}</button>`;
  }
  el.innerHTML = html;
}

function goToPage(page) {
  carsPage = page;
  renderAllCarsGrid();
  document.getElementById('section-new-cars')?.scrollIntoView({ behavior: 'smooth' });
}

function populateBrandFilter() {
  const sel = document.getElementById('carsBrand');
  const sellBrand = document.getElementById('sellBrand');
  const brands = [...new Set(getFallbackCars().map(c => c.brand))].sort();
  const opts = brands.map(b => `<option value="${b}">${b}</option>`).join('');
  if (sel) sel.innerHTML = `<option value="">All Brands</option>${opts}`;
  if (sellBrand) sellBrand.innerHTML = `<option value="">Select Brand</option>${opts}`;
}

// ── USED CARS PAGE ────────────────────────────
function filterUsedCars() {
  const search = (document.getElementById('usedSearch')?.value || '').toLowerCase();
  const city = document.getElementById('usedCity')?.value || '';
  const fuel = document.getElementById('usedFuel')?.value || '';
  const budget = document.getElementById('usedBudget')?.value || '';
  const filtered = allUsedCars.filter(c => {
    if (search && !`${c.brand} ${c.model} ${c.name}`.toLowerCase().includes(search)) return false;
    if (city && c.city !== city) return false;
    if (fuel && c.fuelType !== fuel) return false;
    if (budget && c.price > Number(budget)) return false;
    return true;
  });
  const info = document.getElementById('usedResultsInfo');
  if (info) info.textContent = `Showing ${filtered.length} used cars`;
  const el = document.getElementById('usedCarsGrid');
  if (el) renderUsedCarCards(filtered, el);
}

function renderUsedCarsGrid() {
  const el = document.getElementById('usedCarsGrid');
  if (!el) return;
  const info = document.getElementById('usedResultsInfo');
  if (info) info.textContent = `Showing ${allUsedCars.length} used cars`;
  renderUsedCarCards(allUsedCars, el);
}

// ── NEWS PAGE ─────────────────────────────────
function filterNews(cat, btn) {
  document.querySelectorAll('.news-cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filtered = cat ? allNews.filter(n => n.category === cat) : allNews;
  renderFullNews(filtered);
}

function renderFullNews(newsArr = allNews) {
  const el = document.getElementById('newsFullGrid');
  if (!el) return;
  renderNewsCards(newsArr, el);
}

// ── CARD RENDERERS ────────────────────────────
function renderCarCards(cars, el, showLaunch = false) {
  if (!cars.length) { el.innerHTML = '<div class="loading-row">No cars found matching your criteria</div>'; return; }
  el.innerHTML = cars.map(c => {
    const minL = (c.priceMin / 100000).toFixed(2);
    const maxL = c.priceMax ? ` - ₹${(c.priceMax / 100000).toFixed(2)} Lakh` : ' Lakh onwards';
    const fuelClass = c.fuelType === 'Electric' ? 'fuel-electric' : c.fuelType === 'Hybrid' ? 'fuel-hybrid' : c.fuelType === 'Diesel' ? 'fuel-diesel' : '';
    const stars = '★'.repeat(Math.round(c.rating || 4)) + '☆'.repeat(5 - Math.round(c.rating || 4));
    const badge = c.isUpcoming ? `<div class="car-card-badge upcoming">Upcoming</div>` : (c.isTrending ? `<div class="car-card-badge">Trending</div>` : '');
    return `
      <div class="car-card" onclick="openCarModal('${c.slug || c._id}')">
        <div class="car-card-img">
          ${badge}
          <img src="${c.image || '/images/default.jpg'}" class="car-img">
        </div>
        <div class="car-card-body">
          <div class="car-card-brand">${c.brand}</div>
          <div class="car-card-name">${c.model}</div>
          <div class="car-card-price">₹${minL}${maxL}</div>
          ${showLaunch && c.launchDate ? `<div class="car-tag" style="color:#b45309;background:#fef3c7">${c.launchDate}</div>` : ''}
          <div class="car-card-tags">
            <span class="car-tag ${fuelClass}">${c.fuelType}</span>
            ${c.transmission ? `<span class="car-tag">${c.transmission}</span>` : ''}
            ${c.bodyType ? `<span class="car-tag">${c.bodyType}</span>` : ''}
          </div>
          <div class="car-card-stars">
            <span class="stars">${stars}</span>
            <span class="stars-count">${c.rating || '4.0'} (${c.reviewCount || 0} reviews)</span>
          </div>
        </div>
        <div class="car-card-footer">
          <button class="btn-price" onclick="event.stopPropagation(); openCarModal('${c.slug || c._id}')">View Price Breakup</button>
        </div>
      </div>
    `;
  }).join('');
}

function renderUsedCarCards(cars, el) {
  if (!cars.length) { el.innerHTML = '<div class="loading-row">No used cars found</div>'; return; }
  el.innerHTML = cars.map(c => {
    const certBadge = c.isCertified ? `<div class="car-card-badge certified">Certified</div>` : '';
    return `
      <div class="car-card" onclick="openUsedCarModal('${c._id}')">
        <div class="car-card-img">
          ${certBadge}
          <img src="/images/${c.image || 'default.jpg'}" class="car-img">
        </div>
        <div class="car-card-body">
          <div class="car-card-brand">${c.brand}</div>
          <div class="car-card-name">${c.year} ${c.model}</div>
          <div class="car-card-price">₹${(c.price / 100000).toFixed(2)} Lakh</div>
          <div class="used-meta">
            <span class="used-meta-item">📍 ${c.city}</span>
            <span class="used-meta-item">🛣️ ${(c.km / 1000).toFixed(1)}k km</span>
            <span class="used-meta-item">${c.owner}</span>
          </div>
          <div class="car-card-tags">
            <span class="car-tag">${c.fuelType}</span>
            ${c.transmission ? `<span class="car-tag">${c.transmission}</span>` : ''}
          </div>
        </div>
        <div class="car-card-footer">
          <button class="btn-price" onclick="event.stopPropagation(); openUsedCarModal('${c._id}')">View Details</button>
        </div>
      </div>
    `;
  }).join('');
}

function renderNewsCards(news, el) {
  if (!news.length) { el.innerHTML = '<div class="loading-row">No articles found</div>'; return; }
  const icons = { News: '📰', Review: '⭐', Video: '▶️', Launch: '🚀' };
  el.innerHTML = news.map(n => {
    const date = new Date(n.publishedAt || n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    return `
      <div class="news-card">
        <div class="news-card-img">${icons[n.category] || '📰'}</div>
        <div class="news-card-body">
          <div class="news-card-cat">${n.category}</div>
          <div class="news-card-title">${n.title}</div>
          ${n.excerpt ? `<div class="news-card-excerpt">${n.excerpt}</div>` : ''}
          <div class="news-card-meta">
            <span class="news-author">By ${n.author}</span>
            <span class="news-date">${date}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ── MODAL ─────────────────────────────────────
function openCarModal(slugOrId) {
  const car = allCars.find(c => c.slug === slugOrId || c._id === slugOrId);
  if (!car) return;
  const minL = (car.priceMin / 100000).toFixed(2);
  const maxL = car.priceMax ? `– ₹${(car.priceMax / 100000).toFixed(2)} Lakh` : 'Lakh onwards';
  const stars = '★'.repeat(Math.round(car.rating || 4)) + '☆'.repeat(5 - Math.round(car.rating || 4));
  document.getElementById('modalContent').innerHTML = `
    <div class="modal-car-img">${carEmoji(car.fuelType)}</div>
    <div class="modal-brand">${car.brand}</div>
    <div class="modal-name">${car.model}</div>
    <div class="modal-price">₹${minL} ${maxL} <span>(Ex-Showroom)</span></div>
    <div style="color:#f59e0b;font-size:1rem;margin-bottom:.5rem">${stars} <span style="color:#9aa5b4;font-size:.85rem">${car.rating} (${car.reviewCount} reviews)</span></div>
    ${car.description ? `<div class="modal-desc">${car.description}</div>` : ''}
    <div class="modal-specs">
      <div class="spec-item"><div class="spec-label">Body Type</div><div class="spec-value">${car.bodyType || '—'}</div></div>
      <div class="spec-item"><div class="spec-label">Fuel Type</div><div class="spec-value">${car.fuelType || '—'}</div></div>
      <div class="spec-item"><div class="spec-label">Transmission</div><div class="spec-value">${car.transmission || '—'}</div></div>
      <div class="spec-item"><div class="spec-label">Seating</div><div class="spec-value">${car.seatingCapacity ? car.seatingCapacity + ' Seater' : '—'}</div></div>
    </div>
    <div class="modal-cta">
      <button class="modal-btn-primary" onclick="showToast('✅ Enquiry sent for ${car.model}!','success'); closeModal()">Get Best Price</button>
      <button class="modal-btn-secondary" onclick="showToast('📅 Test drive booked for ${car.model}!','success'); closeModal()">Book Test Drive</button>
    </div>
  `;
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function openUsedCarModal(id) {
  const car = allUsedCars.find(c => c._id === id);
  if (!car) return;
  document.getElementById('modalContent').innerHTML = `
    <div class="modal-car-img">${carEmoji(car.fuelType)}</div>
    ${car.isCertified ? '<div style="background:#d1fae5;color:#065f46;padding:.4rem 1rem;border-radius:30px;display:inline-block;font-weight:800;font-size:.8rem;margin-bottom:.75rem">✅ Certified Car</div>' : ''}
    <div class="modal-brand">${car.brand}</div>
    <div class="modal-name">${car.year} ${car.model}</div>
    <div class="modal-price">₹${(car.price / 100000).toFixed(2)} Lakh</div>
    <div class="modal-specs">
      <div class="spec-item"><div class="spec-label">City</div><div class="spec-value">${car.city}</div></div>
      <div class="spec-item"><div class="spec-label">KM Driven</div><div class="spec-value">${car.km.toLocaleString()} km</div></div>
      <div class="spec-item"><div class="spec-label">Fuel Type</div><div class="spec-value">${car.fuelType}</div></div>
      <div class="spec-item"><div class="spec-label">Transmission</div><div class="spec-value">${car.transmission || '—'}</div></div>
      <div class="spec-item"><div class="spec-label">Owner</div><div class="spec-value">${car.owner}</div></div>
      <div class="spec-item"><div class="spec-label">Year</div><div class="spec-value">${car.year}</div></div>
    </div>
    ${car.description ? `<div class="modal-desc">${car.description}</div>` : ''}
    <div class="modal-cta">
      <button class="modal-btn-primary" onclick="showToast('📞 Seller contact shared!','success'); closeModal()">Contact Seller</button>
      <button class="modal-btn-secondary" onclick="showToast('🧪 Inspection booked!','success'); closeModal()">Book Inspection</button>
    </div>
  `;
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ── SELL FORM ─────────────────────────────────
function populateSellForm() {
  const sel = document.getElementById('sellYear');
  if (sel) {
    const cur = new Date().getFullYear();
    for (let y = cur; y >= 2000; y--) {
      sel.innerHTML += `<option value="${y}">${y}</option>`;
    }
  }
}

async function submitUsedCar(e) {
  e.preventDefault();
  const brand = document.getElementById('sellBrand').value;
  const model = document.getElementById('sellModel').value;
  const body = {
    name: `${brand} ${model} ${document.getElementById('sellYear').value}`,
    brand, model,
    year: Number(document.getElementById('sellYear').value),
    km: Number(document.getElementById('sellKm').value),
    fuelType: document.getElementById('sellFuel').value,
    transmission: document.getElementById('sellTransmission').value,
    city: document.getElementById('sellCity').value,
    price: Number(document.getElementById('sellPrice').value),
    owner: document.getElementById('sellOwner').value,
    description: document.getElementById('sellDesc').value,
  };
  try {
    const res = await fetch(`${API}/api/used-cars`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    });
    const data = await res.json();
    if (data.success) {
      allUsedCars.unshift(data.data);
      renderUsedCarsGrid();
      const suc = document.getElementById('sellSuccess');
      suc.innerHTML = `🎉 Your ${brand} ${model} has been listed successfully! Our team will contact you within 24 hours.`;
      suc.style.display = 'block';
      e.target.reset();
      showToast('✅ Car listed successfully!', 'success');
    } else {
      showToast('❌ ' + data.message, 'error');
    }
  } catch {
    showToast('⚠️ Could not connect to server. Check MongoDB connection.', 'error');
  }
}

// ── TOAST ─────────────────────────────────────
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg; t.className = `toast ${type} show`;
  setTimeout(() => t.classList.remove('show'), 3500);
}

// ── FALLBACK DATA ─────────────────────────────
function getFallbackCars() {
  return [
    { slug: 'maruti-swift', brand: 'Maruti Suzuki', model: 'Swift', priceMin: 579000, priceMax: 880000, bodyType: 'Hatchback', fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 5, isTrending: true, rating: 4.2, reviewCount: 1240, description: "India's most loved hatchback." },
    { slug: 'maruti-baleno', brand: 'Maruti Suzuki', model: 'Baleno', priceMin: 599000, priceMax: 910000, bodyType: 'Hatchback', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, isTrending: true, rating: 4.1, reviewCount: 980 },
    { slug: 'maruti-dzire', brand: 'Maruti Suzuki', model: 'Dzire', priceMin: 626000, priceMax: 931000, bodyType: 'Sedan', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, isTrending: true, rating: 4.3, reviewCount: 2100 },
    { slug: 'tata-nexon', brand: 'Tata', model: 'Nexon', priceMin: 732000, priceMax: 1415000, bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, isTrending: false, rating: 4.4, reviewCount: 2300, description: "India's #1 SUV." },
    { slug: 'tata-punch', brand: 'Tata', model: 'Punch', priceMin: 560000, priceMax: 1055000, bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 5, isTrending: false, rating: 4.1, reviewCount: 1100 },
    { slug: 'hyundai-creta', brand: 'Hyundai', model: 'Creta', priceMin: 1079000, priceMax: 2020000, bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, isTrending: false, rating: 4.5, reviewCount: 3200 },
    { slug: 'hyundai-verna', brand: 'Hyundai', model: 'Verna', priceMin: 1098000, priceMax: 1840000, bodyType: 'Sedan', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, isTrending: true, rating: 4.4, reviewCount: 1200 },
    { slug: 'hyundai-i20', brand: 'Hyundai', model: 'i20', priceMin: 599000, priceMax: 1057000, bodyType: 'Hatchback', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, isTrending: true, rating: 4.3, reviewCount: 1600 },
    { slug: 'kia-seltos', brand: 'Kia', model: 'Seltos', priceMin: 1099000, priceMax: 2019000, bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, rating: 4.5, reviewCount: 2100 },
    { slug: 'kia-sonet', brand: 'Kia', model: 'Sonet', priceMin: 730000, priceMax: 1409000, bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, rating: 4.3, reviewCount: 1400 },
    { slug: 'mahindra-thar', brand: 'Mahindra', model: 'Thar', priceMin: 999000, priceMax: 1719000, bodyType: 'SUV', fuelType: 'Diesel', transmission: 'Manual', seatingCapacity: 4, rating: 4.6, reviewCount: 2200 },
    { slug: 'mahindra-scorpio-n', brand: 'Mahindra', model: 'Scorpio N', priceMin: 1349000, priceMax: 2434000, bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 7, rating: 4.5, reviewCount: 1800 },
    { slug: 'tata-punch-ev', brand: 'Tata', model: 'Punch EV', priceMin: 809000, priceMax: 1259000, bodyType: 'SUV', fuelType: 'Electric', transmission: 'Automatic', seatingCapacity: 5, rating: 4.2, reviewCount: 430 },
    { slug: 'tata-harrier-ev', brand: 'Tata', model: 'Harrier EV', priceMin: 2149000, priceMax: 3023000, bodyType: 'SUV', fuelType: 'Electric', transmission: 'Automatic', seatingCapacity: 5, rating: 4.6, reviewCount: 120 },
    { slug: 'mahindra-be-6', brand: 'Mahindra', model: 'BE 6', priceMin: 1890000, priceMax: 2849000, bodyType: 'SUV', fuelType: 'Electric', transmission: 'Automatic', seatingCapacity: 5, rating: 4.6, reviewCount: 180 },
    { slug: 'mg-windsor-ev', brand: 'MG', model: 'Windsor EV', priceMin: 1198000, priceMax: 1595000, bodyType: 'SUV', fuelType: 'Electric', transmission: 'Automatic', seatingCapacity: 5, rating: 4.3, reviewCount: 320 },
    { slug: 'volkswagen-taigun', brand: 'Volkswagen', model: 'Taigun', priceMin: 1142000, priceMax: 1919000, bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, isTrending: true, rating: 4.4, reviewCount: 780 },
    { slug: 'skoda-kylaq', brand: 'Skoda', model: 'Kylaq', priceMin: 759000, priceMax: 1299000, bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, rating: 4.5, reviewCount: 280 },
    { slug: 'toyota-innova-hycross', brand: 'Toyota', model: 'Innova Hycross', priceMin: 1915000, priceMax: 3238000, bodyType: 'MPV', fuelType: 'Hybrid', transmission: 'Automatic', seatingCapacity: 8, rating: 4.6, reviewCount: 870 },
    { slug: 'maruti-grand-vitara', brand: 'Maruti Suzuki', model: 'Grand Vitara', priceMin: 1077000, priceMax: 1972000, bodyType: 'SUV', fuelType: 'Hybrid', transmission: 'Automatic', seatingCapacity: 5, rating: 4.3, reviewCount: 430 },
    { slug: 'renault-kwid', brand: 'Renault', model: 'Kwid', priceMin: 430000, priceMax: 599000, bodyType: 'Hatchback', fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 5, rating: 3.9, reviewCount: 980 },
    { slug: 'renault-triber', brand: 'Renault', model: 'Triber', priceMin: 576000, priceMax: 860000, bodyType: 'MPV', fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 7, isTrending: true, rating: 4.0, reviewCount: 560 },
    { slug: 'honda-amaze', brand: 'Honda', model: 'Amaze', priceMin: 752000, priceMax: 1000000, bodyType: 'Sedan', fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, rating: 4.1, reviewCount: 760 },
    { slug: 'nissan-tekton', brand: 'Nissan', model: 'Tekton', priceMin: 1100000, priceMax: 1800000, bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', isUpcoming: true, category: 'upcoming', launchDate: 'Mar 2026', rating: 4.0, reviewCount: 0 },
  ];
}

function getFallbackUsedCars() {
  return [
    { _id: 'u1', brand: 'Toyota', model: 'Fortuner', year: 2020, price: 2800000, km: 45000, fuelType: 'Diesel', transmission: 'Automatic', city: 'Delhi', owner: '1st Owner', isCertified: true },
    { _id: 'u2', brand: 'Hyundai', model: 'Verna', year: 2021, price: 780000, km: 32000, fuelType: 'Petrol', transmission: 'Automatic', city: 'Mumbai', owner: '1st Owner', isCertified: true },
    { _id: 'u3', brand: 'Maruti Suzuki', model: 'Swift DZire', year: 2019, price: 520000, km: 55000, fuelType: 'Petrol', transmission: 'Manual', city: 'Bangalore', owner: '2nd Owner' },
    { _id: 'u4', brand: 'Mahindra', model: 'Thar', year: 2022, price: 1450000, km: 18000, fuelType: 'Diesel', transmission: 'Manual', city: 'Pune', owner: '1st Owner', isCertified: true },
    { _id: 'u5', brand: 'Tata', model: 'Nexon', year: 2021, price: 920000, km: 28000, fuelType: 'Petrol', transmission: 'Automatic', city: 'Delhi', owner: '1st Owner', isCertified: true },
    { _id: 'u6', brand: 'Hyundai', model: 'Creta', year: 2020, price: 1150000, km: 42000, fuelType: 'Petrol', transmission: 'Automatic', city: 'Mumbai', owner: '1st Owner' },
    { _id: 'u7', brand: 'Kia', model: 'Seltos', year: 2021, price: 1280000, km: 35000, fuelType: 'Diesel', transmission: 'Automatic', city: 'Gurgaon', owner: '1st Owner', isCertified: true },
    { _id: 'u8', brand: 'Honda', model: 'City', year: 2019, price: 780000, km: 58000, fuelType: 'Petrol', transmission: 'Automatic', city: 'Kolkata', owner: '2nd Owner' },
  ];
}

function getFallbackBrands() {
  return [
    { name: 'Maruti Suzuki', slug: 'maruti-suzuki', carCount: 18, isPopular: true },
    { name: 'Tata', slug: 'tata', carCount: 15, isPopular: true },
    { name: 'Mahindra', slug: 'mahindra', carCount: 12, isPopular: true },
    { name: 'Hyundai', slug: 'hyundai', carCount: 14, isPopular: true },
    { name: 'Toyota', slug: 'toyota', carCount: 10, isPopular: true },
    { name: 'Kia', slug: 'kia', carCount: 8, isPopular: true },
    { name: 'Skoda', slug: 'skoda', carCount: 6, isPopular: true },
    { name: 'BMW', slug: 'bmw', carCount: 20, isPopular: true },
    { name: 'Renault', slug: 'renault', carCount: 7, isPopular: true },
    { name: 'Nissan', slug: 'nissan', carCount: 5, isPopular: true },
    { name: 'Mercedes-Benz', slug: 'mercedes-benz', carCount: 25, isPopular: true },
    { name: 'MG', slug: 'mg', carCount: 7, isPopular: true },
  ];
}

function getFallbackNews() {
  return [
    { _id: 'n1', title: 'Chery Lepas L6 Patented in India', excerpt: 'Lepas is a new sub-brand that targets young audiences.', author: 'Dwij Bhandut', category: 'News', publishedAt: '2026-03-14' },
    { _id: 'n2', title: "Here's Why Automatics Are Becoming Standard across Lower Variants", excerpt: "India's mass-market car segment has seen a clear shift in buyer preferences.", author: 'Sagar Bhanushali', category: 'News', publishedAt: '2026-03-14' },
    { _id: 'n3', title: 'Ferrari 849 Testarossa Debuts in India at Rs. 10.37 Crore', excerpt: 'Ferrari has unveiled the new Ferrari 849 Testarossa in India today.', author: 'Haji Chakralwale', category: 'News', publishedAt: '2026-03-14' },
    { _id: 'n4', title: 'Kia Carens Clavis Long-Term Review: City Report', excerpt: 'After a month with the Clavis, it has become my go-to for the daily grind.', author: 'Santosh Nair', category: 'Review', publishedAt: '2026-03-13' },
    { _id: 'n5', title: 'BMW M2 CS First Look Review', excerpt: 'We take a look at the new BMW M2 CS, aimed at purists.', author: 'Santosh Nair', category: 'Review', publishedAt: '2026-03-13' },
    { _id: 'n6', title: 'Tata Punch EV Facelift First Drive Review', excerpt: 'Sometimes a facelift arrives in the form of strategic upgrades.', author: 'Desirazu Venkat', category: 'Review', publishedAt: '2026-02-28' },
    { _id: 'n7', title: 'Maruti Suzuki Dzire Hits 3 Million Sales Milestone', excerpt: 'The compact sedan has surpassed 3 million cumulative sales since 2008.', author: 'Haji Chakralwale', category: 'News', publishedAt: '2026-03-13' },
    { _id: 'n8', title: "Vinfast Introduces 'Trade Gas for Electric' Program", excerpt: 'The Vietnamese automaker is offering additional discounts on EVs across India.', author: 'Dwij Bhandut', category: 'Launch', publishedAt: '2026-03-14' },
  ];
}

const form = document.getElementById('sellForm');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('brand', document.getElementById('brand').value);
    formData.append('price', document.getElementById('price').value);
    formData.append('image', document.getElementById('image').files[0]);

    const res = await fetch('/api/used-cars/sell', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    alert(data.message);
  });
}
const fileInput = document.getElementById('image');
const fileText = document.getElementById('fileText');

if (fileInput) {
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      fileText.innerText = fileInput.files[0].name;
    } else {
      fileText.innerText = "Choose Car Image";
    }
  });
}