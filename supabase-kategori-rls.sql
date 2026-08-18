-- ============================================================
-- SQL SCRIPT: Setup RLS Categories untuk Super Admin
-- Jalankan ini di Supabase SQL Editor
-- ============================================================

-- 1. Hapus policy lama jika ada (agar tidak bentrok)
DROP POLICY IF EXISTS "SuperAdmin Insert Categories" ON public.categories;
DROP POLICY IF EXISTS "SuperAdmin Delete Categories" ON public.categories;
DROP POLICY IF EXISTS "SuperAdmin Update Categories" ON public.categories;

-- 2. Policy: Super Admin bisa MENAMBAH kategori
CREATE POLICY "SuperAdmin Insert Categories" 
    ON public.categories FOR INSERT 
    WITH CHECK (auth.jwt() ->> 'email' = 'superadmin@cemilanciamis.com');

-- 3. Policy: Super Admin bisa MENGHAPUS kategori
CREATE POLICY "SuperAdmin Delete Categories" 
    ON public.categories FOR DELETE 
    USING (auth.jwt() ->> 'email' = 'superadmin@cemilanciamis.com');

-- 4. Policy: Super Admin bisa MERUBAH kategori
CREATE POLICY "SuperAdmin Update Categories" 
    ON public.categories FOR UPDATE 
    USING (auth.jwt() ->> 'email' = 'superadmin@cemilanciamis.com');
