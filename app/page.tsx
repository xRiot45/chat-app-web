'use client';

import {
  ArrowLeft,
  Bell,
  Check, CheckCheck,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Globe,
  Heart,
  Image as ImageIcon,
  LogOut,
  MessageSquare,
  Mic,
  Moon,
  MoreHorizontal,
  Phone,
  Pin,
  Plus,
  Search,
  Send,
  Settings,
  Share2,
  Shield,
  Smile,
  Sun,
  UserPlus,
  Users,
  Video,
  X
} from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useMemo, useRef, useState } from 'react';

// --- GENERATED DUMMY DATA ---

const STORIES = [
  { id: 's1', name: 'Anda', img: 'https://i.pravatar.cc/150?u=me', viewed: false, isMe: true, time: 'Baru saja' },
  { id: 's2', name: 'Sarah', img: 'https://i.pravatar.cc/150?u=3', viewed: false, time: '5m lalu' },
  { id: 's3', name: 'Dimas', img: 'https://i.pravatar.cc/150?u=8', viewed: true, time: '1j lalu' },
  { id: 's4', name: 'Elon', img: 'https://i.pravatar.cc/150?u=12', viewed: false, time: '3j lalu' },
  { id: 's5', name: 'Jessica', img: 'https://i.pravatar.cc/150?u=20', viewed: true, time: '5j lalu' },
];

const PINNED_CHATS = [
  { id: 'u1', type: 'personal', name: 'Sarah Design', avatar: 'https://i.pravatar.cc/150?u=3', status: 'online', lastMsg: 'File revisi sudah dikirim ya 📁', time: '10:45', unread: 2 },
  { id: 'g1', type: 'group', name: 'Core Team Alpha 🚀', avatar: 'https://ui-avatars.com/api/?name=Core+Team&background=6366f1&color=fff', members: 8, lastMsg: 'Meeting jam 2 siang nanti', time: '09:30', unread: 0 },
];

const ALL_CHATS = [
  { id: 'u2', type: 'personal', name: 'Dev Borneo', avatar: 'https://i.pravatar.cc/150?u=2', status: 'offline', lastMsg: 'Siap, nanti saya cek PR-nya.', time: 'Kemarin', unread: 0 },
  { id: 'g2', type: 'group', name: 'Crypto Signal VIP 💎', avatar: 'https://ui-avatars.com/api/?name=Crypto+VIP&background=10b981&color=fff', members: 420, lastMsg: 'BTC forming a bullish flag pattern!', time: '08:15', unread: 15 },
  { id: 'u3', type: 'personal', name: 'John Crypto', avatar: 'https://i.pravatar.cc/150?u=4', status: 'online', lastMsg: 'Gas project NFT baru?', time: '08:00', unread: 0 },
  { id: 'u4', type: 'personal', name: 'Maya PM', avatar: 'https://i.pravatar.cc/150?u=6', status: 'busy', lastMsg: 'Timeline geser ke minggu depan.', time: 'Kemarin', unread: 0 },
  { id: 'u5', type: 'personal', name: 'Eko Backend', avatar: 'https://i.pravatar.cc/150?u=5', status: 'online', lastMsg: 'API Gateway aman terkendali.', time: 'Senin', unread: 0 },
  { id: 'g3', type: 'group', name: 'Weekend Gamers 🎮', avatar: 'https://ui-avatars.com/api/?name=Weekend+Gamers&background=ec4899&color=fff', members: 12, lastMsg: 'Malam ini mabar Valorant?', time: 'Minggu', unread: 5 },
  { id: 'u6', type: 'personal', name: 'Client: TokoMaju', avatar: 'https://ui-avatars.com/api/?name=Toko+Maju&background=f59e0b&color=fff', status: 'offline', lastMsg: 'Invoice sudah cair pak.', time: 'Minggu', unread: 0 },
  { id: 'u7', type: 'personal', name: 'HRD Recruitment', avatar: 'https://ui-avatars.com/api/?name=HRD&background=ef4444&color=fff', status: 'online', lastMsg: 'Jadwal interview besok pagi.', time: 'Jumat', unread: 0 },
];

