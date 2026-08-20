/**
 * CEMILAN CIAMIS — Supabase Client Configuration & Data Service
 * File ini menghubungkan frontend web dengan database Supabase PostgreSQL.
 */

const SUPABASE_URL = 'https://mjkxwbvjmzxbupejgwse.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qa3h3YnZqbXp4YnVwZWpnd3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5ODEzMjIsImV4cCI6MjEwMjU1NzMyMn0.vBXyAQ86sm-0pk-5zY1IKX-hh5CHJCdCHGLRWLUO_qQ';

let db = null;

try {
  if (typeof supabase !== 'undefined') {
    db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('⚡ Supabase Client berhasil terhubung ke mjkxwbvjmzxbupejgwse.supabase.co');
  } else {
    console.warn('⚠️ SDK Supabase belum dimuat di HTML. Menggunakan data lokal.');
  }
} catch (err) {
  console.error('Gagal menginisialisasi Supabase Client:', err);
}

/**
 * Mengambil seluruh data produk dari Supabase (dengan fallback ke data.js jika offline)
 */
async function getProductsFromSupabase() {
  if (!db) return typeof PRODUCTS !== 'undefined' ? PRODUCTS : [];
  
  try {
    const { data, error } = await db
      .from('products')
      .select(`
        id,
        seller_id,
        category_id,
        name,
        description,
        base_price,
        variations,
        emoji,
        image_url,
        discount,
        is_featured,
        is_new,
        is_active,
        view_count,
        created_at,
        sellers (
          id,
          name,
          shop_name,
          avatar,
          whatsapp,
          village
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      console.warn('Menggunakan fallback data lokal (PRODUCTS):', error);
      return typeof PRODUCTS !== 'undefined' ? PRODUCTS : [];
    }

    // Format data dari database ke struktur yang digunakan frontend
    return data.map(item => ({
      id: item.id,
      sellerId: item.seller_id,
      category: item.category_id,
      name: item.name,
      description: item.description,
      basePrice: Number(item.base_price),
      variations: Array.isArray(item.variations) ? item.variations : JSON.parse(item.variations || '[]'),
      emoji: item.emoji || '📦',
      imageUrl: item.image_url,
      discount: item.discount || 0,
      isFeatured: item.is_featured,
      isNew: item.is_new,
      isActive: item.is_active,
      viewCount: item.view_count,
      seller: item.sellers ? {
        id: item.sellers.id,
        name: item.sellers.name,
        shopName: item.sellers.shop_name,
        avatar: item.sellers.avatar,
        whatsapp: item.sellers.whatsapp,
        village: item.sellers.village
      } : null
    }));
  } catch (e) {
    console.error('Error fetching Supabase products:', e);
    return typeof PRODUCTS !== 'undefined' ? PRODUCTS : [];
  }
}

/**
 * Mengambil seluruh data penjual dari Supabase
 */
async function getSellersFromSupabase() {
  if (!db) return typeof SELLERS !== 'undefined' ? SELLERS : [];
  
  try {
    const { data, error } = await db
      .from('sellers')
      .select('*');

    if (error || !data || data.length === 0) {
      return typeof SELLERS !== 'undefined' ? SELLERS : [];
    }

    return data.map(s => ({
      id: s.id,
      name: s.name,
      shopName: s.shop_name,
      avatar: s.avatar || '👩‍🍳',
      photoUrl: s.photo_url,
      bio: s.bio,
      whatsapp: s.whatsapp,
      village: s.village,
      joinedAt: s.joined_at,
      productCount: 0
    }));
  } catch (e) {
    return typeof SELLERS !== 'undefined' ? SELLERS : [];
  }
}

/**
 * Upload gambar ke Supabase Storage (Bucket: 'products' atau 'avatars')
 * @param {File} file File gambar dari input type="file"
 * @param {string} bucketName 'products' atau 'avatars'
 * @returns {Promise<{success: boolean, url: string, message?: string}>}
 */
async function uploadImageToSupabase(file, bucketName = 'products') {
  if (!db) return { success: false, message: 'Supabase client belum dikonfigurasi.' };
  if (!file) return { success: false, message: 'Tidak ada file yang dipilih.' };

  // Validasi tipe file gambar
  if (!file.type.startsWith('image/')) {
    return { success: false, message: 'File harus berupa gambar (JPG, PNG, WebP).' };
  }

  // Validasi ukuran file (Max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, message: 'Ukuran gambar maksimal 5MB.' };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

    const { data, error } = await db.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload Storage Error:', error);
      return { success: false, message: error.message };
    }

    // Ambil Public URL gambar
    const { data: publicUrlData } = db.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return {
      success: true,
      url: publicUrlData.publicUrl,
      fileName: fileName
    };
  } catch (err) {
    console.error('Upload Exception:', err);
    return { success: false, message: err.message };
  }
}

/**
 * Mendaftarkan akun penjual baru ke Supabase Auth & Tabel Sellers
 */
async function registerSellerToSupabase(username, password, shopName, sellerName, whatsapp) {
  if (!db) return { success: false, message: 'Supabase client belum dikonfigurasi.' };

  try {
    const safeUsername = username.trim().toLowerCase().split('@')[0].replace(/[^a-z0-9_]/g, '');
    const email = `${safeUsername}@umkmpanjalu.web.id`;

    // 1. Register user di Supabase Auth
    const { data: authData, error: authError } = await db.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: window.location.origin + '/login.html',
        data: {
          shop_name: shopName,
          name: sellerName
        }
      }
    });

    if (authError) {
      return { success: false, message: authError.message };
    }

    // Berhasil mendaftar. Pembuatan profil (tabel sellers) akan dilakukan
    // secara otomatis saat user login pertama kali agar tidak terblokir RLS.
    return {
      success: true,
      message: 'Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi (jika diaktifkan), lalu silakan Login.'
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 * Login akun penjual ke Supabase Auth
 */
async function loginSellerToSupabase(username, password) {
  if (!db) return { success: false, message: 'Supabase client belum dikonfigurasi.' };

  try {
    const rawUsername = username.trim().toLowerCase();
    const safeUsername = rawUsername.split('@')[0].replace(/[^a-z0-9_]/g, '');
    const email = rawUsername === 'superadmin' ? 'superadmin@cemilanciamis.com' : `${safeUsername}@umkmpanjalu.web.id`;

    const { data: authData, error: authError } = await db.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (authError) {
      return { success: false, message: authError.message };
    }

    const userId = authData.user.id;

    // Ambil data seller dari tabel public.sellers
    const { data: sellerData, error: dbError } = await db
      .from('sellers')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (dbError || !sellerData) {
      console.warn('Profil seller belum ada, membuat otomatis...', dbError);
      
      const isSuperAdmin = authData.user.email === 'superadmin@cemilanciamis.com';
      const sellerId = isSuperAdmin ? 'super-admin' : ('seller-' + Date.now());
      const meta = authData.user.user_metadata || {};
      const newSeller = {
        id: sellerId,
        user_id: userId,
        name: isSuperAdmin ? 'Admin Paguyuban' : (meta.name || 'Penjual Baru'),
        shop_name: isSuperAdmin ? 'Super Admin' : (meta.shop_name || 'Toko Baru'),
        whatsapp: '6281234567890',
        avatar: isSuperAdmin ? '👑' : '👩‍🍳',
        village: isSuperAdmin ? 'Pusat' : 'Desa Cikoneng, Ciamis',
        bio: isSuperAdmin ? 'Akun pengelola utama platform Cemilan Ciamis.' : 'Penjual UMKM Cemilan Ciamis.'
      };

      const { error: insertErr } = await db.from('sellers').upsert([newSeller]);
      
      if (insertErr) {
        return { 
          success: false, 
          message: `Login berhasil, tapi gagal membuat profil otomatis: ${insertErr.message}` 
        };
      }

      return {
        success: true,
        message: 'Login berhasil dan profil otomatis dibuat.',
        seller: newSeller,
        role: isSuperAdmin ? 'super_admin' : 'seller'
      };
    }

    return {
      success: true,
      message: 'Login berhasil.',
      seller: sellerData,
      role: authData.user.email === 'superadmin@cemilanciamis.com' ? 'super_admin' : 'seller'
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
}
async function addProductToSupabase(productData) {
  if (!db) return { success: false, message: 'Supabase tidak tersedia.' };
  try {
    const { error } = await db.from('products').insert([
      {
        seller_id: productData.sellerId,
        category_id: productData.category,
        name: productData.name,
        description: productData.description,
        base_price: productData.basePrice,
        variations: JSON.stringify(productData.variations),
        emoji: productData.emoji,
        image_url: productData.image_url,
        discount: productData.discount,
        is_featured: productData.isFeatured,
        is_new: productData.isNew,
        is_active: productData.isActive,
        view_count: productData.viewCount
      }
    ]);
    if (error) return { success: false, message: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, message: err.message };
  }
}async function updateSellerToSupabase(sellerId, sellerData) {
  if (!db) return { success: false, message: 'Supabase tidak tersedia.' };
  try {
    const { error } = await db.from('sellers').update({
      name: sellerData.name,
      shop_name: sellerData.shopName,
      whatsapp: sellerData.whatsapp,
      village: sellerData.village,
      bio: sellerData.bio,
      photo_url: sellerData.photoUrl,
      avatar: sellerData.avatar
    }).eq('id', sellerId);
    
    if (error) return { success: false, message: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 * Update produk di Supabase
 */
async function updateProductToSupabase(productId, productData) {
  if (!db) return { success: false, message: 'Supabase tidak tersedia.' };
  try {
    const { error } = await db.from('products').update({
      category_id: productData.category,
      name: productData.name,
      description: productData.description,
      base_price: productData.basePrice,
      variations: JSON.stringify(productData.variations),
      emoji: productData.emoji,
      image_url: productData.image_url,
      discount: productData.discount,
      is_featured: productData.isFeatured,
      is_new: productData.isNew,
      updated_at: new Date().toISOString()
    }).eq('id', productId);
    
    if (error) return { success: false, message: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, message: err.message };
  }
}
/**
 * Middleware untuk mengecek sesi (Session Management)
 */
async function checkAuth() {
  if (!db) return { authenticated: false };
  
  const { data, error } = await db.auth.getSession();
  if (error || !data.session) {
    return { authenticated: false };
  }
  
  const { data: sellerData } = await db
    .from('sellers')
    .select('*')
    .eq('user_id', data.session.user.id)
    .single();

  return { authenticated: true, session: data.session, seller: sellerData };
}

/**
 * Logout pengguna
 */
async function logoutSeller() {
  if (db) await db.auth.signOut();
  localStorage.removeItem('adminSellerId');
  localStorage.removeItem('adminLoggedIn');
}

/**
 * Kategori API
 */

async function fetchCategories() {
  if (!db) return { success: false, message: 'Supabase client belum dikonfigurasi.', data: [] };
  
  try {
    const { data, error } = await db
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    return { success: true, data: data };
  } catch (err) {
    return { success: false, message: err.message, data: [] };
  }
}

async function addCategory(id, name, icon) {
  if (!db) return { success: false, message: 'Supabase client belum dikonfigurasi.' };
  
  try {
    const { error } = await db.from('categories').upsert([{
      id: id,
      name: name,
      icon: icon
    }]);
    
    if (error) throw error;
    return { success: true, message: 'Kategori berhasil ditambahkan.' };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

async function deleteCategory(id) {
  if (!db) return { success: false, message: 'Supabase client belum dikonfigurasi.' };
  
  try {
    const { error } = await db.from('categories').delete().eq('id', id);
    if (error) throw error;
    return { success: true, message: 'Kategori berhasil dihapus.' };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 * Super Admin: API Penjual
 */
async function fetchAllSellers() {
  if (!db) return { success: false, message: 'Supabase tidak tersedia', data: [] };
  
  try {
    const { data, error } = await db.from('sellers').select('*').order('joined_at', { ascending: false });
    if (error) throw error;
    return { success: true, data: data };
  } catch (err) {
    return { success: false, message: err.message, data: [] };
  }
}

async function adminCreateSeller(sellerData) {
  if (!db) return { success: false, message: 'Supabase tidak tersedia' };
  
  try {
    // 1. Buat temporary client tanpa persistensi agar sesi admin tidak tertimpa
    const tempDb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
    
    // 2. Konversi username menjadi email internal (menggunakan domain asli agar lolos validasi Supabase)
    const rawUsername = sellerData.username.trim().toLowerCase().split('@')[0];
    const safeUsername = rawUsername.replace(/[^a-z0-9_]/g, '');
    const generatedEmail = `${safeUsername}@umkmpanjalu.web.id`;
    
    // 3. Daftarkan di Auth
    const { data: authData, error: authError } = await tempDb.auth.signUp({
      email: generatedEmail,
      password: sellerData.password,
      options: {
        data: {
          name: sellerData.name,
          shop_name: sellerData.shopName
        }
      }
    });
    
    if (authError) throw authError;
    
    // 4. Buat profil di public.sellers
    const newSellerId = 'seller-' + Date.now();
    const { error: dbError } = await db.from('sellers').insert([{
      id: newSellerId,
      user_id: authData.user.id,
      name: sellerData.name,
      shop_name: sellerData.shopName,
      whatsapp: sellerData.whatsapp,
      village: sellerData.village,
      bio: sellerData.bio,
      avatar: sellerData.avatar || '👩‍🍳'
    }]);
    
    if (dbError) throw dbError;
    
    return { success: true, username: safeUsername };
  } catch (err) {
    return { success: false, message: err.message };
  }
}
