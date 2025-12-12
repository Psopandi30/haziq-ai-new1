import React, { useState } from 'react';
import { X, User, Lock, GraduationCap, ChevronRight, Briefcase } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (nim: string, password: string) => void;
  onRegister: (data: any) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin, onRegister }) => {
  const [isRegistering, setIsRegistering] = useState(false);

  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');

  const [name, setName] = useState('');
  const [fullName, setFullName] = useState('');
  const [prodi, setProdi] = useState('');
  const [username, setUsername] = useState('');
  const [position, setPosition] = useState<'Mahasiswa' | 'Dosen' | 'Staff'>('Mahasiswa');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      onRegister({ nim, password, name, full_name: fullName, prodi, username, position });
      setIsRegistering(false);
    } else {
      onLogin(nim, password);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-[2rem] w-full max-w-sm p-8 relative z-10 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-2 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="mb-8 mt-2">
          <h2 className="text-slate-800 text-3xl font-bold tracking-tight mb-2">
            {isRegistering ? 'Buat Akun' : 'Selamat Datang'}
          </h2>
          <p className="text-slate-500 text-sm">
            {isRegistering ? 'Lengkapi data untuk akses penuh.' : 'Masuk untuk melanjutkan ke Haziq AI.'}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>

          {isRegistering && (
            <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#0f4c3a] transition-colors" />
                <input
                  type="text"
                  placeholder="Nama Panggilan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#0f4c3a]/10 focus:bg-white text-slate-700 font-medium placeholder-slate-400 transition-all outline-none"
                />
              </div>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#0f4c3a] transition-colors" />
                <input
                  type="text"
                  placeholder="Nama Lengkap Sesuai KTP"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#0f4c3a]/10 focus:bg-white text-slate-700 font-medium placeholder-slate-400 transition-all outline-none"
                />
              </div>
            </div>
          )}

          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#0f4c3a] transition-colors" />
            <input
              type="text"
              placeholder="NIM / NID / NIDN"
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              required
              className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#0f4c3a]/10 focus:bg-white text-slate-700 font-medium placeholder-slate-400 transition-all outline-none"
            />
          </div>

          {isRegistering && (
            <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
              <div className="relative group">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#0f4c3a] transition-colors" />
                <input
                  type="text"
                  placeholder="Fakultas / Prodi"
                  value={prodi}
                  onChange={(e) => setProdi(e.target.value)}
                  required
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#0f4c3a]/10 focus:bg-white text-slate-700 font-medium placeholder-slate-400 transition-all outline-none"
                />
              </div>
              <div className="relative group">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#0f4c3a] transition-colors" />
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value as 'Mahasiswa' | 'Dosen' | 'Staff')}
                  required
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#0f4c3a]/10 focus:bg-white text-slate-700 font-medium transition-all outline-none appearance-none"
                >
                  <option value="Mahasiswa">Mahasiswa</option>
                  <option value="Dosen">Dosen</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#0f4c3a] transition-colors" />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#0f4c3a]/10 focus:bg-white text-slate-700 font-medium placeholder-slate-400 transition-all outline-none"
                />
              </div>
            </div>
          )}

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#0f4c3a] transition-colors" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#0f4c3a]/10 focus:bg-white text-slate-700 font-medium placeholder-slate-400 transition-all outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 flex justify-between items-center py-4 px-6 rounded-2xl shadow-lg shadow-[#0f4c3a]/20 text-white bg-[#0f4c3a] hover:bg-[#165946] hover:scale-[1.02] transition-all active:scale-[0.98] group"
          >
            <span className="font-bold">{isRegistering ? 'Daftar Sekarang' : 'Masuk Akun'}</span>
            <div className="bg-white/20 rounded-full p-1 group-hover:bg-white/30 transition-colors">
              <ChevronRight size={18} />
            </div>
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            {isRegistering ? 'Sudah memiliki akun? ' : 'Belum memiliki akun? '}
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="font-bold text-[#0f4c3a] hover:underline decoration-2 underline-offset-4 transition-all"
            >
              {isRegistering ? 'Login' : 'Daftar'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};