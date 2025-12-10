import React, { useState } from 'react';
import { Menu, X, LogOut, Download, Shield } from 'lucide-react';

interface HeaderProps {
  onChatClick?: () => void;
  onDownloadClick?: () => void;
  onAdminClick?: () => void;
  variant?: 'default' | 'loggedIn' | 'admin';
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onChatClick = () => { },
  onDownloadClick = () => { },
  onAdminClick = () => { },
  variant = 'default',
  onMenuClick
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // --- Admin Header ---
  if (variant === 'admin') {
    return (
      <header className="w-full h-16 bg-white border-b border-gray-200 flex justify-between items-center px-6 shadow-sm z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0f4c3a] flex items-center justify-center text-white font-bold font-serif shadow-md">
            Hz
          </div>
          <div className="flex flex-col">
            <h1 className="text-[#0f4c3a] text-lg font-bold tracking-tight leading-none">Haziq AI</h1>
            <span className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">Admin Panel</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-semibold text-gray-700">Administrator</p>
            <p className="text-[10px] text-gray-400">Persis Garut</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
            <Shield className="w-4 h-4 text-[#0f4c3a]" />
          </div>
        </div>
      </header>
    );
  }

  // --- Logged In User Header ---
  if (variant === 'loggedIn') {
    return (
      <header className="w-full h-18 bg-white/80 backdrop-blur-md border-b border-gray-100 flex justify-between items-center px-4 md:px-8 z-50 sticky top-0 transition-all">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onChatClick}>
          <div className="relative group">
            {!logoError ? (
              <img
                src="/logo.png"
                alt="Haziq AI Logo"
                className="w-9 h-9 object-contain drop-shadow-sm group-hover:scale-110 transition-transform"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="w-9 h-9 bg-gradient-to-br from-[#0f4c3a] to-[#1e7e62] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-[#0f4c3a]/30 transition-shadow">
                <span className="text-white font-serif font-bold text-xs">Hz</span>
              </div>
            )}
          </div>
          <h1 className="text-[#0f4c3a] text-lg font-bold tracking-tight hidden sm:block">Haziq AI</h1>
        </div>

        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors group border border-transparent hover:border-gray-200"
        >
          <div className="flex flex-col gap-1.5 items-end">
            <span className="w-6 h-0.5 bg-[#0f4c3a] rounded-full group-hover:w-5 transition-all"></span>
            <span className="w-4 h-0.5 bg-[#0f4c3a] rounded-full group-hover:w-6 transition-all"></span>
          </div>
        </button>
      </header>
    );
  }

  // --- Default Header (Landing) ---
  return (
    <header className="w-full py-4 px-4 md:px-12 flex justify-between items-center bg-white/60 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50">

      {/* Brand */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={onChatClick}>
        <div className="relative">
          {!logoError ? (
            <img
              src="/logo.png"
              alt="Haziq AI Logo"
              className="w-10 h-10 md:w-12 md:h-12 object-contain"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="w-10 h-10 md:w-11 md:h-11 bg-[#0f4c3a] rounded-xl flex items-center justify-center shadow-lg shadow-[#0f4c3a]/20">
              <span className="text-white font-serif font-bold italic text-lg">Hz</span>
            </div>
          )}
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-[#0f4c3a] tracking-tight leading-none">Haziq AI</h1>
          <span className="text-[10px] md:text-xs text-gray-500 font-medium tracking-wide">Academic Assistant</span>
        </div>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-2 bg-gray-50/50 p-1.5 rounded-full border border-gray-100 shadow-sm">
        <button
          onClick={onChatClick}
          className="px-6 py-2 text-sm font-semibold text-[#0f4c3a] bg-white rounded-full shadow-sm border border-gray-100 transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Chat
        </button>
        <button
          onClick={onDownloadClick}
          className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-[#0f4c3a] rounded-full hover:bg-white/50 transition-colors"
        >
          Download
        </button>
        <button
          onClick={onAdminClick}
          className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-[#0f4c3a] transition-colors"
        >
          Admin
        </button>
      </nav>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full right-0 left-0 p-4 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-xl md:hidden animate-in slide-in-from-top-5 z-40">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => { onChatClick(); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-3 w-full p-4 bg-[#0f4c3a]/5 rounded-xl text-[#0f4c3a] font-semibold"
            >
              Haziq Chat
            </button>
            <button
              onClick={() => { onDownloadClick(); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-3 w-full p-4 hover:bg-gray-50 rounded-xl text-gray-700 font-medium transition-colors"
            >
              <Download size={18} />
              Download Aplikasi
            </button>
            <button
              onClick={() => { onAdminClick(); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-3 w-full p-4 hover:bg-gray-50 rounded-xl text-gray-700 font-medium transition-colors"
            >
              <Shield size={18} />
              Admin Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
};