const CONTACTS = [
  { id: 101, name: 'Alex Telles', about: 'Available', avatar: 'https://i.pravatar.cc/150?u=10' },
  { id: 102, name: 'Adam Levine', about: 'Music life', avatar: 'https://i.pravatar.cc/150?u=20' },
  { id: 103, name: 'Brandon Stark', about: 'Winter is coming', avatar: 'https://i.pravatar.cc/150?u=11' },
  { id: 104, name: 'Bella Hadid', about: 'Fashion week', avatar: 'https://i.pravatar.cc/150?u=21' },
  { id: 105, name: 'Charlie Puth', about: 'At the studio 🎵', avatar: 'https://i.pravatar.cc/150?u=12' },
  { id: 106, name: 'Diana Prince', about: 'Busy saving the world', avatar: 'https://i.pravatar.cc/150?u=13' },
  { id: 107, name: 'Elon M', about: 'Mars calling', avatar: 'https://i.pravatar.cc/150?u=14' },
  { id: 108, name: 'Gwen Stacy', about: 'Spider-verse', avatar: 'https://i.pravatar.cc/150?u=22' },
  { id: 109, name: 'Harry Potter', about: 'Hogwarts', avatar: 'https://i.pravatar.cc/150?u=23' },
  { id: 110, name: 'Zendaya', about: 'Shooting movie', avatar: 'https://i.pravatar.cc/150?u=24' },
];

