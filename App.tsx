import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowUp, Loader2, Sparkles, MessageSquare, Copy, ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import { Sidebar } from './components/Sidebar';
import { UserProfile } from './components/UserProfile';
import { DownloadApk } from './components/DownloadApk';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { sendMessageToGemini } from './services/geminiService';
import { Message, QuickAction, UserData, AppConfig } from './types';
import { supabase } from './services/supabaseClient';
import ReactMarkdown from 'react-markdown';

const QUICK_ACTIONS: QuickAction[] = [
  { label: 'Jurnal Akademik', query: 'Jelaskan panduan lengkap cara penyusunan jurnal akademik yang baik dan benar.' },
  { label: 'Google Scholar', query: 'Bagaimana cara efektif menggunakan Google Scholar untuk mencari referensi akademik?' },
  { label: 'Tafsir Al-Quran', query: 'Berikan satu ayat Al-Quran beserta tafsir singkatnya yang berkaitan dengan menuntut ilmu.' },
  { label: 'Hadits Shahih', query: 'Sebutkan satu hadits shahih tentang keutamaan ilmu beserta perawinya.' },
];

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Data State
  // Data State - Fetched from Supabase now
  // Initial empty state, will load in useEffect
  const [users, setUsers] = useState<UserData[]>([]);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  // App Config State
  const [appConfig, setAppConfig] = useState<AppConfig>({
    description: 'Haziq AI adalah asisten cerdas yang dirancang khusus untuk mahasiswa Institut Agama Islam Persis Garut. Aplikasi ini membantu dalam penyusunan jurnal, pencarian referensi akademik, serta studi Al-Quran dan Hadits.',
    downloadLink: '#'
  });

  // Navigation State
  const [hasStarted, setHasStarted] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showDownloadPage, setShowDownloadPage] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    if (!isLoggedIn && !hasStarted) {
      setShowLogin(true);
      return;
    }

    const userMessage: Message = { role: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setHasStarted(true);

    try {
      const response = await sendMessageToGemini(text.trim());
      const aiMessage: Message = { role: 'model', text: response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'model',
        text: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputText);
    }
  };

  useEffect(() => {
    if ((hasStarted || isLoggedIn) && !showDownloadPage && !showProfile && !showAdminLogin) {
      scrollToBottom();
    }
  }, [messages, hasStarted, isLoading, isLoggedIn, showDownloadPage, showProfile, showAdminLogin]);

  // Load students on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from('students').select('*');
      if (error) throw error;
      if (data) {
        // Map Supabase fields to UserData interface if needed, or ensure table matches interface
        // Assuming table columns: id, nim, name, prodi, username, is_verified, password
        // Warning: In production DO NOT select password to frontend. For this prototype it is okay.
        setUsers(data as any as UserData[]);
      }
    } catch (e) {
      console.error("Error fetching users:", e);
    }
  };

  const handleLogin = async (nimInput: string, passwordInput: string) => {
    // For prototype: we check against the loaded users list (which contains passwords).
    // In production: use supabase.auth or a server-side check.

    // Refresh users first to ensure we have latest
    await fetchUsers();

    const foundUser = users.find(u => (u.nim === nimInput || u.username === nimInput) && u.password === passwordInput);

    if (foundUser) {
      setCurrentUser(foundUser);
      setShowLogin(false);
      setIsLoggedIn(true);
      setHasStarted(true);
      setShowDownloadPage(false);
      setShowAdminLogin(false);
      setIsAdminLoggedIn(false);
    } else {
      // Fallback check against fresh data just in case state wasn't updated
      const { data } = await supabase.from('students').select('*').or(`nim.eq.${nimInput},username.eq.${nimInput}`).eq('password', passwordInput).single();
      if (data) {
        setCurrentUser(data as any);
        setShowLogin(false);
        setIsLoggedIn(true);
        setHasStarted(true);
        return;
      }

      alert("User tidak ditemukan atau password salah.");
    }
  };

  const handleRegister = async (data: any) => {
    try {
      // Check if exists
      const { data: existing } = await supabase.from('students').select('id').or(`nim.eq.${data.nim},username.eq.${data.username}`).maybeSingle();

      if (existing) {
        alert("NIM atau Username sudah terdaftar!");
        return;
      }

      const newUserPayload = {
        nim: data.nim,
        name: data.name,
        prodi: data.prodi,
        username: data.username,
        password: data.password,
        is_verified: false
      };

      const { error } = await supabase.from('students').insert([newUserPayload]);

      if (error) throw error;

      await fetchUsers(); // Refresh list
      alert("Pendaftaran berhasil! Silakan login.");

    } catch (error: any) {
      console.error("Registrasi gagal:", error);
      alert("Gagal mendaftar: " + error.message);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setShowProfile(false);
    setIsSidebarOpen(false);
    setHasStarted(false);
    setShowDownloadPage(false);
    setShowAdminLogin(false);
    setIsAdminLoggedIn(false);
    setMessages([]);
    setInputText('');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setShowAdminLogin(true);
  };

  const handleDownloadClick = () => {
    setShowDownloadPage(true);
    setShowProfile(false);
    setIsSidebarOpen(false);
    setShowAdminLogin(false);
    setIsAdminLoggedIn(false);
  };

  const handleAdminClick = () => {
    setShowAdminLogin(true);
    setShowDownloadPage(false);
    setShowProfile(false);
    setIsSidebarOpen(false);
    setHasStarted(false);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
  };

  const handleChatClick = () => {
    setShowDownloadPage(false);
    setShowAdminLogin(false);
    setIsAdminLoggedIn(false);
    if (!isLoggedIn) {
      setShowLogin(true);
    } else {
      setShowProfile(false);
    }
  };

  // --- Render Views ---

  const renderLanding = () => (
    <>
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl mx-auto px-6 relative overflow-y-auto pb-40">

        {/* Abstract Background Blur */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#0f4c3a]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Hero Text */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pt-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold tracking-wide mb-6">
            <Sparkles size={12} />
            <span>Asisten Akademik Cerdas</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-slate-800 tracking-tight leading-tight">
            Apa yang bisa <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0f4c3a] to-emerald-500">Haziq</span> bantu?
          </h2>
          <p className="mt-4 text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-light">
            Tanyakan seputar jurnal, tafsir, atau referensi akademik Institut Agama Islam Persis Garut.
          </p>
        </div>

        {/* Quick Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
          {QUICK_ACTIONS.map((action, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(action.query)}
              className="group relative bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden"
            >
              <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-emerald-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h3 className="text-slate-800 font-semibold text-lg mb-1 relative z-10 group-hover:text-[#0f4c3a] transition-colors">{action.label}</h3>
              <p className="text-slate-400 text-sm font-light line-clamp-2 relative z-10 group-hover:text-slate-500">{action.query}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Fixed Bottom Input Bar */}
      <div className="absolute bottom-6 left-0 right-0 px-4 flex justify-center z-20">
        <div className="w-full max-w-3xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl shadow-slate-300/40 rounded-[2rem] p-2 pl-6 flex items-center gap-2 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-[#0f4c3a]/20 transition-all">
          <MessageSquare className="text-slate-400 w-6 h-6" />
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pertanyaan anda di sini..."
            className="flex-1 bg-transparent border-none outline-none text-lg text-slate-700 placeholder-slate-400 font-medium py-3 min-w-0"
          />
          <button
            onClick={() => handleSend(inputText)}
            className="w-12 h-12 bg-[#0f4c3a] text-white rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-[#0f4c3a]/20"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
        </div>
      </div>
    </>
  );

  const renderChat = () => (
    <div className={`flex-1 w-full ${isLoggedIn ? 'max-w-4xl' : 'max-w-4xl'} mx-auto px-4 flex flex-col h-full relative`}>
      <div className="flex-1 overflow-y-auto no-scrollbar py-8 space-y-8 pb-32">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start items-start gap-3'}`}
          >
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0f4c3a] to-emerald-600 flex items-center justify-center text-white text-xs font-serif font-bold shadow-sm shrink-0 mt-1">
                Hz
              </div>
            )}
            <div className={`flex flex-col gap-2 max-w-[85%] sm:max-w-[80%]`}>
              <div
                className={`px-6 py-4 shadow-sm w-full ${msg.role === 'user'
                  ? 'bg-[#0f4c3a] text-white rounded-[2rem] rounded-br-sm'
                  : 'bg-white border border-slate-100 text-slate-700 rounded-[2rem] rounded-tl-sm shadow-md'
                  } ${msg.isError ? 'bg-red-50 text-red-600 border-red-100' : ''}`}
              >
                {msg.role === 'model' ? (
                  <div className="prose prose-slate prose-p:leading-relaxed prose-headings:font-bold prose-headings:text-slate-800 prose-a:text-emerald-600 prose-strong:text-slate-900 max-w-none">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                )}
              </div>

              {/* Feedback Buttons for Model messages */}
              {msg.role === 'model' && !msg.isError && (
                <div className="flex items-center gap-2 px-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(msg.text);
                      alert("Teks disalin!");
                    }}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Salin"
                  >
                    <Copy size={16} />
                  </button>
                  <div className="h-3 w-px bg-slate-200 mx-1"></div>
                  <button
                    onClick={() => {
                      setMessages(prev => prev.map((m, i) => i === index ? { ...m, feedback: m.feedback === 'like' ? null : 'like' } : m));
                    }}
                    className={`p-1.5 rounded-lg transition-colors ${msg.feedback === 'like' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                  >
                    <ThumbsUp size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setMessages(prev => prev.map((m, i) => i === index ? { ...m, feedback: m.feedback === 'dislike' ? null : 'dislike' } : m));
                    }}
                    className={`p-1.5 rounded-lg transition-colors ${msg.feedback === 'dislike' ? 'text-red-500 bg-red-50' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'}`}
                  >
                    <ThumbsDown size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {
          isLoading && (
            <div className="flex w-full justify-start items-center gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-slate-200"></div>
              <div className="bg-white border border-slate-100 rounded-[2rem] rounded-tl-sm px-6 py-4 shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          )
        }
        <div ref={messagesEndRef} />
      </div >

      {/* Floating Sticky Input */}
      < div className="absolute bottom-6 left-0 right-0 px-4 flex justify-center z-20" >
        <div className="w-full max-w-3xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl shadow-slate-300/40 rounded-[2rem] p-2 pl-6 flex items-center gap-2 ring-1 ring-slate-200">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={isLoggedIn ? "Ketik pesan anda..." : "Silakan login untuk memulai chat"}
            className="flex-1 bg-transparent border-none outline-none text-slate-700 placeholder-slate-400 font-medium py-3 min-w-0"
          />
          <button
            onClick={() => handleSend(inputText)}
            disabled={isLoading || (!inputText.trim() && isLoggedIn)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md ${!inputText.trim() && !isLoading && isLoggedIn
              ? 'bg-slate-100 text-slate-400'
              : 'bg-[#0f4c3a] text-white hover:bg-[#165946] hover:scale-105 active:scale-95'
              }`}
          >
            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <ArrowUp className="w-5 h-5" strokeWidth={3} />}
          </button>
        </div>
      </div >
    </div >
  );

  const renderContent = () => {
    if (showAdminLogin) {
      return isAdminLoggedIn ? (
        <AdminDashboard
          onLogout={handleAdminLogout}
          users={users}
          setUsers={setUsers}
          appConfig={appConfig}
          setAppConfig={setAppConfig}
        />
      ) : (
        <AdminLogin onLogin={handleAdminLoginSuccess} />
      );
    }
    if (showDownloadPage) return <DownloadApk config={appConfig} />;
    if (showProfile) return <UserProfile user={currentUser} onLogout={handleLogout} onBack={() => setShowProfile(false)} />;
    if (isLoggedIn || hasStarted) return renderChat();
    return renderLanding();
  };

  const isChatInterface = (isLoggedIn || hasStarted) && !showDownloadPage && !showProfile && !showAdminLogin;

  return (
    <div className="h-full flex flex-col relative font-sans">
      <Header
        onChatClick={handleChatClick}
        onDownloadClick={handleDownloadClick}
        onAdminClick={handleAdminClick}
        variant={isAdminLoggedIn ? 'admin' : (isLoggedIn && !showDownloadPage && !showAdminLogin ? 'loggedIn' : 'default')}
        onMenuClick={() => setIsSidebarOpen(true)}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={currentUser}
        onProfileClick={() => {
          setIsSidebarOpen(false);
          setShowProfile(true);
          setShowDownloadPage(false);
          setShowAdminLogin(false);
          setIsAdminLoggedIn(false);
        }}
        onNewChat={() => {
          setMessages([]);
          setIsSidebarOpen(false);
          setShowProfile(false);
          setShowDownloadPage(false);
          setShowAdminLogin(false);
          setIsAdminLoggedIn(false);
          if (!isLoggedIn) setHasStarted(false);
        }}
      />

      <main className={`flex-1 flex flex-col relative z-10 ${isChatInterface ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        {renderContent()}
      </main>

      {(!hasStarted && !isLoggedIn && !showProfile && !isAdminLoggedIn && !showAdminLogin) || showDownloadPage ? <Footer /> : null}

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}
    </div>
  );
};

export default App;