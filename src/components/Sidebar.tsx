import React, { useState, useEffect } from 'react';
import { Search, PenSquare, History, X, Trash2, MoreVertical, MessageSquare, ChevronRight } from 'lucide-react';
import { UserData, ChatSession } from '../types';
import { supabase } from '../services/supabaseClient';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileClick: () => void;
  onNewChat: () => void;
  onLoadSession: (sessionId: number) => void;
  onDeleteSession: (sessionId: number) => void;
  user: UserData | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onProfileClick,
  onNewChat,
  onLoadSession,
  onDeleteSession,
  user
}) => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch chat sessions from database
  useEffect(() => {
    if (isOpen && user) {
      fetchChatSessions();
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (!isOpen) setActiveMenuId(null);
  }, [isOpen]);

  const fetchChatSessions = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setChatSessions(data || []);
    } catch (err) {
      console.error('Error fetching chat sessions:', err);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'NP';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    // Reset time to midnight for accurate calendar day comparison
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffTime = todayDate.getTime() - targetDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hari ini';
    if (diffDays === 1) return 'Kemarin';
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleDeleteAll = async () => {
    if (!user) return;
    if (window.confirm("Hapus semua riwayat chat?")) {
      try {
        const { error } = await supabase
          .from('chat_sessions')
          .delete()
          .eq('user_id', user.id);
        if (error) throw error;
        setChatSessions([]);
        onNewChat(); // Start fresh chat
      } catch (err) {
        console.error('Error deleting all sessions:', err);
        alert('Gagal menghapus semua riwayat');
      }
    }
  };

  const handleDeleteItem = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      await onDeleteSession(id);
      setChatSessions(prev => prev.filter(item => item.id !== id));
      setActiveMenuId(null);
    } catch (err) {
      console.error('Error in handleDeleteItem:', err);
    }
  };

  const toggleMenu = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleLoadSession = (sessionId: number) => {
    onLoadSession(sessionId);
  };

  const filteredSessions = chatSessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      <div className={`fixed top-0 left-0 h-full w-[85%] md:w-[350px] bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        <div className="p-4 flex justify-between items-center border-b border-gray-100">
          <span className="font-bold text-lg text-slate-800 ml-2">Menu</span>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 px-4 py-4 flex flex-col overflow-hidden">

          <button
            onClick={() => { onNewChat(); onClose(); }}
            className="flex items-center gap-3 w-full p-4 bg-[#0f4c3a] text-white rounded-2xl shadow-lg shadow-[#0f4c3a]/20 mb-6 transition-transform active:scale-95 group"
          >
            <PenSquare size={20} />
            <span className="font-semibold">Obrolan Baru</span>
            <ChevronRight className="ml-auto w-5 h-5 opacity-50 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center gap-3 mb-6 bg-slate-50 p-2 rounded-xl">
            <Search className="text-slate-400 w-5 h-5 ml-2" />
            <input
              type="text"
              placeholder="Cari riwayat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full text-slate-700"
            />
          </div>

          <div className="flex items-center justify-between mb-2 px-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Riwayat</span>
            {chatSessions.length > 0 && (
              <button onClick={handleDeleteAll} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                <Trash2 size={12} /> Hapus Semua
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {filteredSessions.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">
                {searchQuery ? 'Tidak ada hasil pencarian.' : 'Belum ada riwayat chat.'}
              </div>
            ) : (
              filteredSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => handleLoadSession(session.id)}
                  className="group relative flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <MessageSquare className="w-5 h-5 text-slate-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-700 text-sm font-medium truncate">{session.title}</p>
                    <p className="text-[10px] text-slate-400">{formatDate(session.updated_at)}</p>
                  </div>
                  <button
                    onClick={(e) => toggleMenu(e, session.id)}
                    className="p-1.5 text-slate-300 hover:text-slate-600 rounded-lg hover:bg-white"
                  >
                    <MoreVertical size={16} />
                  </button>

                  {activeMenuId === session.id && (
                    <div className="absolute right-8 top-8 w-24 bg-white rounded-xl shadow-xl border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                      <button
                        onClick={(e) => handleDeleteItem(e, session.id)}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                      >
                        Hapus
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={onProfileClick}
            className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-slate-50 transition-colors group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#0f4c3a] to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
              {getInitials(user?.name || '')}
            </div>
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-slate-800 font-bold text-sm truncate">
                {user?.name || 'Tamu'}
              </p>
              <p className="text-slate-500 text-xs font-medium truncate">
                {user?.nim || 'Lihat Profil'}
              </p>
            </div>
            <ChevronRight className="text-slate-300 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </>
  );
};