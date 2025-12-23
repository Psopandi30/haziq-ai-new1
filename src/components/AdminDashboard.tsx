import { supabase } from '../services/supabaseClient';
import React, { useState, useEffect } from 'react';
import { Users, FileEdit, CheckCircle, Trash2, LogOut, UserPlus, X, Save, LayoutDashboard, Search, MoreHorizontal, PenSquare, LayoutGrid, Settings } from 'lucide-react';
import { UserData, AppConfig } from '../types';

interface AdminDashboardProps {
    onLogout: () => void;
    users: UserData[];
    setUsers: React.Dispatch<React.SetStateAction<UserData[]>>;
    appConfig: AppConfig;
    setAppConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
}

type TabView = 'dashboard' | 'users' | 'config';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, users, setUsers, appConfig, setAppConfig }) => {
    const [activeTab, setActiveTab] = useState<TabView>('users');
    const [showAddModal, setShowAddModal] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        nim: '',
        name: '',
        full_name: '',
        prodi: '',
        username: '',
        password: '',
        position: 'Mahasiswa' as 'Mahasiswa' | 'Dosen' | 'Staff'
    });

    const [localDesc, setLocalDesc] = useState(appConfig.description);
    const [localLink, setLocalLink] = useState(appConfig.downloadLink);
    const [localWebhook, setLocalWebhook] = useState(appConfig.webhookUrl);
    const [localApiKeys, setLocalApiKeys] = useState(appConfig.geminiApiKeys || ''); // New State
    const [searchQuery, setSearchQuery] = useState('');

    // Initial fetch on mount
    useEffect(() => {
        fetchUsers();
        setLocalDesc(appConfig.description);
        setLocalLink(appConfig.downloadLink);
        setLocalWebhook(appConfig.webhookUrl);
        setLocalApiKeys(appConfig.geminiApiKeys || ''); // Sync State
    }, [appConfig]);

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase.from('students').select('*').order('id', { ascending: false });
            if (error) throw error;
            if (data) {
                // Map database fields (snake_case) to TypeScript interface (camelCase)
                const mappedUsers = data.map((user: any) => ({
                    id: user.id,
                    nim: user.nim,
                    name: user.name,
                    full_name: user.full_name,
                    prodi: user.prodi,
                    username: user.username,
                    password: user.password,
                    position: user.position || 'Mahasiswa',
                    isVerified: user.is_verified ?? false // Map is_verified to isVerified
                }));
                setUsers(mappedUsers);
            }
        } catch (e) {
            console.error("Error fetching users:", e);
        }
    };

    const resetForm = () => {
        setFormData({ nim: '', name: '', full_name: '', prodi: '', username: '', password: '', position: 'Mahasiswa' });
        setIsEditing(false);
        setCurrentEditId(null);
    };

    const handleOpenAddModal = () => {
        resetForm();
        setShowAddModal(true);
    };

    const handleOpenEditModal = (user: UserData) => {
        setFormData({
            nim: user.nim,
            name: user.name,
            full_name: user.full_name || '',
            prodi: user.prodi,
            username: user.username,
            password: '',
            position: user.position || 'Mahasiswa'
        });
        setIsEditing(true);
        setCurrentEditId(user.id);
        setShowAddModal(true);
    };

    const handleSaveUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.nim || !formData.name || !formData.username) return;

        try {
            if (isEditing && currentEditId !== null) {
                const updatePayload: any = {
                    nim: formData.nim,
                    name: formData.name,
                    full_name: formData.full_name,
                    prodi: formData.prodi,
                    username: formData.username,
                    position: formData.position
                };
                // Only update password if provided
                if (formData.password) {
                    updatePayload.password = formData.password;
                }

                const { error } = await supabase.from('students').update(updatePayload).eq('id', currentEditId);
                if (error) throw error;

                alert("Data user berhasil diperbarui!");
            } else {
                const newUserPayload = {
                    nim: formData.nim,
                    name: formData.name,
                    full_name: formData.full_name,
                    prodi: formData.prodi,
                    username: formData.username,
                    password: formData.password || '123456',
                    position: formData.position,
                    is_verified: true
                };
                const { error } = await supabase.from('students').insert([newUserPayload]);
                if (error) throw error;

                alert("User berhasil ditambahkan!");
            }

            await fetchUsers();
            setShowAddModal(false);
            resetForm();

        } catch (err: any) {
            console.error("Error saving user:", err);
            alert("Gagal menyimpan: " + err.message);
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (window.confirm("Hapus user ini permanent?")) {
            try {
                const { error } = await supabase.from('students').delete().eq('id', id);
                if (error) throw error;
                await fetchUsers();
            } catch (err) {
                alert("Gagal menghapus.");
            }
        }
    };

    const handleVerifyUser = async (id: number) => {
        try {
            const { error } = await supabase.from('students').update({ is_verified: true }).eq('id', id);
            if (error) throw error;
            await fetchUsers(); // Refresh UI
        } catch (err) {
            alert("Gagal memverifikasi.");
        }
    };

    const handleSaveConfig = async () => {
        try {
            const { error } = await supabase.from('app_config').upsert({
                id: 1,
                description: localDesc,
                download_link: localLink,
                webhook_url: appConfig.webhookUrl
            });

            if (error) throw error;

            // Save general app configuration (description and download link)
            setAppConfig({
                description: localDesc,
                downloadLink: localLink,
                webhookUrl: appConfig.webhookUrl
            });
            alert("Konfigurasi aplikasi tersimpan!");
        } catch (err) {
            console.error("Error saving config:", err);
            alert("Gagal menyimpan konfigurasi.");
        }
    };

    const handleSaveWebhook = async () => {
        try {
            const { error } = await supabase.from('app_config').upsert({
                id: 1,
                description: appConfig.description,
                download_link: appConfig.downloadLink,
                webhook_url: localWebhook,
                gemini_api_keys: localApiKeys // Save Keys
            });

            if (error) throw error;

            // Save webhook configuration separately
            setAppConfig({
                description: appConfig.description,
                downloadLink: appConfig.downloadLink,
                webhookUrl: localWebhook,
                geminiApiKeys: localApiKeys // Update State
            });
            alert("Konfigurasi API berhasil diperbarui!");
        } catch (err) {
            console.error("Error saving webhook:", err);
            alert("Gagal menyimpan webhook.");
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.nim.includes(searchQuery)
    );

    return (
        <div className="flex flex-col md:flex-row w-full h-full bg-[#f1f5f9] overflow-hidden">

            {/* --- Sidebar Modern --- */}
            {/* --- Sidebar Modern --- */}
            {/* --- Sidebar Modern Fixed Layout --- */}
            <div className="w-full md:w-72 bg-[#0f4c3a] flex flex-col shrink-0 shadow-2xl relative z-20 md:h-full max-h-screen">

                {/* 1. Header Sidebar (Logo) - Fixed */}
                <div className="p-8 pb-4 shrink-0 flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-white font-bold text-xl border border-white/10">
                        Hz
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-lg tracking-tight">Haziq AI</h1>
                        <p className="text-emerald-300 text-xs font-medium">ADMIN PANEL</p>
                    </div>
                </div>

                {/* 2. Scrollable Menu Area */}
                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 custom-scrollbar min-h-0">
                    {/* Dashboard Menu */}
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${activeTab === 'dashboard'
                            ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-400/10 border border-emerald-400/20 shadow-lg shadow-emerald-900/20'
                            : 'hover:bg-white/5 border border-transparent'
                            }`}
                    >
                        <LayoutGrid size={22} className={activeTab === 'dashboard' ? 'text-emerald-300' : 'text-slate-400 group-hover:text-emerald-300 transition-colors'} />
                        <span className={`font-medium ${activeTab === 'dashboard' ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'}`}>Dashboard Overview</span>
                    </button>

                    {/* Manajemen User Menu */}
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${activeTab === 'users'
                            ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-400/10 border border-emerald-400/20 shadow-lg shadow-emerald-900/20'
                            : 'hover:bg-white/5 border border-transparent'
                            }`}
                    >
                        <Users size={22} className={activeTab === 'users' ? 'text-emerald-300' : 'text-slate-400 group-hover:text-emerald-300 transition-colors'} />
                        <span className={`font-medium ${activeTab === 'users' ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'}`}>Manajemen User</span>
                    </button>

                    {/* Konfigurasi App Menu */}
                    <button
                        onClick={() => setActiveTab('config')}
                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${activeTab === 'config'
                            ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-400/10 border border-emerald-400/20 shadow-lg shadow-emerald-900/20'
                            : 'hover:bg-white/5 border border-transparent'
                            }`}
                    >
                        <Settings size={22} className={activeTab === 'config' ? 'text-emerald-300' : 'text-slate-400 group-hover:text-emerald-300 transition-colors'} />
                        <span className={`font-medium ${activeTab === 'config' ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'}`}>Konfigurasi App</span>
                    </button>
                </div>

                {/* 3. Footer Sidebar (Logout) - Fixed Bottom */}
                <div className="p-8 border-t border-emerald-900/30 shrink-0 bg-[#0f4c3a]">
                    <button onClick={onLogout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-300 group">
                        <LogOut size={22} className="text-slate-400 group-hover:text-red-400 transition-colors" />
                        <span className="font-medium text-slate-400 group-hover:text-red-300 transition-colors">Keluar</span>
                    </button>
                    <p className="text-center text-emerald-900/40 text-xs mt-6 font-mono">v2.0.4 Stable</p>
                </div>
            </div>

            {/* --- Main Content --- */}
            <div className="flex-1 h-full overflow-y-auto p-6 md:p-10 relative">

                {/* Header Content */}
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">
                            {activeTab === 'dashboard' && 'Ringkasan Sistem'}
                            {activeTab === 'users' && 'Daftar Pengguna'}
                            {activeTab === 'config' && 'Pengaturan Aplikasi'}
                        </h1>
                        <p className="text-slate-500">Kelola operasional Haziq AI dari sini.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-xs font-semibold text-slate-600">Sistem Online</span>
                        </div>
                    </div>
                </div>

                {activeTab === 'users' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* Search & Actions Bar */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Cari berdasarkan Nama atau NIM..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-slate-700 placeholder-slate-400 outline-none transition-all"
                                />
                            </div>
                            <button
                                onClick={handleOpenAddModal}
                                className="bg-[#0f4c3a] text-white px-6 py-3 rounded-xl hover:bg-[#165946] shadow-lg shadow-[#0f4c3a]/20 transition-all active:scale-95 font-medium flex items-center gap-2"
                            >
                                <UserPlus size={18} />
                                Tambah User
                            </button>
                        </div>

                        {/* Modern Floating Table Design */}
                        <div className="mt-2">
                            <table className="w-full text-left border-separate border-spacing-y-4">
                                <thead>
                                    <tr className="text-slate-400 text-xs uppercase tracking-wider font-bold">
                                        <th className="px-6 py-2">Pengguna</th>
                                        <th className="px-6 py-2 hidden md:table-cell">Identitas</th>
                                        <th className="px-6 py-2 hidden lg:table-cell">Fakultas</th>
                                        <th className="px-6 py-2 hidden md:table-cell">Kedudukan</th>
                                        <th className="px-6 py-2">Status</th>
                                        <th className="px-6 py-2 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-12">
                                                <div className="flex flex-col items-center justify-center text-slate-400">
                                                    <Search size={48} className="mb-4 opacity-20" />
                                                    <p>Tidak ada data ditemukan.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group rounded-2xl"
                                            >
                                                <td className="px-6 py-5 rounded-l-2xl border-l-4 border-transparent hover:border-[#0f4c3a] transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0f4c3a] to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-emerald-900/10 shadow-lg">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-800 text-base">{user.name}</p>
                                                            <p className="text-xs text-slate-500 md:hidden font-mono mt-0.5">{user.nim}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 hidden md:table-cell">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-slate-400 mb-1">NIM</span>
                                                        <span className="font-mono text-slate-600 font-medium bg-slate-50 px-2 py-1 rounded-md w-fit">{user.nim}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 hidden lg:table-cell">
                                                    <span className="text-slate-600 font-medium">{user.prodi}</span>
                                                </td>
                                                <td className="px-6 py-5 hidden md:table-cell">
                                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${user.position === 'Mahasiswa' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                                        user.position === 'Dosen' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                                                            'bg-orange-50 text-orange-700 border border-orange-100'
                                                        }`}>
                                                        {user.position || 'Mahasiswa'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    {user.isVerified ? (
                                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                                            Verified
                                                        </div>
                                                    ) : (
                                                        <button onClick={() => handleVerifyUser(user.id)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-100 cursor-pointer transition-all">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                                                            Pending
                                                        </button>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5 text-right rounded-r-2xl">
                                                    <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                                                        <button onClick={() => handleOpenEditModal(user)} className="p-2.5 text-slate-400 hover:text-[#0f4c3a] hover:bg-emerald-50 rounded-xl transition-all" title="Edit">
                                                            <PenSquare size={18} />
                                                        </button>
                                                        <button onClick={() => handleDeleteUser(user.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Hapus">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'config' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl space-y-6">

                        {/* General App Configuration Card */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                    <FileEdit size={20} className="text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Konfigurasi Aplikasi</h3>
                                    <p className="text-sm text-slate-500">Pengaturan umum aplikasi Haziq AI</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-semibold mb-3">Deskripsi Aplikasi</label>
                                <textarea
                                    value={localDesc}
                                    onChange={(e) => setLocalDesc(e.target.value)}
                                    className="w-full h-48 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-700 resize-none focus:ring-2 focus:ring-[#0f4c3a]/20 focus:border-[#0f4c3a] focus:bg-white transition-all outline-none leading-relaxed"
                                    placeholder="Jelaskan fitur utama aplikasi..."
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-semibold mb-3">Link Download (APK)</label>
                                <input
                                    type="text"
                                    value={localLink}
                                    onChange={(e) => setLocalLink(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 focus:ring-2 focus:ring-[#0f4c3a]/20 focus:border-[#0f4c3a] focus:bg-white transition-all outline-none"
                                />
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button
                                    onClick={handleSaveConfig}
                                    className="bg-[#0f4c3a] hover:bg-[#165946] text-white py-3 px-8 rounded-xl font-medium shadow-lg shadow-[#0f4c3a]/20 transition-all active:scale-95 flex items-center gap-2"
                                >
                                    <Save size={18} />
                                    Simpan Konfigurasi
                                </button>
                            </div>
                        </div>

                        {/* Webhook Configuration Card (Separate) */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-3xl shadow-sm border-2 border-amber-200 space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-700">
                                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Webhook N8N</h3>
                                    <p className="text-sm text-amber-700 font-medium">⚠️ Pengaturan sensitif - Hati-hati saat mengubah</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-semibold mb-3">Webhook URL</label>
                                <input
                                    type="text"
                                    value={localWebhook}
                                    onChange={(e) => setLocalWebhook(e.target.value)}
                                    placeholder="https://n8n.example.com/webhook/..."
                                    className="w-full bg-white border-2 border-amber-200 rounded-xl p-4 text-slate-700 font-mono text-sm focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all outline-none"
                                />
                                <p className="text-xs text-slate-600 mt-2 flex items-start gap-2">
                                    <span className="text-amber-600 font-bold">ℹ️</span>
                                    <span>URL webhook N8N untuk integrasi Gemini AI. Perubahan akan langsung mempengaruhi semua chat pengguna.</span>
                                </p>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button
                                    onClick={handleSaveWebhook}
                                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 px-8 rounded-xl font-bold shadow-lg shadow-amber-500/30 transition-all active:scale-95 flex items-center gap-2"
                                >
                                    <Save size={18} />
                                    Simpan Integrasi AI
                                </button>
                            </div>
                        </div>

                        {/* API Keys Configuration Card (New) */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-3xl shadow-sm border-2 border-blue-200 space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                    <Sparkles size={20} className="text-blue-700" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">API Keys (Direct Mode)</h3>
                                    <p className="text-sm text-blue-700 font-medium">Opsional: Masukkan beberapa API key untuk rotasi.</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-semibold mb-3">Google Gemini API Keys (Comma Separated)</label>
                                <textarea
                                    value={localApiKeys}
                                    onChange={(e) => setLocalApiKeys(e.target.value)}
                                    placeholder="AIzaSy..., AIzaSy..., AIzaSy..."
                                    className="w-full h-32 bg-white border-2 border-blue-200 rounded-xl p-4 text-slate-700 font-mono text-sm focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 transition-all outline-none resize-none"
                                />
                                <p className="text-xs text-slate-600 mt-2 flex items-start gap-2">
                                    <span className="text-blue-600 font-bold">ℹ️</span>
                                    <span>Jika diisi, aplikasi akan menggunakan API Keys ini secara bergantian (rotasi) dan MENGABAIKAN Webhook N8N. Kosongkan jika ingin tetap menggunakan N8N.</span>
                                </p>
                            </div>
                        </div>

                    </div>
                )}

                {/* Placeholder for Dashboard tab */}
                {activeTab === 'dashboard' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-[#0f4c3a]">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <p className="text-slate-500 text-sm font-medium">Total User</p>
                                    <h3 className="text-2xl font-bold text-slate-800">{users.length}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700">
                                    <CheckCircle size={24} />
                                </div>
                                <div>
                                    <p className="text-slate-500 text-sm font-medium">Terverifikasi</p>
                                    <h3 className="text-2xl font-bold text-slate-800">{users.filter(u => u.isVerified).length}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* --- Add/Edit Modal --- */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
                    <div className="bg-white rounded-[2rem] w-full max-w-lg p-8 relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800">
                                    {isEditing ? 'Edit Informasi' : 'Tambah User'}
                                </h3>
                                <p className="text-slate-500 text-sm">Lengkapi data pengguna di bawah ini.</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full p-2 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveUser} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">NIM</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.nim}
                                        onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-[#0f4c3a]/20 focus:border-[#0f4c3a] outline-none transition-all"
                                        placeholder="2024..."
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Fakultas</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.prodi}
                                        onChange={(e) => setFormData({ ...formData, prodi: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-[#0f4c3a]/20 focus:border-[#0f4c3a] outline-none transition-all"
                                        placeholder="Ushuluddin..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Nama Panggilan</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-[#0f4c3a]/20 focus:border-[#0f4c3a] outline-none transition-all"
                                    placeholder="Nama Panggilan..."
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Nama Lengkap</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-[#0f4c3a]/20 focus:border-[#0f4c3a] outline-none transition-all"
                                    placeholder="Nama Lengkap Sesuai KTP..."
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Kedudukan</label>
                                <select
                                    value={formData.position}
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value as 'Mahasiswa' | 'Dosen' | 'Staff' })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-[#0f4c3a]/20 focus:border-[#0f4c3a] outline-none transition-all"
                                >
                                    <option value="Mahasiswa">Mahasiswa</option>
                                    <option value="Dosen">Dosen</option>
                                    <option value="Staff">Staff</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Username</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-[#0f4c3a]/20 focus:border-[#0f4c3a] outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Password</label>
                                    <input
                                        type="password"
                                        required={!isEditing}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder={isEditing ? "(Tetap)" : ""}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-[#0f4c3a]/20 focus:border-[#0f4c3a] outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="pt-8 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-semibold"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-[#0f4c3a] text-white rounded-xl hover:bg-[#165946] shadow-lg shadow-[#0f4c3a]/20 transition-all active:scale-95 flex items-center gap-2 font-semibold"
                                >
                                    <Save size={18} />
                                    Simpan Data
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};