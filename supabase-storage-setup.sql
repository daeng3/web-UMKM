-- ============================================================
-- SQL SCRIPT: Setup Storage Buckets (Products & Avatars)
-- Jalankan ini di Supabase SQL Editor
-- ============================================================

-- 1. Buat Bucket 'products' (Public)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Buat Bucket 'avatars' (Public)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. Policy: Siapa saja bisa melihat gambar products
CREATE POLICY "Public Access Products" ON storage.objects
FOR SELECT USING (bucket_id = 'products');

-- 4. Policy: Hanya user login yang bisa upload products
CREATE POLICY "Auth Insert Products" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

-- 5. Policy: Siapa saja bisa melihat gambar avatars
CREATE POLICY "Public Access Avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- 6. Policy: Hanya user login yang bisa upload avatars
CREATE POLICY "Auth Insert Avatars" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
