/**
 * CEMILAN CIAMIS — Demo Data
 * Data sementara untuk development, nanti akan diganti Firebase Firestore
 */

const CATEGORIES = [
  { id: 'keripik',   name: 'Keripik & Kerupuk',  icon: '🥔', order: 1 },
  { id: 'kue-kering', name: 'Kue Kering',         icon: '🍪', order: 2 },
  { id: 'manisan',   name: 'Manisan & Dodol',     icon: '🍬', order: 3 },
  { id: 'kacang',    name: 'Kacang & Camilan',     icon: '🥜', order: 4 },
  { id: 'paket',     name: 'Paket Hampers',        icon: '🎁', order: 5 },
];

const SUPER_ADMIN_ACCOUNT = {
  id: 'super-admin',
  username: 'admin@mail.com',
  password: 'admin123', // Kredensial default admin paguyuban (wajib diganti di production)
  name: 'Admin Paguyuban UMKM',
  role: 'super_admin',
  mustChangePassword: false,
  sellerId: null
};

let SELLERS = [
  {
    id: 'bu-siti',
    username: 'busiti',
    password: 'siti123',
    role: 'seller',
    mustChangePassword: true, // Wajib ganti sandi saat login pertama
    name: 'Bu Siti Nurhaliza',
    shopName: 'Keripik Bu Siti',
    photo: '',
    avatar: '👩‍🍳',
    bio: 'Ibu rumah tangga yang sudah 15 tahun membuat keripik khas Ciamis. Setiap keripik dibuat dengan bahan pilihan dan digoreng menggunakan resep turun-temurun yang menjaga cita rasa otentik.',
    whatsapp: '6281234567890',
    village: 'Desa Cikoneng, Ciamis',
    joinedAt: '2024-01-15',
    productCount: 4,
  },
  {
    id: 'bu-ani',
    username: 'buani',
    password: 'ani123',
    role: 'seller',
    mustChangePassword: true, // Wajib ganti sandi saat login pertama
    name: 'Bu Ani Rahmawati',
    shopName: 'Kue Ani Homemade',
    photo: '',
    avatar: '👩‍🍳',
    bio: 'Spesialis kue kering dan cookies premium buatan rumah. Semua kue dibuat dengan bahan berkualitas tanpa pengawet, cocok untuk oleh-oleh, acara spesial, dan hampers.',
    whatsapp: '6281234567891',
    village: 'Desa Cikoneng, Ciamis',
    joinedAt: '2024-02-01',
    productCount: 4,
  },
  {
    id: 'bu-rina',
    username: 'burina',
    password: 'rina123',
    role: 'seller',
    mustChangePassword: true, // Wajib ganti sandi saat login pertama
    name: 'Bu Rina Wulandari',
    shopName: 'Dodol & Manisan Bu Rina',
    photo: '',
    avatar: '👩‍🍳',
    bio: 'Pengrajin dodol dan manisan tradisional yang sudah mewarisi resep dari nenek moyang. Produk kami 100% alami tanpa pewarna buatan, diolah dengan cinta dan kesabaran.',
    whatsapp: '6281234567892',
    village: 'Desa Cikoneng, Ciamis',
    joinedAt: '2024-03-10',
    productCount: 4,
  },
];

