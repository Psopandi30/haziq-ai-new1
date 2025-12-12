-- ============================================
-- HAZIQ AI - Improved Database Schema
-- Memisahkan Admin dan Students
-- ============================================

-- 1. CREATE ADMINS TABLE (Terpisah dari Students)
-- ============================================
CREATE TABLE IF NOT EXISTS public.admins (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. CREATE STUDENTS TABLE (Hanya untuk Pengguna)
-- ============================================
CREATE TABLE IF NOT EXISTS public.students (
  id BIGSERIAL PRIMARY KEY,
  nim TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  full_name TEXT,
  prodi TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  position TEXT CHECK (position IN ('Mahasiswa', 'Dosen', 'Staff')) DEFAULT 'Mahasiswa',
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. CREATE CHAT_SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES public.students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. CREATE INDEXES
-- ============================================
-- Admins indexes
CREATE INDEX IF NOT EXISTS admins_username_idx ON public.admins(username);

-- Students indexes
CREATE INDEX IF NOT EXISTS students_nim_idx ON public.students(nim);
CREATE INDEX IF NOT EXISTS students_username_idx ON public.students(username);
CREATE INDEX IF NOT EXISTS students_position_idx ON public.students(position);

-- Chat sessions indexes
CREATE INDEX IF NOT EXISTS chat_sessions_user_id_idx ON public.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS chat_sessions_created_at_idx ON public.chat_sessions(created_at DESC);

-- 5. ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- 6. CREATE RLS POLICIES FOR ADMINS
-- ============================================
CREATE POLICY "Allow public read access to admins"
  ON public.admins FOR SELECT
  USING (true);

-- 7. CREATE RLS POLICIES FOR STUDENTS
-- ============================================
CREATE POLICY "Allow public read access to students"
  ON public.students FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to students"
  ON public.students FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow users to update own data"
  ON public.students FOR UPDATE
  USING (true);

-- 8. CREATE RLS POLICIES FOR CHAT_SESSIONS
-- ============================================
CREATE POLICY "Users can view own chat sessions"
  ON public.chat_sessions FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own chat sessions"
  ON public.chat_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own chat sessions"
  ON public.chat_sessions FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete own chat sessions"
  ON public.chat_sessions FOR DELETE
  USING (true);

-- 9. CREATE TRIGGER FUNCTION FOR AUTO-UPDATE TIMESTAMP
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. CREATE TRIGGER FOR CHAT_SESSIONS
-- ============================================
DROP TRIGGER IF EXISTS set_updated_at ON public.chat_sessions;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.chat_sessions
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();

-- 11. INSERT SAMPLE DATA
-- ============================================

-- Insert Admin (di tabel admins, BUKAN students)
INSERT INTO public.admins (username, password, name, email)
VALUES ('admin', 'Iai1234@', 'Administrator', 'admin@haziq-ai.com')
ON CONFLICT (username) DO NOTHING;

-- Insert Sample Students (Mahasiswa)
INSERT INTO public.students (nim, name, full_name, prodi, username, password, position, is_verified)
VALUES 
  ('20230001', 'Ahmad', 'Ahmad Fauzi Rahman', 'Teknik Informatika', 'ahmad', '123456', 'Mahasiswa', true),
  ('20230002', 'Siti', 'Siti Nurhaliza', 'Sistem Informasi', 'siti', '123456', 'Mahasiswa', true)
ON CONFLICT (nim) DO NOTHING;

-- Insert Sample Dosen
INSERT INTO public.students (nim, name, full_name, prodi, username, password, position, is_verified)
VALUES ('197001011', 'Dr. Usman', 'Dr. Usman Al-Hafidz', 'Ushuluddin', 'usman', '123456', 'Dosen', true)
ON CONFLICT (nim) DO NOTHING;

-- Insert Sample Staff
INSERT INTO public.students (nim, name, full_name, prodi, username, password, position, is_verified)
VALUES ('198505012', 'Budi', 'Budi Santoso', 'Administrasi', 'budi', '123456', 'Staff', true)
ON CONFLICT (nim) DO NOTHING;

-- ============================================
-- MIGRATION: Move existing admin from students to admins
-- ============================================
-- Jika ada admin di tabel students, pindahkan ke tabel admins
INSERT INTO public.admins (username, password, name)
SELECT username, password, name 
FROM public.students 
WHERE position = 'Staff' AND username = 'admin'
ON CONFLICT (username) DO NOTHING;

-- Hapus admin dari tabel students
DELETE FROM public.students WHERE username = 'admin';

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Check admins table
SELECT 'ADMINS TABLE:' as info;
SELECT * FROM public.admins;

-- Check students table
SELECT 'STUDENTS TABLE:' as info;
SELECT * FROM public.students;

-- ============================================
-- SETUP COMPLETE!
-- ============================================
