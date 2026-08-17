-- ============================================================
-- CEMILAN CIAMIS — Supabase Storage Buckets & Policies Setup
-- Jalankan skrip ini di SQL Editor di Dasbor Supabase Anda
-- ============================================================

-- 1. BUAT STORAGE BUCKETS (Public)
INSERT INTO storage.buckets (id, name, public) VALUES
('products', 'products', true),
('avatars',  'avatars',  true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. STORAGE POLICIES — Mencegah Upload Ilegal & Mengizinkan Akses Publik

-- ── A. Public Read (Semua orang bisa melihat foto produk & profil) ──
CREATE POLICY "Public Access Products Storage"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'products');

CREATE POLICY "Public Access Avatars Storage"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

-- ── B. Upload & Delete (Hanya User / Penjual Terautentikasi yang Boleh Upload) ──
CREATE POLICY "Authenticated Users Upload Products"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Users Update Products"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'products' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Users Delete Products"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'products' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Users Upload Avatars"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Users Update Avatars"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
