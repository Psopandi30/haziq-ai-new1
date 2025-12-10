import React from 'react';
import { Download, Smartphone } from 'lucide-react';
import { AppConfig } from '../types';

interface DownloadApkProps {
  config: AppConfig;
}

export const DownloadApk: React.FC<DownloadApkProps> = ({ config }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-start w-full max-w-4xl mx-auto px-4 mt-8 md:mt-12 mb-16 animate-in fade-in duration-500">
      
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

      {/* Download Button */}
      <a 
        href={config.downloadLink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="group relative bg-[#0f4c3a] text-white rounded-full py-4 px-12 md:px-16 text-lg md:text-xl font-medium shadow-xl hover:shadow-2xl hover:bg-[#165946] transition-all hover:-translate-y-1 active:scale-[0.98] flex items-center gap-3 overflow-hidden"
      >
        <span className="relative z-10">Download apk</span>
        <Download className="w-6 h-6 relative z-10 group-hover:animate-bounce" />
        
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
      </a>
      
      <p className="mt-4 text-sm text-gray-400">
        Versi terbaru untuk Android
      </p>

    </div>
  );
};