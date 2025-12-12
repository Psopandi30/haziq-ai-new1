# Panduan Publish ke GitHub Pages

Berikut adalah langkah-langkah untuk mempublikasikan aplikasi Haziq AI ke GitHub Pages:

## 1. Persiapan GitHub Repository
Pastikan Anda sudah memiliki repository kosong di GitHub.
1. Buka [GitHub.com](https://github.com/new).
2. Buat repository baru (misal: `haziq-ai-web`).
3. Jangan centang "Initialize with README".

## 2. Hubungkan Project ke Repository
Jika belum terhubung (cek dengan `git remote -v`), jalankan perintah ini di terminal:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME_ANDA/NAMA_REPO.git
git push -u origin main
```
*(Ganti USERNAME_ANDA dan NAMA_REPO sesuai milik Anda)*

## 3. Konfigurasi `vite.config.ts`
Buka file `vite.config.ts` dan tambahkan properti `base` yang sesuai dengan nama repository Anda.

Contoh jika nama repo adalah `haziq-ai-web`:
```typescript
export default defineConfig(({ mode }) => {
    // ... kode yang sudah ada ...
    return {
      base: '/haziq-ai-web/', // <--- Tambahkan baris ini (sesuai nama repo, diawali dan diakhiri slash)
      server: {
        // ...
      },
      // ...
    };
});
```
**PENTING:** Jika nama repo Anda sama dengan username (misal `fatih.github.io`), maka tidak perlu menambahkan `base` (atau set `base: '/'`).

## 4. Jalankan Deploy
Setelah konfigurasi selesai, jalankan perintah ini:

```bash
npm run deploy
```

Perintah ini akan otomatis:
1. Membangun aplikasi (`npm run build`).
2. Mengupload folder `dist` ke branch `gh-pages`.

## 5. Cek Hasil
1. Buka repository Anda di GitHub.
2. Masuk ke **Settings** > **Pages**.
3. Pastikan **Source** di-set ke `Deploy from a branch` dan pilih branch `gh-pages`.
4. Tunggu beberapa menit, link website Anda akan muncul di sana (misal: `https://username.github.io/haziq-ai-web/`).
