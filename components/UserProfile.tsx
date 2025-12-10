import React from 'react';
import { UserData } from '../types';

interface UserProfileProps {
  onLogout: () => void;
  onBack: () => void;
  user: UserData | null;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onLogout, onBack, user }) => {
  // Calculate initials
  const getInitials = (name: string) => {
    if (!name) return 'NP';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#e5e5e5] w-full min-h-[calc(100vh-64px)] animate-in fade-in duration-500">
      
      {/* Avatar Circle */}
      <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-[#0f4c3a] flex items-center justify-center shadow-2xl mb-8 transform hover:scale-105 transition-transform duration-300">
        <span className="text-white text-5xl md:text-6xl font-bold tracking-wider">
          {getInitials(user?.name || '')}
        </span>
      </div>

      {/* User Info */}
      <div className="text-center space-y-4 mb-10">
        <div className="space-y-1">
          <h2 className="text-[#0f4c3a] text-3xl md:text-4xl font-medium tracking-tight">
            {user?.name || 'Nama Pengguna'}
          </h2>
          <p className="text-[#2d6a58] text-lg md:text-xl font-medium">
            {user?.nim || 'NIM/NID/NIDN'}
          </p>
        </div>
        
        <div className="pt-2">
           <p className="text-[#0f4c3a] text-xl md:text-2xl font-medium">
            {user?.prodi || 'Program Study'}
          </p>
        </div>
      </div>

      {/* Logout Button */}
      <button 
        onClick={onLogout}
        className="w-48 py-3 bg-[#9ca3af] border-[3px] border-[#0f4c3a] rounded-lg text-white font-bold text-lg hover:bg-[#888f9b] hover:shadow-lg active:scale-95 transition-all duration-200"
      >
        Log Out
      </button>

      {/* Back Button */}
      <button 
        onClick={onBack}
        className="mt-6 text-[#5f6b7c] text-sm underline underline-offset-4 hover:text-[#0f4c3a] transition-colors"
      >
        Kembali
      </button>

    </div>
  );
};