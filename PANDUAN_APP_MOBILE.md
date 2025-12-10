# Panduan Installasi Android & iOS (Haziq AI)

Aplikasi Haziq AI sekarang sudah dikonfigurasi menggunakan **Capacitor** untuk dikonversi menjadi aplikasi Native (Android .apk dan iOS .ipa).

## Prasyarat
Untuk membuat file APK atau IPA, Anda memerlukan tools berikut di komputer Anda:
1.  **Android Studio** (untuk build Android) - [Download](https://developer.android.com/studio)
2.  **Xcode** (untuk build iOS) - *Hanya tersedia di macOS*.

---

## 🚀 Cara Build Aplikasi Android (APK)

1.  **Sync Kode Terbaru**
    Setiap kali Anda mengubah kode React/Web, jalankan perintah ini di terminal:
    ```bash
    npm run cap:sync
    ```
    Perintah ini akan membuild project web (ke folder `dist`) dan menyalinnya ke folder native `android`.

2.  **Buka Android Studio**
    Jalankan perintah ini untuk membuka project Android secara otomatis:
    ```bash
    npm run cap:open:android
    ```
    (Atau buka manual folder `android` menggunakan Android Studio).

3.  **Generate APK**
    Di Android Studio:
    *   Tunggu hingga proses "Gradle Sync" selesai (lihat status bar di bawah).
    *   Klik menu **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
    *   Tunggu proses selesai. Notifikasi akan muncul di pojok kanan bawah.
    *   Klik **locate** pada notifikasi untuk menemukan file `.apk` Anda (biasanya di `android/app/build/outputs/apk/debug/app-debug.apk`).

4.  **Install di HP**
    Kirim file `.apk` tersebut ke HP Android Anda dan instal.

---

## 🍎 Cara Build Aplikasi iOS

*Catatan: Anda wajib menggunakan Mac untuk build iOS.*

1.  **Sync Kode**
    ```bash
    npm run cap:sync
    ```

2.  **Add Platform iOS (Pertama kali saja)**
    ```bash
    npx cap add ios
    ```

3.  **Buka Xcode**
    ```bash
    npm run cap:open:ios
    ```

4.  **Run / Archive**
    *   Pilih simulator atau device fisik Anda di bagian atas.
    *   Klik tombol **Play (Run)** untuk testing.
    *   Untuk membuat production build, gunakan menu **Product** > **Archive**.

---

## 💡 Troubleshooting

*   **Error "JAVA_HOME"**: Pastikan Java/JDK sudah terinstal dan path-nya benar.
*   **Error Gradle**: Pastikan koneksi internet stabil saat pertama kali membuka Android Studio karena akan mendownload dependency Gradle yang cukup besar.
*   **Update Icon & Splash Screen**: Anda bisa menggunakan library `@capacitor/assets` untuk mengubah icon aplikasi secara otomatis.
