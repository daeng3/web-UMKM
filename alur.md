# Alur Kerja (Workflow) Aplikasi Cemilan Ciamis

Dokumen ini menjelaskan alur kerja dari aplikasi katalog dan pemesanan Cemilan Ciamis, baik dari sisi pengguna (pembeli) maupun dari sisi pengelola (Admin/Penjual).

## 1. Alur Pengguna (Pembeli)

Aplikasi ini didesain sebagai katalog online yang memudahkan pembeli untuk melihat produk dan langsung memesan ke pengrajin/penjual melalui WhatsApp.

1. **Melihat Katalog (Eksplorasi)**
   - Pembeli mengunjungi halaman utama (`index.html`) untuk melihat produk unggulan, kategori, dan daftar penjual.
   - Pembeli dapat melihat daftar lengkap produk di halaman Produk (`produk.html`), melakukan pencarian, atau memfilter berdasarkan kategori.
   - Pembeli juga dapat melihat profil spesifik penjual beserta produk yang mereka jual di halaman Penjual (`penjual.html`).

2. **Melihat Detail & Memilih Produk**
   - Saat pembeli mengklik sebuah produk, mereka akan diarahkan ke halaman Detail Produk (`detail-produk.html`).
   - Di sini, pembeli dapat melihat deskripsi, harga, dan memilih variasi produk (jika ada, misalnya ukuran kemasan atau rasa).
   - Pembeli memiliki dua pilihan:
     - **"Masukkan Keranjang"**: Menyimpan produk sementara jika ingin membeli produk lain dari penjual yang sama atau penjual berbeda.
     - **"Pesan via WhatsApp" (Beli Langsung)**: Mengabaikan keranjang dan langsung diarahkan ke aplikasi WhatsApp penjual dengan format pesanan yang sudah dibuat otomatis.

3. **Mengelola Keranjang Belanja**
   - Jika pembeli memasukkan ke keranjang, data keranjang disimpan di penyimpanan lokal browser (`localStorage`).
   - Karena ini adalah platform multi-penjual, keranjang belanja secara otomatis **dikelompokkan berdasarkan penjual**. Pembeli tidak bisa menggabungkan checkout dari dua penjual yang berbeda dalam satu pesan WhatsApp.

4. **Checkout (Kirim Pesanan)**
   - Pembeli membuka keranjang belanja.
   - Pembeli mengklik tombol **"Kirim Pesanan via WhatsApp"** pada kelompok pesanan penjual tertentu.
   - Sistem (`js/cart.js`) akan menggenerate teks pesanan (berisi detail barang, variasi, jumlah, dan total harga).
   - Pembeli diarahkan ke link `wa.me/nomor_penjual` untuk mengirim pesan tersebut secara langsung. Transaksi, pembayaran, dan pengiriman diselesaikan secara manual di luar aplikasi via WhatsApp.

---

## 2. Alur Pengelola (Admin & Penjual)

Aplikasi ini memiliki sistem panel admin (`/admin`) dengan dua level akses: **Super Admin** dan **Penjual (Seller)**.

1. **Login System**
   - Pengelola masuk melalui halaman Login (`admin/login.html`) menggunakan username dan password.
   - Sistem akan memverifikasi data pengguna dari database/lokal storage dan mengarahkan ke dashboard (`admin/dashboard.html`).

2. **Alur Super Admin (Pengelola Paguyuban)**
   - **Tugas Utama**: Mengelola keanggotaan penjual.
   - Super Admin dapat mengakses menu **"Kelola Penjual"** (`admin/kelola-penjual.html`).
   - Di halaman ini, Super Admin bisa **menambahkan penjual baru**, mengatur password awal, serta mengedit atau menghapus akun penjual yang melanggar aturan/tidak aktif.

3. **Alur Penjual (Seller)**
   - **Tugas Utama**: Mengelola produk toko sendiri.
   - **Dashboard**: Penjual dapat melihat ringkasan tokonya (jumlah produk yang tayang).
   - **Kelola Produk**: Penjual mengakses menu Produk (`admin/produk.html`) untuk melihat daftar produk miliknya. Mereka dapat:
     - Menambah produk baru (`admin/tambah-produk.html`) termasuk mengunggah gambar, menentukan harga, stok (jika ada), kategori, dan variasi.
     - Mengedit data produk yang sudah ada.
     - Menghapus produk.
   - **Profil Toko**: Penjual mengakses menu Profil (`admin/profil.html`) untuk memperbarui informasi toko, seperti Nama Toko, Bio/Deskripsi, dan yang terpenting **Nomor WhatsApp**. Nomor WhatsApp ini krusial karena semua pesanan akan masuk ke nomor tersebut.

---

## 3. Alur Penyimpanan Data (Arsitektur Saat Ini)

Saat ini, aplikasi berjalan tanpa backend server khusus (Frontend-only).
- **Database Sementara**: Data produk, kategori, dan user/seller diinisialisasi melalui file `js/data.js`.
- **State Management**: Perubahan data (seperti menambah produk oleh seller, menambah ke keranjang) disimpan di dalam **`localStorage`** browser klien.
- **Rencana Mendatang**: Berdasarkan catatan pada source code, data di `localStorage` ini direncanakan akan dipindahkan menggunakan **Firebase Firestore** agar data tersinkronisasi secara real-time dan terpusat di cloud, sehingga aplikasi dapat diakses dari berbagai perangkat dengan data yang sama.
