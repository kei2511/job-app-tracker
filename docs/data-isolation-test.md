/**
 * Panduan Testing Isolasi Data User
 * 
 * Untuk memastikan bahwa data antar akun terisolasi dengan benar:
 * 
 * 1. Pastikan setiap user login di browser/session yang berbeda:
 *    - Buka browser incognito/private untuk setiap user
 *    - Atau gunakan browser berbeda untuk setiap user
 *    - Jangan login ke akun berbeda di session yang sama
 * 
 * 2. Jalankan test verifikasi:
 *    - Buat data di akun 1
 *    - Login ke akun 2 dan verifikasi data tidak muncul
 *    - Gunakan endpoint /api/user untuk cek ID user aktif
 *    - Gunakan endpoint /api/applications untuk cek data yang terkait
 * 
 * 3. Verifikasi implementasi di backend:
 *    - Semua query ke database menggunakan filter userId
 *    - Update/delete hanya bisa dilakukan ke data milik user sendiri
 *    - Tidak ada celah untuk akses data user lain
 */

// Contoh pengujian isolasi data:
// 1. Login sebagai user1
// 2. Tambahkan beberapa aplikasi kerja
// 3. Cek dengan /api/applications - hanya data user1 yang muncul
// 4. Logout dan login sebagai user2
// 5. Tambahkan beberapa aplikasi kerja
// 6. Cek dengan /api/applications - hanya data user2 yang muncul
// 7. Coba akses aplikasi user1 dari user2 secara langsung - harus gagal
// 8. Cek endpoint /api/user - ID user berbeda untuk masing-masing user

export {};