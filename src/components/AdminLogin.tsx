import React, { useState } from 'react';
import { Shield, Lock, User } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface AdminLoginProps {
  onLogin: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Query dari tabel admins (BUKAN students)
      const { data, error: queryError } = await supabase
        .from('admins')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .maybeSingle();

      if (queryError) {
        console.error('Query error:', queryError);
        setError('Terjadi kesalahan sistem.');
        setIsLoading(false);
        return;
      }

      if (data) {
        // Login berhasil
        onLogin();
      } else {
        setError('Kredensial tidak valid.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 px-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-10 space-y-8">

          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0f4c3a] to-emerald-600 shadow-lg">
              <Shield size={40} className="text-white" />
            </div>
            <div>
              <h2 className="text-slate-800 text-3xl font-bold tracking-tight">Admin Portal</h2>
              <p className="text-slate-500 text-sm mt-2">Kelola data pengguna dan konfigurasi Haziq AI Institut Agama Islam Persis Garut dengan aman dan efisien.</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#0f4c3a] transition-colors" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#0f4c3a]/20 focus:bg-white text-slate-700 font-medium placeholder-slate-400 transition-all outline-none"
                  placeholder="admin"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#0f4c3a] transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#0f4c3a]/20 focus:bg-white text-slate-700 font-medium placeholder-slate-400 transition-all outline-none"
                  placeholder="••••••"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                ⚠️ {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-gradient-to-r from-[#0f4c3a] to-emerald-600 hover:from-[#165946] hover:to-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-[#0f4c3a]/30 hover:shadow-xl hover:shadow-[#0f4c3a]/40 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <Shield size={20} />
                  <span>Masuk Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-500">
              © 2025 Haziq AI System
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};