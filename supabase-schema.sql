-- ============================================================
-- CEMILAN CIAMIS — Supabase PostgreSQL Schema & Security Script
-- Jalankan skrip ini di SQL Editor di Dasbor Supabase Anda
-- ============================================================

-- 1. EKSPLISIT ENUM / EXTENSION
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL KATEGORI (Categories)
CREATE TABLE IF NOT EXISTS public.categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(10) DEFAULT '📦',
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABEL PENJUAL (Sellers)
CREATE TABLE IF NOT EXISTS public.sellers (
    id VARCHAR(50) PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Relasi ke Supabase Auth
    name VARCHAR(100) NOT NULL,
    shop_name VARCHAR(100) NOT NULL,
    avatar VARCHAR(10) DEFAULT '👩‍🍳',
    photo_url TEXT,
    bio TEXT,
    whatsapp VARCHAR(20) NOT NULL,
    village VARCHAR(150) DEFAULT 'Desa Cikoneng, Ciamis',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABEL PRODUK (Products)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id VARCHAR(50) NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
    category_id VARCHAR(50) NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    base_price DECIMAL(12, 2) NOT NULL CHECK (base_price >= 0),
    variations JSONB DEFAULT '[]'::jsonb, -- Menyimpan variasi harga [{name: "Original", price: 12000}]
    emoji VARCHAR(10) DEFAULT '🥔',
    image_url TEXT,
    discount INT DEFAULT 0 CHECK (discount >= 0 AND discount <= 100),
    is_featured BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES — Mencegah Akses Ilegal
-- ============================================================

-- Aktifkan RLS di semua tabel
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- ── A. Policies untuk Categories ──
-- Siapa saja (Anon & Auth) bisa membaca kategori
CREATE POLICY "Public Read Categories" 
    ON public.categories FOR SELECT 
    USING (true);

-- ── B. Policies untuk Sellers ──
-- Siapa saja bisa melihat profil penjual
CREATE POLICY "Public Read Sellers" 
    ON public.sellers FOR SELECT 
    USING (true);

-- Siapa saja (Pendaftar Baru) bisa mendaftarkan profil toko baru
CREATE POLICY "Public Registration Insert Sellers"
    ON public.sellers FOR INSERT
    WITH CHECK (true);

-- Penjual hanya bisa mengedit profil miliknya sendiri
CREATE POLICY "Seller Update Own Profile" 
    ON public.sellers FOR UPDATE 
    USING (auth.uid() = user_id);

-- ── C. Policies untuk Products ──
-- Publik hanya bisa melihat produk yang aktif (is_active = true)
CREATE POLICY "Public Read Active Products" 
    ON public.products FOR SELECT 
    USING (is_active = true OR auth.role() = 'authenticated');

-- Penjual hanya bisa menambah produk atas nama toko sendiri
CREATE POLICY "Seller Insert Own Products" 
    ON public.products FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.sellers 
            WHERE id = seller_id AND user_id = auth.uid()
        )
    );

-- Penjual hanya bisa mengubah produk milik tokonya sendiri
CREATE POLICY "Seller Update Own Products" 
    ON public.products FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.sellers 
            WHERE id = seller_id AND user_id = auth.uid()
        )
    );

-- Penjual hanya bisa menghapus produk milik tokonya sendiri
CREATE POLICY "Seller Delete Own Products" 
    ON public.products FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM public.sellers 
            WHERE id = seller_id AND user_id = auth.uid()
        )
    );

-- ============================================================
-- 6. DATA AWAL (Seed Data)
-- ============================================================

INSERT INTO public.categories (id, name, icon, display_order) VALUES
('keripik',    'Keripik & Kerupuk', '🥔', 1),
('kue-kering', 'Kue Kering',        '🍪', 2),
('manisan',    'Manisan & Dodol',    '🍬', 3),
('kacang',     'Kacang & Camilan',    '🥜', 4),
('paket',      'Paket Hampers',       '🎁', 5)
ON CONFLICT (id) DO NOTHING;
