import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone, Chrome } from 'lucide-react';

export const InstallPrompt: React.FC = () => {
    const [showPrompt, setShowPrompt] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // Check if already installed (standalone mode)
        const standalone = window.matchMedia('(display-mode: standalone)').matches;
        setIsStandalone(standalone);

        // Check if iOS
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        setIsIOS(iOS);

        // Listen for install prompt (Android Chrome)
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);

            // Show prompt after 3 seconds if not dismissed before
            setTimeout(() => {
                const dismissed = localStorage.getItem('installPromptDismissed');
                if (!dismissed && !standalone) {
                    setShowPrompt(true);
                }
            }, 3000);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // For iOS, show manual instruction after 3 seconds
        if (iOS && !standalone) {
            setTimeout(() => {
                const dismissed = localStorage.getItem('installPromptDismissed');
                if (!dismissed) {
                    setShowPrompt(true);
                }
            }, 3000);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            // Android Chrome - trigger native install prompt
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }

            setDeferredPrompt(null);
            setShowPrompt(false);
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('installPromptDismissed', 'true');
    };

    // Don't show if already installed
    if (isStandalone || !showPrompt) {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-in slide-in-from-bottom-8 duration-500">
            <div className="bg-gradient-to-br from-[#0f4c3a] to-emerald-700 rounded-3xl shadow-2xl p-6 text-white relative overflow-hidden">

                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-400/20 rounded-full blur-2xl"></div>

                {/* Close Button */}
                <button
                    onClick={handleDismiss}
                    className="absolute top-3 right-3 p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                    <X size={18} />
                </button>

                {/* Content */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Smartphone size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Install Haziq AI</h3>
                            <p className="text-emerald-100 text-xs">Akses lebih cepat & mudah</p>
                        </div>
                    </div>

                    {/* Instructions based on platform */}
                    {isIOS ? (
                        // iOS Instructions
                        <div className="space-y-3 mb-4">
                            <p className="text-sm text-emerald-50">
                                Install aplikasi ke Home Screen Anda:
                            </p>
                            <ol className="text-sm space-y-2 text-emerald-50">
                                <li className="flex items-start gap-2">
                                    <span className="font-bold min-w-[20px]">1.</span>
                                    <span>Tap tombol <strong>Share</strong> di bawah browser</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="font-bold min-w-[20px]">2.</span>
                                    <span>Pilih <strong>"Add to Home Screen"</strong></span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="font-bold min-w-[20px]">3.</span>
                                    <span>Tap <strong>"Add"</strong> di pojok kanan atas</span>
                                </li>
                            </ol>
                            <div className="flex items-center gap-2 p-3 bg-white/10 rounded-xl mt-3">
                                <Chrome size={16} />
                                <p className="text-xs">Gunakan Safari untuk hasil terbaik</p>
                            </div>
                        </div>
                    ) : (
                        // Android Instructions
                        <div className="space-y-3 mb-4">
                            <p className="text-sm text-emerald-50">
                                {deferredPrompt
                                    ? "Klik tombol di bawah untuk install aplikasi ke perangkat Anda."
                                    : "Install aplikasi untuk pengalaman lebih baik:"}
                            </p>
                            {!deferredPrompt && (
                                <ol className="text-sm space-y-2 text-emerald-50">
                                    <li className="flex items-start gap-2">
                                        <span className="font-bold min-w-[20px]">1.</span>
                                        <span>Tap menu <strong>⋮</strong> di browser</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-bold min-w-[20px]">2.</span>
                                        <span>Pilih <strong>"Add to Home screen"</strong></span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-bold min-w-[20px]">3.</span>
                                        <span>Tap <strong>"Add"</strong></span>
                                    </li>
                                </ol>
                            )}
                        </div>
                    )}

                    {/* Install Button (Android only) */}
                    {deferredPrompt && !isIOS && (
                        <button
                            onClick={handleInstallClick}
                            className="w-full py-3 px-4 bg-white text-[#0f4c3a] rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <Download size={20} />
                            Install Sekarang
                        </button>
                    )}

                    {/* Dismiss Button */}
                    <button
                        onClick={handleDismiss}
                        className="w-full mt-3 py-2 text-sm text-emerald-100 hover:text-white transition-colors"
                    >
                        Nanti saja
                    </button>
                </div>
            </div>
        </div>
    );
};
