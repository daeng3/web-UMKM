-- ============================================================
-- CEMILAN CIAMIS — Seed Data Super Admin
-- Jalankan skrip ini di SQL Editor di Dasbor Supabase Anda
-- ============================================================

-- Mengaktifkan ekstensi pgcrypto untuk enkripsi password (jika belum aktif)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
    admin_uuid uuid;
BEGIN
    -- Cek apakah email superadmin sudah ada di database
    SELECT id INTO admin_uuid FROM auth.users WHERE email = 'superadmin@cemilanciamis.com';

    IF admin_uuid IS NULL THEN
        -- Generate UUID baru jika belum ada
        admin_uuid := uuid_generate_v4();
        
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
            admin_uuid,
            'authenticated',
            'authenticated',
            'superadmin@cemilanciamis.com',
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
            admin_uuid::text,
            admin_uuid,
            format('{"sub": "%s", "email": "%s"}', admin_uuid::text, 'superadmin@cemilanciamis.com')::jsonb,
            'email',
            current_timestamp,
            current_timestamp,
            current_timestamp,
            uuid_generate_v4()
        );
        
        RAISE NOTICE 'Akun Superadmin baru berhasil dibuat!';
    ELSE
        -- Update password jika user sudah ada untuk memastikan bisa login dengan admin123
        UPDATE auth.users SET encrypted_password = crypt('admin123', gen_salt('bf')) WHERE id = admin_uuid;
        RAISE NOTICE 'Akun Superadmin sudah ada. Password direset ke admin123.';
    END IF;

    -- 3. Insert atau Update ke tabel public.sellers (Agar profil dasbor tidak error)
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
        admin_uuid,
        'Admin Paguyuban',
        'Super Admin',
        '👑',
        '6281234567890',
        'Akun pengelola utama platform Cemilan Ciamis.'
    )
    ON CONFLICT (id) DO UPDATE SET user_id = EXCLUDED.user_id;

END $$;
