import React from 'react';
import { UserData } from '../types';
import { LogOut, ArrowLeft, User, BookOpen, GraduationCap } from 'lucide-react';

interface UserProfileProps {
  onLogout: () => void;
  onBack: () => void;
  user: UserData | null;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onLogout, onBack, user }) => {
  const getInitials = (name: string) => {
    if (!name) return 'NP';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 w-full min-h-[calc(100vh-64px)] relative overflow-hidden py-8">

      {/* Animated Background Blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#0f4c3a]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Back Button - Top Left */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:text-[#0f4c3a] bg-white/60 backdrop-blur-md rounded-xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Kembali</span>
      </button>

      {/* Main Profile Card */}
      <div className="relative z-10 w-full max-w-sm mx-4 animate-in fade-in slide-in-from-bottom-8 duration-700">

        {/* Glass Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 space-y-5">

          {/* Avatar with Gradient Ring */}
          <div className="flex justify-center -mt-16 mb-2">
            <div className="relative">
              {/* Gradient Ring */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0f4c3a] via-emerald-500 to-emerald-300 rounded-full blur-md opacity-75 animate-pulse"></div>
              {/* Avatar */}
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-[#0f4c3a] to-emerald-600 flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-white">
                <span className="text-white text-3xl md:text-4xl font-bold tracking-wider">
                  {getInitials(user?.name || '')}
                </span>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="text-center space-y-2">
            <h2 className="text-slate-800 text-xl md:text-2xl font-bold tracking-tight">
              {user?.name || 'Nama Pengguna'}
            </h2>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-emerald-700 text-xs font-semibold">Akun Aktif</span>
            </div>
          </div>

          {/* Info Cards */}
          <div className="space-y-2.5">
            {/* NIM Card */}
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-slate-50 to-emerald-50/50 rounded-xl border border-slate-100 hover:shadow-md transition-all duration-300 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0f4c3a] to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <User size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-slate-500 font-medium mb-0.5">NIM / Identitas</p>
                <p className="text-slate-800 font-bold text-base">{user?.nim || '-'}</p>
              </div>
            </div>

            {/* Program Studi Card */}
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-slate-50 to-emerald-50/50 rounded-xl border border-slate-100 hover:shadow-md transition-all duration-300 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <GraduationCap size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-slate-500 font-medium mb-0.5">Program Studi</p>
                <p className="text-slate-800 font-bold text-sm">{user?.prodi || 'Belum diisi'}</p>
              </div>
            </div>

            {/* Username Card */}
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-slate-50 to-emerald-50/50 rounded-xl border border-slate-100 hover:shadow-md transition-all duration-300 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <BookOpen size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-slate-500 font-medium mb-0.5">Username</p>
                <p className="text-slate-800 font-bold text-sm">{user?.username || '-'}</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-base rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
            <span>Keluar dari Akun</span>
          </button>

          {/* Footer Info */}
          <div className="pt-3 border-t border-slate-200">
            <p className="text-center text-[10px] text-slate-500">
              Terdaftar sebagai <span className="font-semibold text-emerald-600">Mahasiswa</span>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};