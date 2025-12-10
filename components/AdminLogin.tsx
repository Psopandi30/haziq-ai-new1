import React, { useState } from 'react';
import { ArrowRight, Lock, User, ShieldCheck } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

import { supabase } from '../services/supabaseClient';

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Authenticate Admin using Supabase
    const { data, error } = await supabase.from('admins').select('*').eq('username', username).eq('password', password).single();

    setLoading(false);
    if (data) {
      onLogin();
    } else {
      setError('Kredensial tidak valid.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col md:flex-row h-screen w-full overflow-hidden">

      {/* Left Side - Brand / Visual */}
      <div className="w-full md:w-1/2 bg-[#0f4c3a] relative flex items-center justify-center p-12 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>

        <div className="relative z-10 text-center md:text-left text-white max-w-lg">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 mb-8 shadow-2xl mx-auto md:mx-0">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Admin Portal</h1>
          <p className="text-emerald-100 text-lg md:text-xl leading-relaxed font-light">
            Kelola data pengguna dan konfigurasi Haziq AI Institut Agama Islam Persis Garut dengan aman dan efisien.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md animate-in slide-in-from-right-10 duration-700">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang</h2>
            <p className="text-gray-500">Silakan masuk untuk mengakses dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-[#0f4c3a] transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0f4c3a]/20 focus:border-[#0f4c3a] transition-all outline-none"
                    placeholder="Masukan username admin"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#0f4c3a] transition-colors" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0f4c3a]/20 focus:border-[#0f4c3a] transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0f4c3a] hover:bg-[#165946] text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl shadow-[#0f4c3a]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? 'Memproses...' : 'Masuk Dashboard'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Haziq AI System
          </p>
        </div>
      </div>
    </div>
  );
};