let PRODUCTS = [
  // ─── Bu Siti Products ───
  {
    id: 'keripik-singkong-pedas',
    sellerId: 'bu-siti',
    name: 'Keripik Singkong Pedas',
    description: 'Keripik singkong renyah dengan bumbu pedas khas Ciamis yang menggugah selera. Dibuat dari singkong pilihan yang diiris tipis dan digoreng sempurna, lalu dibumbui dengan racikan cabai istimewa. Cocok untuk camilan sehari-hari maupun teman nonton.',
    category: 'keripik',
    basePrice: 15000,
    variations: [
      { name: 'Original', price: 12000 },
      { name: 'Pedas', price: 15000 },
      { name: 'Pedas Manis', price: 15000 },
      { name: 'Extra Pedas', price: 17000 },
    ],
    images: [],
    emoji: '🥔',
    isFeatured: true,
    discount: 10,
    isNew: false,
    isActive: true,
    viewCount: 342,
    createdAt: '2024-02-01',
    updatedAt: '2024-06-15',
  },
  {
    id: 'kerupuk-kulit',
    sellerId: 'bu-siti',
    name: 'Kerupuk Kulit Sapi Renyah',
    description: 'Kerupuk kulit sapi pilihan yang diproses secara higienis dan digoreng hingga mengembang sempurna. Tekstur renyah dan gurih, cocok sebagai lauk pendamping atau cemilan favorit keluarga.',
    category: 'keripik',
    basePrice: 25000,
    variations: [
      { name: 'Kecil (100g)', price: 15000 },
      { name: 'Sedang (250g)', price: 25000 },
      { name: 'Besar (500g)', price: 45000 },
    ],
    images: [],
    emoji: '🦴',
    isFeatured: false,
    discount: 0,
    isNew: false,
    isActive: true,
    viewCount: 189,
    createdAt: '2024-02-15',
    updatedAt: '2024-06-10',
  },
  {
    id: 'keripik-tempe',
    sellerId: 'bu-siti',
    name: 'Keripik Tempe Gurih',
    description: 'Keripik tempe tipis dan renyah dengan cita rasa gurih yang khas. Terbuat dari tempe segar berkualitas, diiris tipis dan digoreng garing. Sumber protein nabati yang nikmat sebagai cemilan sehat.',
    category: 'keripik',
    basePrice: 18000,
    variations: [
      { name: 'Original', price: 18000 },
      { name: 'Daun Jeruk', price: 20000 },
    ],
    images: [],
    emoji: '🫘',
    isFeatured: false,
    discount: 0,
    isNew: true,
    isActive: true,
    viewCount: 97,
    createdAt: '2024-07-01',
    updatedAt: '2024-07-01',
  },
  {
    id: 'basreng-bu-siti',
    sellerId: 'bu-siti',
    name: 'Basreng Pedas Daun Jeruk',
    description: 'Bakso goreng renyah dengan taburan bumbu pedas dan aroma daun jeruk yang harum. Tekstur crunchy di luar, gurih di dalam. Camilan viral yang bikin nagih!',
    category: 'keripik',
    basePrice: 15000,
    variations: [
      { name: 'Original', price: 12000 },
      { name: 'Pedas', price: 15000 },
      { name: 'Pedas Gila', price: 17000 },
    ],
    images: [],
    emoji: '🔥',
    isFeatured: true,
    discount: 0,
    isNew: true,
    isActive: true,
    viewCount: 156,
    createdAt: '2024-07-10',
    updatedAt: '2024-07-10',
  },

  // ─── Bu Ani Products ───
  {
    id: 'nastar-keju',
    sellerId: 'bu-ani',
    name: 'Nastar Keju Premium',
    description: 'Kue nastar premium dengan isian selai nanas asli yang lembut dan topping keju parmesan. Dibuat dengan butter berkualitas dan telur kampung, menghasilkan tekstur yang lumer di mulut. Favorit untuk lebaran dan hampers.',
    category: 'kue-kering',
    basePrice: 85000,
    variations: [
      { name: 'Toples Kecil (250g)', price: 45000 },
      { name: 'Toples Sedang (500g)', price: 85000 },
      { name: 'Toples Besar (1kg)', price: 160000 },
    ],
    images: [],
    emoji: '🍪',
    isFeatured: true,
    discount: 15,
    isNew: false,
    isActive: true,
    viewCount: 524,
    createdAt: '2024-02-01',
    updatedAt: '2024-06-20',
  },
  {
    id: 'kastengel',
    sellerId: 'bu-ani',
    name: 'Kastengel Keju Spesial',
    description: 'Kastengel premium dengan keju Edam asli yang melimpah. Setiap batang dioles kuning telur dan ditaburi keju parut, menghasilkan rasa gurih dan renyah yang tak tertahankan. Kemasan eksklusif.',
    category: 'kue-kering',
    basePrice: 90000,
    variations: [
      { name: 'Toples Kecil (250g)', price: 50000 },
      { name: 'Toples Sedang (500g)', price: 90000 },
      { name: 'Toples Besar (1kg)', price: 170000 },
    ],
    images: [],
    emoji: '🧀',
    isFeatured: true,
    discount: 0,
    isNew: false,
    isActive: true,
    viewCount: 378,
    createdAt: '2024-02-15',
    updatedAt: '2024-06-20',
  },
  {
    id: 'putri-salju',
    sellerId: 'bu-ani',
    name: 'Putri Salju Lembut',
    description: 'Kue putri salju yang lumer di mulut dengan taburan gula halus yang lembut seperti salju. Dibuat dengan tepung almond asli dan butter premium, menghasilkan tekstur yang sangat lembut.',
    category: 'kue-kering',
    basePrice: 75000,
    variations: [
      { name: 'Toples Kecil (250g)', price: 40000 },
      { name: 'Toples Sedang (500g)', price: 75000 },
    ],
    images: [],
    emoji: '⛄',
    isFeatured: false,
    discount: 0,
    isNew: false,
    isActive: true,
    viewCount: 201,
    createdAt: '2024-03-01',
    updatedAt: '2024-06-15',
  },
  {
    id: 'cookies-coklat',
    sellerId: 'bu-ani',
    name: 'Cookies Coklat Double Chip',
    description: 'Cookies coklat premium dengan double chocolate chips (dark & white chocolate). Tekstur chewy di dalam, renyah di luar. Menggunakan coklat Belgia berkualitas tinggi.',
    category: 'kue-kering',
    basePrice: 65000,
    variations: [
      { name: 'Box 12 pcs', price: 65000 },
      { name: 'Box 24 pcs', price: 120000 },
    ],
    images: [],
    emoji: '🍫',
    isFeatured: false,
    discount: 0,
    isNew: true,
    isActive: true,
    viewCount: 89,
    createdAt: '2024-07-05',
    updatedAt: '2024-07-05',
  },

  // ─── Bu Rina Products ───
  {
    id: 'dodol-garut',
    sellerId: 'bu-rina',
    name: 'Dodol Garut Spesial',
    description: 'Dodol tradisional khas Jawa Barat yang diolah secara tradisional selama berjam-jam hingga menghasilkan tekstur kenyal yang sempurna. Terbuat dari ketan, gula aren, dan santan murni tanpa pengawet.',
    category: 'manisan',
    basePrice: 35000,
    variations: [
      { name: 'Original', price: 35000 },
      { name: 'Wijen', price: 38000 },
      { name: 'Durian', price: 45000 },
      { name: 'Susu', price: 40000 },
    ],
    images: [],
    emoji: '🍬',
    isFeatured: true,
    discount: 0,
    isNew: false,
    isActive: true,
    viewCount: 445,
    createdAt: '2024-03-10',
    updatedAt: '2024-06-25',
  },
  {
    id: 'sale-pisang',
    sellerId: 'bu-rina',
    name: 'Sale Pisang Manis',
    description: 'Sale pisang tradisional dari pisang ambon pilihan yang dikeringkan secara alami di bawah sinar matahari. Rasa manis alami tanpa gula tambahan, tekstur kenyal dan legit. Cemilan sehat dan bergizi.',
    category: 'manisan',
    basePrice: 28000,
    variations: [
      { name: 'Sale Kering', price: 28000 },
      { name: 'Sale Basah', price: 30000 },
      { name: 'Sale Gulung', price: 35000 },
    ],
    images: [],
    emoji: '🍌',
    isFeatured: false,
    discount: 20,
    isNew: false,
    isActive: true,
    viewCount: 267,
    createdAt: '2024-03-15',
    updatedAt: '2024-06-20',
  },
  {
    id: 'wajit-ciamis',
    sellerId: 'bu-rina',
    name: 'Wajit Khas Ciamis',
    description: 'Wajit tradisional khas Ciamis yang dibuat dari beras ketan, kelapa parut, dan gula merah. Diolah dengan cara tradisional menghasilkan rasa manis legit yang khas. Cocok sebagai oleh-oleh.',
    category: 'manisan',
    basePrice: 30000,
    variations: [
      { name: 'Original (250g)', price: 30000 },
      { name: 'Besar (500g)', price: 55000 },
    ],
    images: [],
    emoji: '🟫',
    isFeatured: false,
    discount: 0,
    isNew: false,
    isActive: true,
    viewCount: 134,
    createdAt: '2024-04-01',
    updatedAt: '2024-06-15',
  },
  {
    id: 'rangginang',
    sellerId: 'bu-rina',
    name: 'Rangginang Renyah',
    description: 'Rangginang atau ranginang adalah kerupuk tradisional Sunda yang terbuat dari beras ketan. Digoreng hingga mengembang sempurna dengan tekstur renyah dan rasa gurih yang autentik.',
    category: 'keripik',
    basePrice: 22000,
    variations: [
      { name: 'Kecil (10 pcs)', price: 22000 },
      { name: 'Besar (20 pcs)', price: 40000 },
    ],
    images: [],
    emoji: '🍘',
    isFeatured: false,
    discount: 0,
    isNew: true,
    isActive: true,
    viewCount: 76,
    createdAt: '2024-07-08',
    updatedAt: '2024-07-08',
  },
];

