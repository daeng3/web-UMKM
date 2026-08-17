-- ============================================================
-- CEMILAN CIAMIS — Seed Data Penjual & Produk Awal
-- Jalankan skrip ini di SQL Editor di Dasbor Supabase Anda
-- ============================================================

-- 1. INSERT PENJUAL (Sellers)
INSERT INTO public.sellers (id, name, shop_name, avatar, bio, whatsapp, village) VALUES
('bu-siti', 'Bu Siti Nurhaliza', 'Keripik Bu Siti', '👩‍🍳', 'Ibu rumah tangga yang sudah 15 tahun membuat keripik khas Ciamis. Setiap keripik dibuat dengan bahan pilihan.', '6281234567890', 'Desa Cikoneng, Ciamis'),
('bu-ani',  'Bu Ani Rahmawati', 'Kue Ani Homemade', '👩‍🍳', 'Spesialis kue kering dan cookies premium buatan rumah. Tanpa pengawet, cocok untuk oleh-oleh dan hampers.', '6281234567891', 'Desa Cikoneng, Ciamis'),
('bu-rina', 'Bu Rina Wulandari', 'Dodol & Manisan Bu Rina', '👩‍🍳', 'Pengrajin dodol dan manisan tradisional warisan nenek moyang. 100% alami tanpa pewarna buatan.', '6281234567892', 'Desa Cikoneng, Ciamis')
ON CONFLICT (id) DO NOTHING;

-- 2. INSERT PRODUK UNGGULAN (Products)
INSERT INTO public.products (seller_id, category_id, name, description, base_price, variations, emoji, discount, is_featured, is_new) VALUES
('bu-siti', 'keripik', 'Keripik Singkong Pedas', 'Keripik singkong renyah dengan bumbu pedas khas Ciamis yang menggugah selera.', 15000, '[{"name":"Original","price":12000},{"name":"Pedas","price":15000},{"name":"Extra Pedas","price":17000}]'::jsonb, '🥔', 10, true, false),
('bu-siti', 'keripik', 'Keripik Pisang Manis', 'Keripik pisang olahan lokal manis gurih khas Cikoneng Ciamis.', 18000, '[{"name":"Pouch 250g","price":18000},{"name":"Pouch 500g","price":34000}]'::jsonb, '🍌', 0, true, true),
('bu-ani', 'kue-kering', 'Nastar Keju Spesial', 'Kue nastar lembut isi selai nanas asli dengan taburan keju melimpah.', 45000, '[{"name":"Toples 300g","price":45000},{"name":"Toples 500g","price":75000}]'::jsonb, '🍪', 0, true, false),
('bu-ani', 'kue-kering', 'Kastengel Keju Edam', 'Kastengel gurih rangu dengan keju edam pilihan buatan rumah.', 50000, '[{"name":"Toples 300g","price":50000}]'::jsonb, '🧀', 15, true, true),
('bu-rina', 'manisan', 'Dodol Garut & Ciamis Mix', 'Dodol lembut bervariasi rasa (Wijen, Cokelat, Durian) olahan tradisional.', 25000, '[{"name":"Besek 500g","price":25000}]'::jsonb, '🍬', 0, true, false)
ON CONFLICT DO NOTHING;
