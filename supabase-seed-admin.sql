-- ============================================================
-- CEMILAN CIAMIS — Seed Data Super Admin
-- Jalankan skrip ini di SQL Editor di Dasbor Supabase Anda
-- ============================================================

-- Mengaktifkan ekstensi pgcrypto untuk enkripsi password (jika belum aktif)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
    new_admin_id uuid := uuid_generate_v4();
BEGIN
    -- 1. Insert user ke auth.users (Supabase Authentication)
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        new_admin_id,
        'authenticated',
        'authenticated',
        'admin@mail.com',
        crypt('admin123', gen_salt('bf')),
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider": "email", "providers": ["email"]}',
        '{"name": "Super Admin"}'
    );

    -- 2. Insert identitas ke auth.identities (Diperlukan agar bisa login via email)
    INSERT INTO auth.identities (
        provider_id,
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at,
        id
    ) VALUES (
        new_admin_id::text,
        new_admin_id,
        format('{"sub": "%s", "email": "%s"}', new_admin_id::text, 'admin@mail.com')::jsonb,
        'email',
        current_timestamp,
        current_timestamp,
        current_timestamp,
        uuid_generate_v4()
    );

    -- 3. Insert ke tabel public.sellers (Agar profil dasbor tidak error)
    INSERT INTO public.sellers (
        id,
        user_id,
        name,
        shop_name,
        avatar,
        whatsapp,
        bio
    ) VALUES (
        'super-admin',
        new_admin_id,
        'Admin Paguyuban',
        'Super Admin',
        '👑',
        '6281234567890',
        'Akun pengelola utama platform Cemilan Ciamis.'
    )
    ON CONFLICT (id) DO UPDATE SET user_id = new_admin_id;

    RAISE NOTICE 'Superadmin account created successfully!';
END $$;
