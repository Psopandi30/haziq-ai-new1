import { supabase } from '../services/supabaseClient';
import React, { useState, useEffect } from 'react';
import { Users, FileEdit, CheckCircle, Trash2, LogOut, UserPlus, X, Save, LayoutDashboard, Search, MoreHorizontal, PenSquare } from 'lucide-react';
import { UserData, AppConfig } from '../types';

interface AdminDashboardProps {
    onLogout: () => void;
    users: UserData[];
    setUsers: React.Dispatch<React.SetStateAction<UserData[]>>;
    appConfig: AppConfig;
    setAppConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
}

type TabView = 'dashboard' | 'kelolah-user' | 'tulis-deskripsi';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, users, setUsers, appConfig, setAppConfig }) => {
    const [activeTab, setActiveTab] = useState<TabView>('kelolah-user');
    const [showAddModal, setShowAddModal] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        nim: '',
        name: '',
        prodi: '',
        username: '',
        password: ''
    });

    const [localDesc, setLocalDesc] = useState(appConfig.description);
    const [localLink, setLocalLink] = useState(appConfig.downloadLink);
    const [searchQuery, setSearchQuery] = useState('');

    // Initial fetch on mount
    useEffect(() => {
        fetchUsers();
        setLocalDesc(appConfig.description);
        setLocalLink(appConfig.downloadLink);
    }, [appConfig]);

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase.from('students').select('*').order('id', { ascending: false });
            if (error) throw error;
            if (data) {
                setUsers(data as any);
            }
        } catch (e) {
            console.error("Error fetching users:", e);
        }
    };

    const resetForm = () => {
        setFormData({ nim: '', name: '', prodi: '', username: '', password: '' });
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
            prodi: user.prodi,
            username: user.username,
            password: ''
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
                    prodi: formData.prodi,
                    username: formData.username
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
                    prodi: formData.prodi,
                    username: formData.username,
                    password: formData.password || '123456',
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

    const handleSaveConfig = () => {
        // In a real app, save this to a 'config' table in Supabase.
        // For now, we keep it local/prop-based as requested structure didn't specify config table.
        setAppConfig({
            description: localDesc,
            downloadLink: localLink
        });
        alert("Konfigurasi tersimpan (Local State)!");
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.nim.includes(searchQuery)
    );

    return (
        <div className="flex flex-col md:flex-row w-full h-screen bg-[#f1f5f9] overflow-hidden">

            {/* --- Sidebar Modern --- */}
            <div className="w-full md:w-72 bg-[#0f4c3a] flex flex-col shrink-0 shadow-2xl relative z-20">
                <div className="p-8 flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-white font-bold text-xl border border-white/10">
                        Hz
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-lg tracking-tight">Admin Panel</h2>
                        <p className="text-emerald-300 text-xs font-medium">v2.0 Dashboard</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {[
                        { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
                        { id: 'kelolah-user', label: 'Manajemen User', icon: Users },
                        { id: 'tulis-deskripsi', label: 'Konfigurasi App', icon: FileEdit }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as TabView)}
                            className={`flex items-center gap-3 px-4 py-3.5 w-full rounded-xl transition-all duration-200 group ${activeTab === item.id
                                ? 'bg-white/10 text-white shadow-lg backdrop-blur-md border border-white/5'
                                : 'text-emerald-100/70 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-emerald-300' : 'text-emerald-100/50 group-hover:text-white'}`} />
                            <span className="font-medium text-sm tracking-wide">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 mt-auto">
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-3 px-4 py-3.5 w-full text-red-300 hover:bg-red-500/10 hover:text-red-200 rounded-xl transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium text-sm">Keluar</span>
                    </button>
                </div>
            </div>

            {/* --- Main Content --- */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 relative">

                {/* Header Content */}
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">
                            {activeTab === 'dashboard' && 'Ringkasan Sistem'}
                            {activeTab === 'kelolah-user' && 'Daftar Pengguna'}
                            {activeTab === 'tulis-deskripsi' && 'Pengaturan Aplikasi'}
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

                {activeTab === 'kelolah-user' && (
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

                        {/* Modern Table / Card Grid */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Mahasiswa</th>
                                        <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">NIM / Identitas</th>
                                        <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">Fakultas</th>
                                        <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                        <th className="p-6 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-12 text-center text-slate-400">Tidak ada data ditemukan.</td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                                                <td className="p-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0f4c3a] to-[#2d6a58] flex items-center justify-center text-white font-bold text-sm shadow-md">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-800">{user.name}</p>
                                                            <p className="text-xs text-slate-500 md:hidden">{user.nim}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6 hidden md:table-cell">
                                                    <span className="font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded text-sm">{user.nim}</span>
                                                </td>
                                                <td className="p-6 hidden md:table-cell">
                                                    <span className="text-slate-600 text-sm">{user.prodi}</span>
                                                </td>
                                                <td className="p-6">
                                                    {user.isVerified ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                            <CheckCircle size={12} />
                                                            Verified
                                                        </span>
                                                    ) : (
                                                        <button onClick={() => handleVerifyUser(user.id)} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200 cursor-pointer transition-colors animate-pulse">
                                                            Pending
                                                        </button>
                                                    )}
                                                </td>
                                                <td className="p-6 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleOpenEditModal(user)} className="p-2 text-slate-400 hover:text-[#0f4c3a] hover:bg-emerald-50 rounded-lg transition-colors">
                                                            <PenSquare size={18} />
                                                        </button>
                                                        <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

                {activeTab === 'tulis-deskripsi' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
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
                                    Simpan Perubahan
                                </button>
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
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Nama Lengkap</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-[#0f4c3a]/20 focus:border-[#0f4c3a] outline-none transition-all"
                                    placeholder="Nama Lengkap..."
                                />
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