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
async function registerSellerToSupabase(email, password, shopName, sellerName, whatsapp) {
  if (!db) return { success: false, message: 'Supabase client belum dikonfigurasi.' };

  try {
    // 1. Register user di Supabase Auth
    const { data: authData, error: authError } = await db.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          shop_name: shopName,
          name: sellerName
        }
      }
    });

    if (authError) {
      return { success: false, message: authError.message };
    }

    const userId = authData.user ? authData.user.id : null;
    const sellerId = 'seller-' + Date.now();

    // 2. Insert profil penjual ke tabel public.sellers
    const { error: dbError } = await db
      .from('sellers')
      .insert([
        {
          id: sellerId,
          user_id: userId,
          name: sellerName,
          shop_name: shopName,
          whatsapp: whatsapp || '6281234567890',
          avatar: '👩‍🍳',
          village: 'Desa Cikoneng, Ciamis',
          bio: 'Penjual UMKM Cemilan Ciamis.'
        }
      ]);

    if (dbError) {
      console.warn('Pendaftaran Auth berhasil, namun insert tabel sellers dibatasi RLS:', dbError);
    }

    return {
      success: true,
      message: 'Pendaftaran berhasil! Akun Anda telah tersimpan di Supabase Auth.'
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
}
