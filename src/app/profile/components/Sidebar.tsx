import React from 'react';
import Link from 'next/link';
import { Home, LogOut, Video, ShieldCheck, Send, BadgeCheck, MessageSquare, Briefcase, CalendarClock, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';

interface SidebarProps {
  activeSection: 'dashboard' | 'bookings' | 'wallet';
  setActiveSection: (section: 'dashboard' | 'bookings' | 'wallet') => void;
  bookingsCount: number;
  role?: 'client' | 'master';
}

export function Sidebar({ activeSection, setActiveSection, bookingsCount, role = 'client' }: SidebarProps) {
  const router = useRouter();

  return (
    <div className="w-[280px] bg-[#111] text-white border-r border-black/5 flex flex-col justify-between hidden xl:flex relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
      <div className="p-8">
        <Link href="/" className="text-2xl font-black tracking-tight text-white mb-10 flex items-center gap-2">
          Usto<span className="text-orange-500">TJ</span> 
          {role === 'master' && <BadgeCheck size={18} className="text-orange-500 fill-orange-500/20" />}
        </Link>
        
        <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4">Менюи Асосӣ</p>
        
        <nav className="space-y-1.5">
          <button 
            onClick={() => setActiveSection('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all cursor-pointer ${
              activeSection === 'dashboard' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Home size={18} /> Панели асосӣ
          </button>
          
          <button 
            onClick={() => setActiveSection('bookings')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold transition-all cursor-pointer ${
              activeSection === 'bookings' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-3">
              <CalendarClock size={18} /> {role === 'client' ? 'Фармоишҳои ман' : 'Дархостҳо'}
            </span>
            {bookingsCount > 0 && (
              <span className={`text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black ${
                activeSection === 'bookings' ? 'bg-white text-orange-600' : 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
              }`}>
                {bookingsCount}
              </span>
            )}
          </button>

          <Link href="/chat" className="w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-white/60 hover:bg-white/5 hover:text-white transition-all cursor-pointer">
            <span className="flex items-center gap-3">
              <MessageSquare size={18} /> Чат
            </span>
            <span className="bg-blue-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-md shadow-blue-500/30">
              2
            </span>
          </Link>

          <button 
            onClick={() => setActiveSection('wallet')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold transition-all cursor-pointer ${
              activeSection === 'wallet' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-3">
              <CreditCard size={18} /> Ҳамён / Escrow
            </span>
          </button>
        </nav>

        <p className="text-xs font-bold text-white/40 uppercase tracking-wider mt-10 mb-4">Муфид</p>
        <nav className="space-y-1.5">
          <Link href="/reels" className="w-full flex items-center gap-3 text-white/60 hover:bg-white/5 hover:text-white px-4 py-3 rounded-2xl font-semibold transition-all">
            <Video size={18} /> Видеоҳо (Reels)
          </Link>

          <button 
            onClick={() => alert("Ботро дар Telegram оғоз кунед: @UstoTJ_Bot")}
            className="w-full mt-2 flex items-center justify-between px-4 py-3 rounded-2xl font-semibold transition-all cursor-pointer bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white group"
          >
            <span className="flex items-center gap-3">
              <Send size={18} /> Bot Telegram
            </span>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse group-hover:bg-white"></span>
          </button>
        </nav>

      </div>
      
      <div className="p-8">
        <button 
          onClick={() => { authService.logout(); router.push('/login'); }} 
          className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-red-500/10 text-white/60 hover:text-red-400 px-4 py-3.5 rounded-2xl font-bold transition-all cursor-pointer"
        >
          <LogOut size={18} /> Баромадан
        </button>
      </div>
    </div>
  );
}
