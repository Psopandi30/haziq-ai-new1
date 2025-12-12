# 🔧 Pemisahan Admin dan Students - Panduan Migrasi

## 📋 Perubahan yang Dilakukan

### **Sebelumnya (SALAH):**
- Admin disimpan di tabel `students` dengan `position = 'Staff'`
- Tidak ada pemisahan yang jelas antara admin dan pengguna

### **Sekarang (BENAR):**
- **Tabel `admins`** - Khusus untuk admin/pengelola sistem
- **Tabel `students`** - Khusus untuk pengguna (Mahasiswa, Dosen, Staff)

---

## 🚀 Langkah Migrasi

### **Step 1: Jalankan SQL Schema Baru**

1. **Buka Supabase Dashboard**
2. **Klik SQL Editor**
3. **Copy isi file:** `IMPROVED_SUPABASE_SCHEMA.sql`
4. **Paste & Run**

**SQL ini akan:**
- ✅ Membuat tabel `admins` baru
- ✅ Memindahkan admin dari `students` ke `admins`
- ✅ Menghapus admin dari tabel `students`
- ✅ Membuat sample data untuk testing

### **Step 2: Verifikasi Database**

Setelah run SQL, cek di **Table Editor**:

**Tabel `admins`:**
| id | username | password | name | email |
|----|----------|----------|------|-------|
| 1  | admin    | 123456   | Administrator | admin@haziq-ai.com |

**Tabel `students`:**
| id | nim | name | position | username |
|----|-----|------|----------|----------|
| 1  | 20230001 | Ahmad | Mahasiswa | ahmad |
| 2  | 20230002 | Siti | Mahasiswa | siti |
| 3  | 197001011 | Dr. Usman | Dosen | usman |
| 4  | 198505012 | Budi | Staff | budi |

**Pastikan:**
- ✅ Tabel `admins` ada dan berisi 1 admin
- ✅ Tabel `students` TIDAK ada user dengan username 'admin'
- ✅ Tabel `students` hanya berisi pengguna biasa

### **Step 3: Update Kode Aplikasi**

File yang sudah di-update:
- ✅ `components/AdminLogin.tsx` - Sekarang query dari tabel `admins`

**Tidak perlu edit manual**, file sudah di-update otomatis!

### **Step 4: Test di Localhost**

1. **Restart server:**
   ```bash
   npm run dev
   ```

2. **Test Admin Login:**
   - Klik **Admin**
   - Username: `admin`
   - Password: `123456`
   - ✅ Harus berhasil masuk

3. **Test User Login:**
   - Klik **Chat** → Login
   - Username: `ahmad`
   - Password: `123456`
   - ✅ Harus berhasil masuk

### **Step 5: Deploy ke Vercel**

1. **Commit & Push ke GitHub:**
   ```bash
   git add .
   git commit -m "Separate admin and students tables"
   git push origin main
   ```

2. **Vercel akan auto-deploy** (tunggu ~2-3 menit)

3. **Test di Production:**
   - https://haziq-ai-iai.vercel.app/
   - Test admin login
   - Test user login

---

## 📊 Struktur Database Baru

```
┌─────────────────┐
│     admins      │  ← Admin sistem (pengelola)
├─────────────────┤
│ id              │
│ username        │
│ password        │
│ name            │
│ email           │
│ created_at      │
└─────────────────┘

┌─────────────────┐
│    students     │  ← Pengguna (Mahasiswa/Dosen/Staff)
├─────────────────┤
│ id              │
│ nim             │
│ name            │
│ full_name       │
│ prodi           │
│ username        │
│ password        │
│ position        │  ← Mahasiswa / Dosen / Staff
│ is_verified     │
│ created_at      │
└─────────────────┘

┌─────────────────┐
│ chat_sessions   │  ← Riwayat chat pengguna
├─────────────────┤
│ id              │
│ user_id         │  ← FK ke students.id
│ title           │
│ messages        │
│ created_at      │
│ updated_at      │
└─────────────────┘
```

---

## ✅ Keuntungan Pemisahan

1. **Keamanan Lebih Baik:**
   - Admin dan user terpisah
   - Tidak bisa register sebagai admin dari form user

2. **Struktur Lebih Jelas:**
   - Admin = Pengelola sistem
   - Students = Pengguna aplikasi

3. **Mudah Dikembangkan:**
   - Bisa tambah fitur khusus admin (role, permissions, dll)
   - Bisa tambah field khusus students tanpa affect admin

---

## 🔐 Kredensial Default

### **Admin:**
- Username: `admin`
- Password: `Iai1234@`
- Akses: Admin Dashboard

### **Sample Users:**
- **Ahmad** (Mahasiswa): `ahmad` / `123456`
- **Siti** (Mahasiswa): `siti` / `123456`
- **Dr. Usman** (Dosen): `usman` / `123456`
- **Budi** (Staff): `budi` / `123456`

---

## 🆘 Troubleshooting

### **Error: "relation 'admins' does not exist"**
**Solusi:** Jalankan `IMPROVED_SUPABASE_SCHEMA.sql` di Supabase SQL Editor

### **Admin login gagal**
**Solusi:** 
1. Cek tabel `admins` di Supabase - pastikan ada user `admin`
2. Cek console browser (F12) untuk error detail

### **User login masih bisa akses admin**
**Solusi:** Clear browser cache & cookies, lalu refresh

---

**Setup selesai! Admin dan Students sudah terpisah dengan benar! 🎉**