// ─── Data Storage & Persistence (LocalStorage Sinkronisasi) ───
function initDataStorage() {
  try {
    const savedSellers = localStorage.getItem('cemilan_ciamis_sellers');
    if (savedSellers) {
      SELLERS = JSON.parse(savedSellers);
    }
    const savedProducts = localStorage.getItem('cemilan_ciamis_products');
    if (savedProducts) {
      PRODUCTS = JSON.parse(savedProducts);
    }
  } catch (e) {
    console.warn('Gagal memuat data dari localStorage:', e);
  }
}

function saveSellersToStorage() {
  try {
    localStorage.setItem('cemilan_ciamis_sellers', JSON.stringify(SELLERS));
  } catch (e) {
    console.warn('Gagal menyimpan sellers ke localStorage:', e);
  }
}

function saveProductsToStorage() {
  try {
    localStorage.setItem('cemilan_ciamis_products', JSON.stringify(PRODUCTS));
  } catch (e) {
    console.warn('Gagal menyimpan products ke localStorage:', e);
  }
}

// Inisialisasi storage saat file dimuat
initDataStorage();

// ─── Helper Functions ───

/**
 * Format number to Indonesian Rupiah
 */
function formatRupiah(amount) {
  return 'Rp' + amount.toLocaleString('id-ID');
}

