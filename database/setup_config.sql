-- Membuat tabel konfigurasi aplikasi
CREATE TABLE IF NOT EXISTS app_config (
  id BIGINT PRIMARY KEY DEFAULT 1,
  description TEXT,
  download_link TEXT,
  webhook_url TEXT,
  gemini_api_keys TEXT, -- New: Comma separated keys
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mengisi data default (hanya jika belum ada)
INSERT INTO app_config (id, description, download_link, webhook_url, gemini_api_keys)
VALUES (
  1, 
  'Haziq AI adalah asisten cerdas yang dirancang khusus untuk mahasiswa Institut Agama Islam Persis Garut. Aplikasi ini membantu dalam penyusunan jurnal, pencarian referensi akademik, serta studi Al-Quran dan Hadits.', 
  '#', 
  'https://n8n.example.com/webhook/YOUR-WEBHOOK-ID',
  ''
) ON CONFLICT (id) DO UPDATE SET 
  gemini_api_keys = EXCLUDED.gemini_api_keys;

-- Mengatur policy keamanan (RLS) agar bisa dibaca dan diedit
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

-- Izinkan baca (public)
DROP POLICY IF EXISTS "Public Read Access" ON app_config;
CREATE POLICY "Public Read Access" ON app_config FOR SELECT USING (true);

-- Izinkan update (public - untuk admin panel)
DROP POLICY IF EXISTS "Public Update Access" ON app_config;
CREATE POLICY "Public Update Access" ON app_config FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public Insert Access" ON app_config;
CREATE POLICY "Public Insert Access" ON app_config FOR INSERT WITH CHECK (true);

-- Update strutur table jika sudah ada
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'app_config' AND column_name = 'gemini_api_keys') THEN 
        ALTER TABLE app_config ADD COLUMN gemini_api_keys TEXT; 
    END IF; 
END $$;
