import React, { useState } from 'react';
import { Download, Smartphone, Chrome, Share2, PlusSquare, CheckCircle } from 'lucide-react';
import { AppConfig } from '../types';

interface DownloadApkProps {
  config: AppConfig;
}

export const DownloadApk: React.FC<DownloadApkProps> = ({ config }) => {
  const [activeTab, setActiveTab] = useState<'pwa' | 'apk'>('pwa');

  return (
    <div className="flex-1 flex flex-col items-center justify-start w-full max-w-5xl mx-auto px-4 mt-8 md:mt-12 mb-16 animate-in fade-in duration-500">

      <div className="text-center mb-10">
        <h2 className="text-[#0f4c3a] text-xl md:text-3xl font-light tracking-wide">
          Bismillahirrahmanirrahim
        </h2>
      </div>

      {/* Modern Card for Description */}
      <div className="w-full bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 mb-10 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#0f4c3a]"></div>

        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="p-4 bg-[#ecfccb] rounded-2xl flex-shrink-0">
            <Smartphone className="w-10 h-10 text-[#0f4c3a]" />
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-medium text-[#0f4c3a]">Haziq AI Mobile App</h3>
            <p className="text-gray-600 text-lg leading-relaxed font-light">
              {config.description || "Deskripsi aplikasi belum tersedia."}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="w-full bg-slate-100 rounded-2xl p-2 mb-8 flex gap-2">
        <button
          onClick={() => setActiveTab('pwa')}
          className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${activeTab === 'pwa'
              ? 'bg-white text-[#0f4c3a] shadow-md'
              : 'text-slate-500 hover:text-slate-700'
            }`}
        >
          📱 Install PWA (Rekomendasi)
        </button>
        <button
          onClick={() => setActiveTab('apk')}
          className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${activeTab === 'apk'
              ? 'bg-white text-[#0f4c3a] shadow-md'
              : 'text-slate-500 hover:text-slate-700'
            }`}
        >
          📦 Download APK
        </button>
      </div>

      {/* PWA Instructions */}
      {activeTab === 'pwa' && (
        <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* Benefits */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border-2 border-emerald-200">
            <h4 className="font-bold text-lg text-emerald-800 mb-4 flex items-center gap-2">
              <CheckCircle size={24} className="text-emerald-600" />
              Keuntungan Install PWA
            </h4>
            <ul className="space-y-2 text-emerald-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Tidak perlu download file APK (hemat kuota)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Update otomatis tanpa install ulang</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Ukuran lebih kecil & lebih cepat</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Bisa diakses offline</span>
              </li>
            </ul>
          </div>

          {/* Android Instructions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Chrome size={24} className="text-green-600" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-slate-800">Untuk Android (Chrome)</h4>
                <p className="text-sm text-slate-500">Ikuti langkah berikut:</p>
              </div>
            </div>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0f4c3a] text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <p className="font-semibold text-slate-800">Tap menu ⋮ di pojok kanan atas browser</p>
                  <p className="text-sm text-slate-600 mt-1">Atau tunggu popup install muncul otomatis</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0f4c3a] text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <p className="font-semibold text-slate-800">Pilih "Add to Home screen" atau "Install app"</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0f4c3a] text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <p className="font-semibold text-slate-800">Tap "Add" atau "Install"</p>
                  <p className="text-sm text-slate-600 mt-1">Aplikasi akan muncul di home screen Anda</p>
                </div>
              </li>
            </ol>
          </div>

          {/* iOS Instructions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Share2 size={24} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-slate-800">Untuk iPhone/iPad (Safari)</h4>
                <p className="text-sm text-slate-500">Ikuti langkah berikut:</p>
              </div>
            </div>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <p className="font-semibold text-slate-800">Tap tombol Share <Share2 size={16} className="inline" /> di bawah browser</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <p className="font-semibold text-slate-800">Scroll ke bawah dan pilih "Add to Home Screen"</p>
                  <p className="text-sm text-slate-600 mt-1">Icon: <PlusSquare size={16} className="inline text-blue-500" /></p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <p className="font-semibold text-slate-800">Tap "Add" di pojok kanan atas</p>
                  <p className="text-sm text-slate-600 mt-1">Aplikasi akan muncul di home screen Anda</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      )}

      {/* APK Download */}
      {activeTab === 'apk' && (
        <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
            <p className="text-amber-800 font-medium">
              ⚠️ <strong>Catatan:</strong> APK native sedang dalam pengembangan. Untuk saat ini, silakan gunakan opsi PWA (Install) yang lebih praktis dan otomatis update.
            </p>
          </div>

          <a
            href={config.downloadLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-[#0f4c3a] text-white rounded-full py-4 px-12 md:px-16 text-lg md:text-xl font-medium shadow-xl hover:shadow-2xl hover:bg-[#165946] transition-all hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden"
          >
            <span className="relative z-10">Download APK</span>
            <Download className="w-6 h-6 relative z-10 group-hover:animate-bounce" />

            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          </a>

          <p className="text-center text-sm text-gray-400">
            Versi terbaru untuk Android
          </p>
        </div>
      )}

    </div>
  );
};