/**
 * Get discounted price
 */
function getDiscountedPrice(price, discount) {
  if (!discount) return price;
  return Math.round(price * (1 - discount / 100));
}

/**
 * Get seller by ID
 */
function getSellerById(id) {
  return SELLERS.find(s => s.id === id);
}

/**
 * Get product by ID
 */
function getProductById(id) {
  return PRODUCTS.find(p => p.id === id);
}

/**
 * Get products by seller
 */
function getProductsBySeller(sellerId) {
  return PRODUCTS.filter(p => p.sellerId === sellerId && p.isActive);
}

/**
 * Get products by category
 */
function getProductsByCategory(categoryId) {
  return PRODUCTS.filter(p => p.category === categoryId && p.isActive);
}

/**
 * Get featured products
 */
function getFeaturedProducts() {
  return PRODUCTS.filter(p => p.isFeatured && p.isActive);
}

/**
 * Get new products (newest first)
 */
function getNewProducts(limit = 8) {
  return PRODUCTS
    .filter(p => p.isActive)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
}

/**
 * Get popular products (most viewed)
 */
function getPopularProducts(limit = 8) {
  return PRODUCTS
    .filter(p => p.isActive)
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, limit);
}

/**
 * Search products by name
 */
function searchProducts(query) {
  const q = query.toLowerCase().trim();
  if (!q) return PRODUCTS.filter(p => p.isActive);
  return PRODUCTS.filter(p =>
    p.isActive && (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    )
  );
}

/**
 * Get category by ID
 */
function getCategoryById(id) {
  return CATEGORIES.find(c => c.id === id);
}

/**
 * Calculate time since date
 */
