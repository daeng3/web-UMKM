-- ============================================================
-- SQL SCRIPT: Setup RLS Sellers untuk Super Admin
-- Jalankan ini di Supabase SQL Editor
-- ============================================================

-- Hapus policy lama jika ada (agar tidak bentrok)
DROP POLICY IF EXISTS "SuperAdmin Insert Sellers" ON public.sellers;
DROP POLICY IF EXISTS "SuperAdmin Update Sellers" ON public.sellers;
DROP POLICY IF EXISTS "SuperAdmin Delete Sellers" ON public.sellers;

-- Policy: Super Admin bisa MENAMBAH profil penjual
CREATE POLICY "SuperAdmin Insert Sellers" 
    ON public.sellers FOR INSERT 
    WITH CHECK (auth.jwt() ->> 'email' = 'superadmin@cemilanciamis.com');

-- Policy: Super Admin bisa MERUBAH profil penjual
CREATE POLICY "SuperAdmin Update Sellers" 
    ON public.sellers FOR UPDATE 
    USING (auth.jwt() ->> 'email' = 'superadmin@cemilanciamis.com');

-- Policy: Super Admin bisa MENGHAPUS profil penjual
CREATE POLICY "SuperAdmin Delete Sellers" 
    ON public.sellers FOR DELETE 
    USING (auth.jwt() ->> 'email' = 'superadmin@cemilanciamis.com');
