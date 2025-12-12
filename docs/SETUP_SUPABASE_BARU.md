# 🚀 Setup Supabase Baru - Panduan Lengkap

## Informasi Supabase Baru
- **URL:** https://gvvwmpkxtkuvycbpcknc.supabase.co
- **Status:** Project baru (belum ada data)

---

## 📋 LANGKAH 1: Dapatkan API Keys

1. **Buka Supabase Dashboard:**
   - URL: https://gvvwmpkxtkuvycbpcknc.supabase.co
   - Login dengan akun Anda

2. **Klik Settings (⚙️) di sidebar kiri**

3. **Klik "API" di menu Settings**

4. **Copy 2 keys berikut:**
   - ✅ **Project URL:** `https://gvvwmpkxtkuvycbpcknc.supabase.co` (sudah benar)
   - ✅ **anon/public key:** Copy key yang panjang (contoh: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

---

## 📋 LANGKAH 2: Update Environment Variables

1. **Buka file:** `.env.local` (di root project)

2. **Paste ANON KEY yang sudah di-copy:**
   ```env
   VITE_SUPABASE_URL=https://gvvwmpkxtkuvycbpcknc.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey... (paste key Anda)
   ```

3. **Save file**

---

## 📋 LANGKAH 3: Setup Database Schema

1. **Kembali ke Supabase Dashboard**

2. **Klik "SQL Editor" di sidebar kiri**

3. **Klik "New Query"**

4. **Buka file:** `COMPLETE_SUPABASE_SCHEMA.sql`

5. **Copy SEMUA isi file** (Ctrl+A → Ctrl+C)

6. **Paste di SQL Editor** Supabase

7. **Klik "Run"** (atau tekan F5)

8. **Tunggu hingga selesai** (akan muncul "Success" di bawah)

---

## 📋 LANGKAH 4: Verifikasi Database

1. **Klik "Table Editor"** di sidebar Supabase

2. **Pastikan ada 2 tabel:**
   - ✅ `students` (dengan kolom: id, nim, name, full_name, prodi, username, password, position, is_verified, created_at)
   - ✅ `chat_sessions` (dengan kolom: id, user_id, title, messages, created_at, updated_at)

3. **Klik tabel `students`**
   - Seharusnya ada **3 sample data:**
     - Admin (Staff)
     - Ahmad (Mahasiswa)
     - Dr. Usman (Dosen)

---

## 📋 LANGKAH 5: Restart Development Server

1. **Stop server** yang sedang running (Ctrl+C di terminal)

2. **Restart server:**
   ```bash
   npm run dev
   ```

3. **Buka browser:** http://localhost:5173 (atau port yang muncul)

---

## 📋 LANGKAH 6: Test Aplikasi

### Test Login:
- **Username:** `admin`
- **Password:** `123456`

### Test Register:
- Buat akun baru
- Cek di Supabase Table Editor → students → Seharusnya muncul user baru

### Test Chat:
- Login → Kirim pesan
- Cek di Supabase Table Editor → chat_sessions → Seharusnya ada riwayat chat

---

## ✅ Checklist Setup

- [ ] Dapatkan ANON KEY dari Supabase
- [ ] Update `.env.local` dengan ANON KEY
- [ ] Jalankan `COMPLETE_SUPABASE_SCHEMA.sql` di SQL Editor
- [ ] Verifikasi 2 tabel sudah dibuat
- [ ] Verifikasi 3 sample user sudah ada
- [ ] Restart development server
- [ ] Test login dengan user `admin`
- [ ] Test register user baru
- [ ] Test kirim chat & cek riwayat

---

## 🔒 PENTING - Keamanan

1. **JANGAN commit `.env.local` ke Git!**
   - File ini sudah ada di `.gitignore`
   - Berisi API keys yang sensitif

2. **Untuk production (Vercel):**
   - Tambahkan environment variables di Vercel Dashboard
   - Settings → Environment Variables
   - Add: `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`

---

## 🆘 Troubleshooting

### Error: "Invalid API key"
- Pastikan ANON KEY sudah benar di `.env.local`
- Restart server setelah update `.env.local`

### Error: "Table does not exist"
- Jalankan ulang `COMPLETE_SUPABASE_SCHEMA.sql`
- Pastikan tidak ada error saat run SQL

### Error: "RLS policy violation"
- Cek apakah RLS policies sudah dibuat
- Lihat di Supabase → Authentication → Policies

---

## 📞 Butuh Bantuan?

Jika ada error, screenshot dan tunjukkan:
1. Error message
2. Browser console (F12 → Console)
3. Supabase Table Editor (untuk cek data)

---

**Setup selesai! Aplikasi siap digunakan dengan Supabase baru! 🎉**