function timeSince(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diffDays < 7) return 'Baru';
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan lalu`;
  return `${Math.floor(diffDays / 365)} tahun lalu`;
}

/**
 * Authenticate user by username and password (DEMO PURPOSES ONLY)
 * Mendukung Super Admin dan Penjual (RBAC)
 */
function authenticateSeller(username, password) {
  if (!username || !password) {
    return { success: false, message: 'Username dan password wajib diisi.' };
  }
  
  const u = username.trim().toLowerCase();
  const p = password.trim();

  // Cek rate limiting sederhana
  const attemptsKey = 'login_attempts_' + u;
  let attempts = 0;
  try {
    attempts = parseInt(sessionStorage.getItem(attemptsKey) || '0', 10);
  } catch (e) {}

  if (attempts >= 5) {
    return { 
      success: false, 
      message: 'Terlalu banyak percobaan login gagal. Akun dikunci sementara demi keamanan.' 
    };
  }

  // Cek apakah Super Admin
  if (u === SUPER_ADMIN_ACCOUNT.username && p === SUPER_ADMIN_ACCOUNT.password) {
    try { sessionStorage.removeItem(attemptsKey); } catch (e) {}
    return { success: true, seller: SUPER_ADMIN_ACCOUNT, role: 'super_admin' };
  }

  // Cek apakah Seller biasa
  const seller = SELLERS.find(s => s.username === u && s.password === p);
  
  if (seller) {
    try { sessionStorage.removeItem(attemptsKey); } catch (e) {}
    return { success: true, seller: seller, role: 'seller' };
  } else {
    try { sessionStorage.setItem(attemptsKey, (attempts + 1).toString()); } catch (e) {}
    return { success: false, message: 'Username atau password salah.' };
  }
}

/**
 * Ganti kata sandi penjual (Force Password Change atau ganti profil)
 */
function updateSellerPassword(sellerId, newPassword) {
  if (sellerId === SUPER_ADMIN_ACCOUNT.id) {
    SUPER_ADMIN_ACCOUNT.password = newPassword;
    return { success: true };
  }
  const seller = SELLERS.find(s => s.id === sellerId);
  if (!seller) return { success: false, message: 'Akun tidak ditemukan.' };
  seller.password = newPassword;
  seller.mustChangePassword = false;
  saveSellersToStorage();
  return { success: true };
}

/**
 * Buat akun penjual baru oleh Admin (CRUD by Admin)
 */
function createSellerByAdmin(newSellerData) {
  const u = (newSellerData.username || '').trim().toLowerCase();
  if (!u || !newSellerData.password || !newSellerData.name || !newSellerData.shopName) {
    return { success: false, message: 'Data akun tidak lengkap.' };
  }
  if (u === 'admin@mail.com' || SELLERS.some(s => s.username === u)) {
    return { success: false, message: 'Username sudah digunakan oleh akun lain.' };
  }

  const newSeller = {
    id: 'seller-' + Date.now(),
    username: u,
    password: newSellerData.password.trim(),
    role: 'seller',
    mustChangePassword: true, // Wajib ganti sandi saat login pertama
    name: newSellerData.name.trim(),
    shopName: newSellerData.shopName.trim(),
    photo: '',
    avatar: newSellerData.avatar || '👩‍🍳',
    bio: newSellerData.bio || 'Pengrajin cemilan khas Ciamis dengan kualitas terjamin.',
    whatsapp: (newSellerData.whatsapp || '6281234567890').replace(/[^0-9]/g, ''),
    village: newSellerData.village || 'Desa Cikoneng, Ciamis',
    joinedAt: new Date().toISOString().split('T')[0],
    productCount: 0,
  };

  SELLERS.push(newSeller);
  saveSellersToStorage();
  return { success: true, seller: newSeller };
}

/**
 * Hapus akun penjual oleh Admin
 */
function deleteSellerByAdmin(sellerId) {
  const index = SELLERS.findIndex(s => s.id === sellerId);
  if (index === -1) return { success: false, message: 'Penjual tidak ditemukan.' };
  SELLERS.splice(index, 1);
  saveSellersToStorage();
  return { success: true };
}

/**
 * Reset kata sandi penjual oleh Admin
 */
function resetSellerPasswordByAdmin(sellerId, newTempPass) {
  const seller = SELLERS.find(s => s.id === sellerId);
  if (!seller) return { success: false, message: 'Penjual tidak ditemukan.' };
  seller.password = newTempPass;
  seller.mustChangePassword = true;
  saveSellersToStorage();
  return { success: true };
}

/**
 * Modul Pelacakan Iklan (Ad UTM Tracker)
 */
const AdTracker = {
  init: function() {
    try {
      const params = new URLSearchParams(window.location.search);
      const utmSource = params.get('utm_source');
      const utmMedium = params.get('utm_medium');
      const utmCampaign = params.get('utm_campaign');
      const utmContent = params.get('utm_content');
      if (utmSource || utmCampaign) {
        const adData = {
          source: utmSource || 'unknown',
          medium: utmMedium || 'cpc',
          campaign: utmCampaign || 'promo',
          content: utmContent || '',
          timestamp: new Date().toISOString()
        };
        sessionStorage.setItem('cemilan_ciamis_ad_utm', JSON.stringify(adData));
      }
    } catch(e) { console.warn('AdTracker error:', e); }
  },
  getUTMString: function() {
    try {
      const dataStr = sessionStorage.getItem('cemilan_ciamis_ad_utm');
      if (!dataStr) return '';
      const data = JSON.parse(dataStr);
      return `\n\n--------------------\n📢 Info Attribution Iklan:\n• Sumber: ${data.source.toUpperCase()}\n• Kampanye: ${data.campaign}\n• Medium: ${data.medium}`;
    } catch(e) { return ''; }
  }
};

// Auto Inisialisasi AdTracker saat skrip dimuat
AdTracker.init();
