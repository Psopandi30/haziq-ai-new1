-- Membuat tabel konfigurasi aplikasi
CREATE TABLE IF NOT EXISTS app_config (
  id BIGINT PRIMARY KEY DEFAULT 1,
  description TEXT,
  download_link TEXT,
  webhook_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mengisi data default (hanya jika belum ada)
INSERT INTO app_config (id, description, download_link, webhook_url)
VALUES (
  1, 
  'Haziq AI adalah asisten cerdas yang dirancang khusus untuk mahasiswa Institut Agama Islam Persis Garut. Aplikasi ini membantu dalam penyusunan jurnal, pencarian referensi akademik, serta studi Al-Quran dan Hadits.', 
  '#', 
  'https://n8n.wasm123.com/webhook/f0a5c9e9-3c4d-4e3a-8f7b-2d1e6a9c4b8f'
) ON CONFLICT (id) DO NOTHING;

-- Mengatur policy keamanan (RLS) agar bisa dibaca dan diedit
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

-- Izinkan baca (public)
CREATE POLICY "Public Read Access" ON app_config FOR SELECT USING (true);

-- Izinkan update (public - untuk admin panel)
CREATE POLICY "Public Update Access" ON app_config FOR UPDATE USING (true);
CREATE POLICY "Public Insert Access" ON app_config FOR INSERT WITH CHECK (true);