const INITIAL_MESSAGES = [
  { id: 1, senderId: 'other', text: 'Hey! How is the new design coming along?', time: '09:41 AM', read: true, type: 'text' },
  { id: 2, senderId: 'me', text: 'Almost done! Just tweaking the dark mode colors. 🎨', time: '09:42 AM', read: true, type: 'text' },
  { id: 3, senderId: 'other', text: 'Great! Send me a preview when you can.', time: '09:45 AM', read: true, type: 'text' },
  { id: 4, senderId: 'me', text: 'Sure, here is the landing page hero section.', time: '09:50 AM', read: true, type: 'text' },
  { id: 5, senderId: 'me', mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop', text: '', time: '09:50 AM', read: true, type: 'image' },
];

const SHARED_MEDIA = [
  { id: 1, type: 'image', src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&q=80', name: 'UI_Design_v1.png' },
  { id: 2, type: 'image', src: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=150&q=80', name: 'Mockup.jpg' },
  { id: 3, type: 'image', src: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=150&q=80', name: 'Chart_Analysis.png' },
  { id: 4, type: 'file', ext: 'PDF', name: 'Brief_Project_2025.pdf', size: '2.4 MB' },
  { id: 5, type: 'file', ext: 'ZIP', name: 'Assets_Export.zip', size: '156 MB' },
];

// Helper to generate lots of messages
const generateMessages = () => {
  const msgs = [];
  for (let i = 0; i < 20; i++) {
    const isMe = i % 3 !== 0; // Randomize sender
    msgs.push({
      id: i,
      senderId: isMe ? 'me' : 'other',
      text: isMe 
        ? `Ini adalah contoh pesan panjang ke-${i + 1} untuk mengetes tampilan UI bubble chat yang responsif.` 
        : `Balasan chat simulasi nomor ${i + 1}.`,
      time: '10:30',
      read: true,
      type: i === 5 ? 'image' : (i === 12 ? 'file' : 'text'), // Inject diverse types
      mediaUrl: i === 5 ? 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80' : null,
      fileName: i === 12 ? 'Budget_Plan_2025.xlsx' : null
    });
  }
  return msgs;
};

// const INITIAL_MESSAGES = generateMessages();

// --- UTILITY COMPONENTS ---

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

const Avatar = ({ src, className, status, onClick }: any) => (
  <div className="relative inline-block" onClick={onClick}>
    <div className={cn("relative flex shrink-0 overflow-hidden rounded-full border-2 border-white/10 shadow-sm", className)}>
      <Image height={500} width={500} className="aspect-square h-full w-full object-cover" src={src} alt="Avatar" />
    </div>
    {status && (
      <span className={cn(
        "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900",
        status === 'online' ? "bg-green-500" : 
        status === 'busy' ? "bg-red-500" : "bg-slate-400"
      )}></span>
    )}
  </div>
);

const Badge = ({ count }: { count: number }) => (
  count > 0 ? (
    <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold text-white bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/30">
      {count}
    </span>
  ) : null
);

// --- MAIN PAGE ---

export default function UltimateChatApp() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'chat' | 'details'>('list');
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  
  // -- MODALS / SIDEBAR STATE --
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); 
  const [storyIndex, setStoryIndex] = useState<number | null>(null);
  
  // -- SETTINGS SIDEBAR STATE --
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Toggle Dark Mode
  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedChat]);

  // --- LOGIC GROUPING CONTACTS ---
  const groupedContacts = useMemo(() => {
    const groups: Record<string, typeof CONTACTS> = {};
    // 1. Sort contacts A-Z
    const sorted = [...CONTACTS].sort((a, b) => a.name.localeCompare(b.name));
    
    // 2. Group by First Letter
    sorted.forEach(contact => {
      const letter = contact.name.charAt(0).toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(contact);
    });
    
    return groups;
  }, []); // Empty dependency array karena CONTACTS constant

  const sortedLetters = Object.keys(groupedContacts).sort();


  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    setMessages([...messages, {
      id: Date.now(),
      senderId: 'me',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type: 'text',
      mediaUrl: null,
    }]);
    setInputText('');
  };

  const handleChatSelect = (chat: any) => {
    setSelectedChat(chat);
    setMobileView('chat');
  };

  // -- STORY HANDLERS --
  const openStory = (index: number) => setStoryIndex(index);
  const closeStory = () => setStoryIndex(null);
  
  const nextStory = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (storyIndex !== null && storyIndex < STORIES.length - 1) {
      setStoryIndex(storyIndex + 1);
    } else {
      closeStory();
    }
  };

  const prevStory = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (storyIndex !== null && storyIndex > 0) {
      setStoryIndex(storyIndex - 1);
    }
  };

  return (
    <div className={`h-screen w-screen overflow-hidden flex transition-colors duration-500 ${isDarkMode ? 'dark bg-[#0a0a0c] text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans selection:bg-indigo-500/30`}>
      
      {/* === BACKGROUND AMBIENCE (WEB3 STYLE) === */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-violet-600/10 dark:bg-violet-900/20 rounded-full blur-[180px] animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 dark:bg-indigo-900/20 rounded-full blur-[180px] animate-pulse-slow delay-1000" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      </div>

      {/* === LEFT SIDEBAR (CHAT LIST & NEW CHAT DRAWER) === */}
      <aside className={cn(
        "flex-col h-full z-20 transition-all duration-300 border-r border-slate-200 dark:border-white/5 bg-white/60 dark:bg-[#0f1115]/80 backdrop-blur-2xl relative overflow-hidden",
        mobileView === 'list' 
          ? "flex w-full md:w-112.5 lg:w-125" 
          : "hidden md:flex md:w-112.5 lg:w-125"
      )}>
        
        {/* === STANDARD CHAT LIST CONTENT === */}
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Avatar src="https://i.pravatar.cc/150?u=me" className="w-10 h-10 ring-2 ring-indigo-500/50" status="online" />
            <div>
              <h1 className="font-bold text-lg leading-tight">Gemini Chat</h1>
              <p className="text-xs text-slate-500 font-medium">Full Stack Dev</p>
            </div>
          </div>
          <div className="flex gap-2">
            {/* --- BUTTON PLUS (TRIGGERS SIDEBAR) --- */}
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/30 transition-transform active:scale-95 flex items-center justify-center"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            >
              <Settings className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Stories / Status Bar */}
        <div className="pl-5 pb-4 shrink-0 overflow-x-auto no-scrollbar">
          <div className="flex gap-4 min-w-max pr-5">
            {STORIES.map((story, idx) => (
              <div 
                key={story.id} 
                className="flex flex-col items-center gap-1.5 cursor-pointer group"
                onClick={() => openStory(idx)} 
              >
                <div className={cn(
                  "p-0.5 rounded-full",
                  story.viewed ? "bg-slate-300 dark:bg-white/10" : "bg-linear-to-tr from-yellow-400 via-pink-500 to-indigo-500"
                )}>
                  <div className="p-0.5 bg-white dark:bg-[#0f1115] rounded-full">
                    <Avatar src={story.img} className="w-14 h-14" />
                  </div>
                </div>
                <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 group-hover:text-indigo-500 transition-colors">
                  {story.isMe ? 'Cerita Anda' : story.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="px-5 pb-2 shrink-0">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              placeholder="Search people, groups, messages..." 
              className="w-full h-11 pl-10 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/30 focus:bg-white dark:focus:bg-black/40 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400 dark:text-slate-200" 
            />
          </div>
        </div>

        {/* Chat Lists */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-6 pt-2 pb-4">
          
          {/* Pinned Section */}
          <div>
            <div className="flex items-center gap-2 px-3 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Pin className="w-3 h-3" /> Pinned
            </div>
            <div className="space-y-1">
              {PINNED_CHATS.map(chat => (
                <div 
                  key={chat.id}
                  onClick={() => handleChatSelect(chat)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border border-transparent group",
                    selectedChat?.id === chat.id 
                      ? "bg-indigo-600 shadow-lg shadow-indigo-500/30 border-indigo-500/50" 
                      : "hover:bg-slate-100 dark:hover:bg-white/5"
                  )}
                >
                  <Avatar src={chat.avatar} className="w-12 h-12" status={chat.status} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className={cn("font-semibold text-sm truncate", selectedChat?.id === chat.id ? "text-white" : "text-slate-800 dark:text-slate-100")}>{chat.name}</h3>
                      <span className={cn("text-[10px]", selectedChat?.id === chat.id ? "text-indigo-200" : "text-slate-400")}>{chat.time}</span>
                    </div>
                    <p className={cn("text-xs truncate mt-0.5", selectedChat?.id === chat.id ? "text-indigo-100" : "text-slate-500 dark:text-slate-400")}>
                      {chat.lastMsg}
                    </p>
                  </div>
                  {chat.unread > 0 && <Badge count={chat.unread} />}
                </div>
              ))}
            </div>
          </div>

          {/* All Chats Section */}
          <div>
            <div className="flex items-center gap-2 px-3 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <MessageSquare className="w-3 h-3" /> Recent Messages
            </div>
            <div className="space-y-1">
              {ALL_CHATS.map(chat => (
                <div 
                  key={chat.id}
                  onClick={() => handleChatSelect(chat)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border border-transparent group",
                    selectedChat?.id === chat.id 
                      ? "bg-indigo-600 shadow-lg shadow-indigo-500/30" 
                      : "hover:bg-slate-100 dark:hover:bg-white/5"
                  )}
                >
                  <Avatar src={chat.avatar} className="w-12 h-12" status={chat.status} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className={cn("font-semibold text-sm truncate", selectedChat?.id === chat.id ? "text-white" : "text-slate-800 dark:text-slate-100")}>{chat.name}</h3>
                      <span className={cn("text-[10px]", selectedChat?.id === chat.id ? "text-indigo-200" : "text-slate-400")}>{chat.time}</span>
                    </div>
                    <p className={cn("text-xs truncate mt-0.5", selectedChat?.id === chat.id ? "text-indigo-100" : "text-slate-500 dark:text-slate-400")}>
                      {chat.type === 'group' && <span className="font-bold text-indigo-400 mr-1">Sarah:</span>}
                      {chat.lastMsg}
                    </p>
                  </div>
                  {chat.unread > 0 && <Badge count={chat.unread} />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === NEW CHAT SIDEBAR / DRAWER (With Alphabet Grouping) === */}
        <div className={cn(
            "absolute inset-0 z-30 bg-white dark:bg-[#0f1115] transition-transform duration-300 ease-in-out flex flex-col",
            isAddModalOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            {/* Drawer Header */}
            <div className="p-4 flex items-end pb-0 shrink-0 shadow-md">
                <div className="flex items-center gap-3 text-white">
                    <button onClick={() => setIsAddModalOpen(false)} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-md font-bold">New Chat</h2>
                </div>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                
                {/* Search in Drawer */}
                <div className="p-4">
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      placeholder="Search contacts..." 
                      className="w-full h-10 pl-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-transparent focus:bg-white dark:focus:bg-black/40 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-400 dark:text-slate-200" 
                    />
                  </div>
                </div>

                {/* Main Actions */}
                <div className="px-2 space-y-1 mb-6">
                    <button className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left group">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                            <Users className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">New Group</span>
                    </button>
                    
                    <button className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left group">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                            <UserPlus className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">New Contact</span>
                    </button>
                </div>

                {/* Contact List Grouped */}
                <div className="pb-8">
                    {/* Render Grouping */}
                    {sortedLetters.map(letter => (
                       <div key={letter} className="mb-2">
                          {/* Sticky Letter Header */}
                          <div className="sticky top-0 z-10 bg-white/95 dark:bg-[#0f1115]/95 backdrop-blur-sm px-5 py-2 text-xs font-bold text-indigo-500 dark:text-indigo-400 border-b border-indigo-50 dark:border-white/5 mb-2">
                             {letter}
                          </div>
                          
                          {/* Contacts for this letter */}
                          <div className="px-4 space-y-4">
                             {groupedContacts[letter].map(contact => (
                                <div key={contact.id} className="flex items-center gap-4 cursor-pointer group">
                                   <Avatar src={contact.avatar} className="w-10 h-10" />
                                   <div className="flex-1 border-b border-slate-100 dark:border-white/5 pb-3 group-last:border-0">
                                      <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{contact.name}</h4>
                                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{contact.about}</p>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>
                    ))}
                </div>
            </div>
        </div>

      </aside>

      {/* === SETTINGS SIDEBAR (Full Overlay) === */}
      {isSettingsOpen && (
        <div className="absolute inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="flex-1 bg-black/20 backdrop-blur-sm animate-in fade-in"
            onClick={() => setIsSettingsOpen(false)}
          ></div>
          
          {/* Sidebar Panel */}
          <div className="w-125 h-full bg-white dark:bg-[#0f1115] border-r border-slate-200 dark:border-white/5 shadow-2xl flex flex-col absolute left-0 animate-in slide-in-from-left duration-300">
              
             {/* Header */}
             <div className="h-19 px-6 flex items-center justify-between border-b border-slate-200/50 dark:border-white/5">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Settings</h2>
                <button onClick={() => setIsSettingsOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors">
                   <ArrowLeft className="w-5 h-5" />
                </button>
             </div>

             {/* Content */}
             <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                
                {/* Profile Section */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                   <Avatar src="https://i.pravatar.cc/150?u=me" className="w-16 h-16" />
                   <div>
                      <h3 className="font-bold text-lg text-slate-800 dark:text-white">Gemini Dev</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">+62 812 3456 7890</p>
                      <p className="text-xs text-indigo-500 mt-1 cursor-pointer hover:underline">Edit Profile</p>
                   </div>
                </div>

                {/* Settings Menu */}
                <div className="space-y-1">
                   {[
                      { icon: UserPlus, label: 'Account', sub: 'Privacy, Security, Change Number' },
                      { icon: MessageSquare, label: 'Chats', sub: 'Theme, Wallpapers, Chat History' },
                      { icon: Bell, label: 'Notifications', sub: 'Message, Group & Call Tones' },
                      { icon: Globe, label: 'App Language', sub: 'English (device\'s language)' },
                      { icon: FileText, label: 'Storage and Data', sub: 'Network usage, auto-download' },
                   ].map((item, i) => (
                      <button key={i} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left group">
                          <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 group-hover:text-indigo-500 group-hover:bg-indigo-500/10 transition-colors">
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div>
                             <p className="font-semibold text-sm text-slate-700 dark:text-slate-200">{item.label}</p>
                             <p className="text-xs text-slate-400 dark:text-slate-500">{item.sub}</p>
                          </div>
                      </button>
                   ))}
                </div>

                {/* Others */}
                <div className="space-y-1 pt-4 border-t border-slate-100 dark:border-white/5">
                   <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left group">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 group-hover:text-amber-500 group-hover:bg-amber-500/10 transition-colors">
                         <Shield className="w-5 h-5" />
                      </div>
                      <p className="font-semibold text-sm text-slate-700 dark:text-slate-200">Help</p>
                   </button>
                   <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left group">
                      <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
                         <LogOut className="w-5 h-5" />
                      </div>
                      <p className="font-semibold text-sm text-red-500">Log Out</p>
                   </button>
                </div>

             </div>
          </div>
        </div>
      )}

      {/* === CENTER MAIN CHAT === */}
      <main className={cn(
        "flex-1 flex flex-col h-full relative z-10 bg-slate-50/50 dark:bg-[#0a0a0c]/50 backdrop-blur-xl transition-all",
        mobileView === 'list' ? "hidden md:flex" : "flex",
        showRightPanel ? "lg:mr-0" : "" // Adjust if needed
      )}>
        
        {selectedChat ? (
          <>
            {/* Glassy Header */}
            <header className="h-19 px-6 flex items-center justify-between border-b border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-[#0f1115]/60 backdrop-blur-md sticky top-0 z-30">
              <div className="flex items-center gap-4">
                <button className="md:hidden -ml-2 p-2 rounded-full hover:bg-white/10" onClick={() => { setMobileView('list'); setSelectedChat(null); }}>
                  <ArrowLeft className="w-5 h-5 text-slate-500" />
                </button>
                
                <div className="relative cursor-pointer" onClick={() => setShowRightPanel(!showRightPanel)}>
                  <Avatar src={selectedChat.avatar} className="w-10 h-10" />
                  {selectedChat.type === 'group' && (
                    <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full p-0.5 border border-slate-700">
                      <Users className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                <div className="cursor-pointer" onClick={() => setShowRightPanel(!showRightPanel)}>
                  <h2 className="font-bold text-base text-slate-800 dark:text-slate-100 leading-tight hover:text-indigo-500 transition-colors">{selectedChat.name}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    {selectedChat.type === 'group' ? (
                       <>{selectedChat.members} members • <span className="text-green-500">5 Online</span></>
                    ) : (
                       <><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online</>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <button className="p-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-all hover:text-indigo-500">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-all hover:text-indigo-500">
                  <Video className="w-5 h-5" />
                </button>
                <div className="h-6 w-px bg-slate-300 dark:bg-white/10 mx-1"></div>
                <button 
                  onClick={() => setShowRightPanel(!showRightPanel)}
                  className={cn("p-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-all", showRightPanel && "bg-indigo-500/10 text-indigo-500")}
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar scroll-smooth">
              <div className="flex justify-center my-6">
                <span className="px-4 py-1.5 rounded-full bg-slate-200/50 dark:bg-white/5 text-[11px] font-bold text-slate-500 dark:text-slate-400 border border-white/10 backdrop-blur-sm">
                  YESTERDAY
                </span>
              </div>
              
              {messages.map((msg, idx) => {
                const isMe = msg.senderId === 'me';
                const showAvatar = !isMe && (idx === messages.length - 1 || messages[idx + 1]?.senderId !== msg.senderId);

                return (
                  <div key={msg.id} className={cn("flex w-full group", isMe ? "justify-end" : "justify-start")}>
                    <div className={cn("flex max-w-[85%] lg:max-w-[65%] gap-3", isMe ? "flex-row-reverse" : "flex-row")}>
                      
                      {/* Avatar placeholder to keep alignment */}
                      <div className="w-8 shrink-0 flex flex-col justify-end">
                        {showAvatar && <Avatar src={selectedChat.avatar} className="w-8 h-8" />}
                      </div>

                      <div className="flex flex-col gap-1">
                        {!isMe && showAvatar && (
                          <span className="text-[10px] text-slate-400 ml-1 mb-0.5">Sarah Design</span>
                        )}
                        
                        <div className={cn(
                          "relative px-4 py-3 shadow-sm text-[15px] leading-relaxed transition-all duration-200",
                          isMe 
                            ? "bg-linear-to-br from-indigo-600 to-violet-600 text-white rounded-2xl rounded-tr-sm" 
                            : "bg-white dark:bg-[#1c1f26] border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 rounded-2xl rounded-tl-sm hover:border-slate-300 dark:hover:border-white/20"
                        )}>
                          {/* Image Attachment */}
                          {msg.type === 'image' && msg.mediaUrl && (
                             <div className="mb-2 rounded-lg overflow-hidden relative group/img cursor-pointer">
                                <Image height={500} width={500} src={msg.mediaUrl} className="w-full h-auto object-cover max-h-60" alt="attachment" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                  <Download className="w-6 h-6 text-white" />
                                </div>
                             </div>
                          )}

                          {/* File Attachment */}
                          {msg.type === 'file' && (
                            <div className="flex items-center gap-3 p-3 bg-black/20 rounded-xl mb-1 cursor-pointer hover:bg-black/30 transition-colors">
                               <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-300">
                                  <FileText className="w-5 h-5" />
                               </div>
                               <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm truncate">Project_File.zip</p>
                                  <p className="text-[10px] opacity-70">2.4 MB • ZIP Archive</p>
                               </div>
                               <Download className="w-4 h-4 opacity-70" />
                            </div>
                          )}

                          <p>{msg.text}</p>
                          
                          <div className={cn("flex items-center justify-end gap-1 mt-1 text-[10px]", isMe ? "text-indigo-200" : "text-slate-400")}>
                            <span>{msg.time}</span>
                            {isMe && (msg.read ? <CheckCheck className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />)}
                          </div>
                        </div>

                        {/* Reaction Mockup */}
                        {!isMe && Math.random() > 0.7 && (
                           <div className="self-start -mt-2 ml-2 bg-white dark:bg-slate-800 rounded-full px-1.5 py-0.5 border border-slate-200 dark:border-white/10 shadow-sm z-10 text-xs">
                             ❤️ 🔥
                           </div>
                        )}
                      </div>
                      
                      {/* Action buttons on hover */}
                      <div className={cn("opacity-0 group-hover:opacity-100 transition-opacity flex items-center self-center", isMe ? "mr-2" : "ml-2")}>
                         <button className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                            <Smile className="w-4 h-4" />
                         </button>
                         <button className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                            <Share2 className="w-4 h-4" />
                         </button>
                      </div>

                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Floating Bar */}
            <div className="p-4 md:px-6 md:pb-6 relative z-20">
              <form onSubmit={handleSendMessage} className="relative flex items-end gap-2 p-1.5 bg-white/80 dark:bg-[#15171c]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl shadow-indigo-500/5">
                
                <div className="flex items-center gap-1 pl-2 pb-2">
                   <button type="button" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors">
                      <Plus className="w-5 h-5" />
                   </button>
                   <button type="button" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors hidden md:block">
                      <ImageIcon className="w-5 h-5" />
                   </button>
                </div>

                <div className="flex-1 min-w-0 py-2">
                  <input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full bg-transparent border-none focus:ring-0 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 px-2"
                    autoComplete="off"
                  />
                </div>

                <div className="flex items-center gap-1 pr-1 pb-1">
                   <button type="button" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors">
                      <Smile className="w-5 h-5" />
                   </button>
                   {inputText.trim() ? (
                      <button type="submit" className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg shadow-indigo-500/40 transition-all active:scale-95">
                        <Send className="w-4 h-4" />
                      </button>
                   ) : (
                      <button type="button" className="p-3 bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-300 dark:hover:bg-white/20 transition-all">
                        <Mic className="w-4 h-4" />
                      </button>
                   )}
                </div>
              </form>
            </div>
          </>
        ) : (
          /* EMPTY STATE */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-32 h-32 relative mb-6">
               <div className="absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full animate-pulse"></div>
               <div className="relative z-10 w-full h-full bg-linear-to-tr from-indigo-500 to-violet-600 rounded-3xl flex items-center justify-center shadow-2xl rotate-3 transform hover:rotate-6 transition-transform duration-500">
                  <MessageSquare className="w-14 h-14 text-white" />
               </div>
            </div>
            <h2 className="text-3xl font-bold mb-3 text-slate-800 dark:text-white">Selamat Datang di Gemini Chat</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md leading-relaxed mb-8">
              Platform komunikasi Web3 yang aman, cepat, dan modern.
              <br/>Mulai percakapan dengan memilih kontak di sebelah kiri.
            </p>
            <button className="px-6 py-3 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white font-medium transition-all flex items-center gap-2">
              <Settings className="w-4 h-4" /> Personalize Theme
            </button>
          </div>
        )}
      </main>

{/* === RIGHT SIDEBAR (DETAILS PANEL) === */}
      {selectedChat && showRightPanel && (
        <aside className={cn(
          // Base Styles
          "h-full z-50 flex flex-col transition-all duration-300 border-l border-slate-200 dark:border-white/5",
          
          // MOBILE VIEW (Full Screen Overlay)
          "fixed inset-0 w-full bg-white/95 dark:bg-[#0f1115]/95 backdrop-blur-xl",
          
          // DESKTOP VIEW (Sidebar Mode)
          // Menggunakan lg:w-[400px] agar pas dengan sidebar kiri yang sudah dilebarkan sebelumnya
          "lg:relative lg:w-100 lg:bg-white/60 lg:dark:bg-[#0f1115]/80 lg:backdrop-blur-2xl" 
        )}>
          
          {/* Header Right */}
          <div className="h-19 flex items-center px-6 border-b border-slate-200/50 dark:border-white/5 font-bold text-lg shrink-0">
             <span className="text-slate-800 dark:text-white">Directory</span>
             {/* Tombol Close (Hanya muncul di Mobile karena ada lg:hidden) */}
             <button 
                onClick={() => setShowRightPanel(false)} 
                className="ml-auto lg:hidden p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
             >
                <X className="w-6 h-6 text-slate-500 dark:text-slate-300"/>
             </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
              
              {/* Profile Info */}
              <div className="flex flex-col items-center text-center">
                 <Avatar src={selectedChat.avatar} className="w-24 h-24 mb-4 ring-4 ring-slate-100 dark:ring-white/5 shadow-xl" status={selectedChat.status} />
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{selectedChat.name}</h3>
                 <p className="text-sm text-slate-500 dark:text-slate-400">@username_handle</p>
                 <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    Building the future of web development with strict deadlines. 🚀
                 </p>
                 
                 <div className="flex gap-4 mt-6 w-full">
                    <button className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors flex flex-col items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                       <Bell className="w-5 h-5 mb-1" />
                       Mute
                    </button>
                    <button className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors flex flex-col items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                       <Search className="w-5 h-5 mb-1" />
                       Search
                    </button>
                    <button className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors flex flex-col items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                       <Heart className="w-5 h-5 mb-1" />
                       Fav
                    </button>
                 </div>
              </div>

              {/* Shared Media */}
              <div>
                 <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-sm text-slate-400 uppercase tracking-wider">Shared Media</h4>
                    <button className="text-indigo-500 text-xs hover:underline">View All</button>
                 </div>
                 <div className="grid grid-cols-3 gap-2">
                    {SHARED_MEDIA.filter(m => m.type === 'image').map((media) => (
                       <div key={media.id} className="aspect-square rounded-lg overflow-hidden relative group cursor-pointer bg-slate-100 dark:bg-white/5">
                          {/* Menggunakan img standard jika Image component error, atau sesuaikan dengan Next/React Image */}
                          <Image height={500} width={500} src={media.src} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="media" />
                       </div>
                    ))}
                 </div>
              </div>

              {/* Shared Files */}
              <div>
                 <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-sm text-slate-400 uppercase tracking-wider">Documents</h4>
                 </div>
                 <div className="space-y-3">
                    {SHARED_MEDIA.filter(m => m.type === 'file').map((file) => (
                       <div key={file.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer transition-colors group">
                          <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg text-indigo-600 dark:text-indigo-300">
                             <FileText className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                             <p className="text-sm font-medium truncate text-slate-800 dark:text-slate-200">{file.name}</p>
                             <p className="text-[10px] text-slate-500">{file.size} • PDF</p>
                          </div>
                          <Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                       </div>
                    ))}
                 </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-white/10 pb-6">
                 <button className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium">
                    <LogOut className="w-4 h-4" /> Block User
                 </button>
              </div>

          </div>
        </aside>
      )}

      {/* ================= STORY VIEWER MODAL ================= */}
      {storyIndex !== null && (
        <div className="fixed inset-0 z-60 bg-black flex items-center justify-center animate-in fade-in duration-300">
            {/* Background Blur */}
            <div className="absolute inset-0 opacity-40 bg-center bg-cover blur-3xl scale-110" style={{ backgroundImage: `url(${STORIES[storyIndex].img})` }}></div>
            
            {/* Main Content Container */}
            <div className="relative w-full h-full md:max-w-md md:h-[90vh] bg-black md:rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-white/10 z-10">
                
                {/* Progress Bars */}
                <div className="absolute top-0 left-0 right-0 p-3 z-30 flex gap-1.5">
                    {STORIES.map((_, idx) => (
                        <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                            <div className={cn("h-full bg-white transition-all duration-300", idx < storyIndex ? "w-full" : idx === storyIndex ? "w-1/2" : "w-0")}></div>
                        </div>
                    ))}
                </div>

                {/* Header Story */}
                <div className="absolute top-4 left-0 right-0 p-4 z-30 flex items-center justify-between pt-6">
                    <div className="flex items-center gap-3">
                        <Avatar src={STORIES[storyIndex].img} className="w-10 h-10 border border-white/20" />
                        <div>
                            <p className="text-white font-bold text-sm shadow-black drop-shadow-md">{STORIES[storyIndex].name}</p>
                            <p className="text-white/70 text-xs shadow-black drop-shadow-md">{STORIES[storyIndex].time}</p>
                        </div>
                    </div>
                    <button onClick={closeStory} className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-colors"><X className="w-6 h-6" /></button>
                </div>

                {/* Image / Content */}
                <div className="flex-1 relative flex items-center justify-center bg-black">
                      <Image fill src={STORIES[storyIndex].img} className="w-full h-auto max-h-full object-contain" alt="Story Content" />
                      <div className="absolute inset-y-0 left-0 w-1/3 z-20 cursor-pointer" onClick={prevStory}></div>
                      <div className="absolute inset-y-0 right-0 w-1/3 z-20 cursor-pointer" onClick={nextStory}></div>
                </div>

                {/* Footer Reply Input */}
                <div className="p-4 z-30 bg-linear-to-t from-black/80 to-transparent pb-8 md:pb-6">
                    <div className="flex items-center gap-3">
                        <input type="text" placeholder="Kirim pesan..." className="flex-1 bg-transparent border border-white/30 rounded-full py-3 px-5 text-white placeholder:text-white/60 focus:border-white outline-none backdrop-blur-md text-sm" />
                        <button className="p-3 rounded-full border border-white/30 text-white hover:bg-white/20 backdrop-blur-md"><Heart className="w-5 h-5" /></button>
                        <button className="p-3 rounded-full border border-white/30 text-white hover:bg-white/20 backdrop-blur-md"><Send className="w-5 h-5" /></button>
                    </div>
                </div>
            </div>

            {/* Desktop Navigation Buttons Outside */}
            <button onClick={prevStory} className="hidden md:flex absolute left-8 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md disabled:opacity-0 transition-all z-20" disabled={storyIndex === 0}>
                <ChevronLeft className="w-8 h-8" />
            </button>
            <button onClick={nextStory} className="hidden md:flex absolute right-8 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md disabled:opacity-0 transition-all z-20" disabled={storyIndex === STORIES.length - 1}>
                <ChevronRight className="w-8 h-8" />
            </button>
        </div>
      )}

      {/* Global Styles */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.2); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(99, 102, 241, 0.5); }

        .animate-pulse-slow { animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

