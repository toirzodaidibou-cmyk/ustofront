import React from 'react';
import { UserProfile } from '@/store/useAuthStore';
import { ShieldCheck, Star, MapPin, CalendarClock, ChevronRight, Bookmark, Search, Zap, Car, Droplets, Wind, Sofa, CheckCircle2, Circle, MessageCircle, Info } from 'lucide-react';
import Link from 'next/link';

interface ClientDashboardProps {
  profile: any;
  bookings?: any[];
  setActiveSection: (s: 'bookings' | 'wallet' | 'chat') => void;
}

export function ClientDashboard({ profile, bookings = [], setActiveSection }: ClientDashboardProps) {
  // Check user activity to determine if it's a completely fresh account
  const activeBookingsCount = bookings.filter(b => b.status === 'pending' || b.status === 'accepted').length;
  const hasHistory = bookings.length > 0; 
  const favoriteMasters: any[] = []; // Clear fake data

  // Profile completion calculation
  let completedSteps = 0;
  const totalSteps = 4;
  
  if (profile.avatar) completedSteps++;
  if (profile.city) completedSteps++;
  if (profile.phone) completedSteps++; // Phone is verified via login
  if (hasHistory) completedSteps++; // First order created

  const completionPercent = Math.round((completedSteps / totalSteps) * 100);
  const isFresh = completionPercent < 100 && !hasHistory;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      
      {/* Left Col: Info & Quick Stats / Onboarding */}
      <div className="xl:col-span-1 space-y-6">
        
        {/* Onboarding / Profile Summary Card */}
        <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl"></div>
          
          {isFresh ? (
            <div className="relative z-10 space-y-5">
              <div>
                <h3 className="font-black text-[#1a1a1a] text-lg">Пурракунии профил</h3>
                <p className="text-xs text-gray-500 font-medium mt-1">Барои таҷрибаи беҳтарин профилро пур кунед.</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className={completionPercent === 100 ? "text-green-600" : "text-orange-600"}>{completionPercent}%</span>
                  <span className="text-gray-400">100%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${completionPercent === 100 ? "bg-green-500" : "bg-orange-500"}`}
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  {profile.avatar ? <CheckCircle2 size={18} className="text-green-500" /> : <Circle size={18} className="text-gray-300" />}
                  <span className={`text-sm font-semibold ${profile.avatar ? "text-gray-400 line-through" : "text-gray-700"}`}>Иловаи сурати профил</span>
                </div>
                <div className="flex items-center gap-3">
                  {profile.city ? <CheckCircle2 size={18} className="text-green-500" /> : <Circle size={18} className="text-gray-300" />}
                  <span className={`text-sm font-semibold ${profile.city ? "text-gray-400 line-through" : "text-gray-700"}`}>Интихоби шаҳр</span>
                </div>
                <div className="flex items-center gap-3">
                  {profile.phone ? <CheckCircle2 size={18} className="text-green-500" /> : <Circle size={18} className="text-gray-300" />}
                  <span className={`text-sm font-semibold ${profile.phone ? "text-gray-400 line-through" : "text-gray-700"}`}>Тасдиқи рақами телефон</span>
                </div>
                <div className="flex items-center gap-3">
                  {hasHistory ? <CheckCircle2 size={18} className="text-green-500" /> : <Circle size={18} className="text-gray-300" />}
                  <span className={`text-sm font-semibold ${hasHistory ? "text-gray-400 line-through" : "text-gray-700"}`}>Аввалин фармоиш</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative z-10 space-y-4">
              <h3 className="font-bold text-[#1a1a1a] text-lg mb-2">Маълумоти Мизоҷ</h3>
              <div className="flex justify-between items-center border-b border-black/5 pb-3">
                <span className="text-[#666666] text-sm font-medium">Шаҳр / Суроға</span>
                <span className="font-semibold text-[#1a1a1a] text-sm flex items-center gap-1">
                  <MapPin size={14} className="text-orange-500" /> {profile.city || 'Муайян нашудааст'}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3">
                <span className="text-[#666666] text-sm font-medium">Индекси боварӣ</span>
                <span className="font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-lg text-sm border border-green-200">
                  {profile.trustScore || 100}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Active Bookings Widget */}
        <div className="bg-gradient-to-br from-[#111] to-[#222] rounded-[2rem] p-6 text-white shadow-xl shadow-black/10 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 text-white/5">
            <CalendarClock size={120} />
          </div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4">
              <CalendarClock className="text-orange-500" size={24} />
            </div>
            
            {activeBookingsCount > 0 ? (
              <>
                <h3 className="font-bold text-2xl tracking-tight mb-1">
                  {activeBookingsCount} Фармоиш
                </h3>
                <p className="text-white/70 text-sm font-medium mb-6">Дар ҳолати иҷро қарор дорад.</p>
                <button 
                  onClick={() => setActiveSection('bookings')} 
                  className="w-full bg-orange-500 text-white font-bold py-3.5 rounded-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                >
                  Идоракунӣ <ChevronRight size={16} />
                </button>
              </>
            ) : (
              <>
                <h3 className="font-bold text-xl tracking-tight mb-1">Ҳоло фармоиш нест</h3>
                <p className="text-white/60 text-xs font-medium mb-6">Устоҳои беҳтаринро барои кори худ пайдо кунед.</p>
                <Link 
                  href="/search" 
                  className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-orange-500/20"
                >
                  Аввалин Фармоиш <Search size={14} />
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Escrow Quick Access */}
        <div className="bg-orange-50 border border-orange-500/20 rounded-[2rem] p-6">
          <h3 className="font-bold text-orange-900 text-base mb-1">Тавозуни Escrow</h3>
          {!hasHistory ? (
            <>
              <p className="text-xl font-black text-orange-600/50 mb-4 border-b border-orange-200/50 pb-4">0 TJS</p>
              <div className="flex items-start gap-3">
                <Info size={16} className="text-orange-500 mt-0.5 shrink-0" />
                <p className="text-xs text-orange-800 font-medium">Шумо ҳоло пардохтҳои фаъол надоред. Системаи Escrow пули шуморо то анҷоми кор ҳифз мекунад.</p>
              </div>
            </>
          ) : (
            <>
              <p className="text-2xl font-black text-orange-600 mb-4">{profile.walletBalance || 0} TJS</p>
              <button 
                onClick={() => setActiveSection('wallet')} 
                className="w-full bg-white text-orange-600 font-bold py-3 rounded-xl hover:bg-orange-100 transition-colors border border-orange-200 text-sm"
              >
                Пур кардани ҳамён
              </button>
            </>
          )}
        </div>

        {/* Chat Widget */}
        <div className="bg-white rounded-[2rem] border border-black/5 p-6 text-center">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <MessageCircle className="text-blue-500" size={24} />
          </div>
          <h3 className="font-bold text-[#1a1a1a] text-sm mb-1">Сӯҳбатҳо</h3>
          <p className="text-xs text-gray-500 mb-4">Шумо ҳоло ягон сӯҳбат надоред.</p>
          <Link href="/search" className="inline-flex bg-zinc-100 text-[#1a1a1a] hover:bg-zinc-200 font-bold py-2.5 px-6 rounded-xl transition-all text-xs">
            Ёфтани Усто
          </Link>
        </div>

      </div>

      {/* Right Col: Welcome Banner, Categories & Favorites */}
      <div className="xl:col-span-2 space-y-6">
        
        {/* Fresh Welcome Banner */}
        {isFresh && (
          <div className="bg-gradient-to-r from-orange-500 to-rose-500 rounded-[2rem] p-8 sm:p-10 text-white relative overflow-hidden shadow-xl shadow-orange-500/10">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-1/4 translate-y-1/4">
              <ShieldCheck size={200} />
            </div>
            <div className="relative z-10 max-w-lg">
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4 inline-block backdrop-blur-md">Мизоҷи Нав</span>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">Хуш омадед ба UstoTJ 👋</h1>
              <p className="text-white/90 text-sm sm:text-base font-medium mb-8 leading-relaxed">
                Шумо ҳоло ягон фармоиш надоред. Платформаи рақами 1-и Тоҷикистон барои ёфтани устоҳои санҷидашуда дар хизмати шумост.
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/search" className="bg-white text-orange-600 hover:bg-orange-50 transition-colors font-bold px-6 py-3.5 rounded-xl text-sm flex items-center gap-2 shadow-lg">
                  <Search size={16} /> Ёфтани усто
                </Link>
                <Link href="/" className="bg-black/20 text-white hover:bg-black/30 transition-colors font-bold px-6 py-3.5 rounded-xl text-sm backdrop-blur-md">
                  Чӣ тавр кор мекунад
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Categories Recommendations for New Users */}
        {isFresh && (
          <div className="bg-white rounded-[2rem] border border-black/5 p-6 sm:p-8">
            <h2 className="font-bold text-[#1a1a1a] text-xl mb-1">Аввал категорияро интихоб кунед</h2>
            <p className="text-sm text-gray-500 mb-6">Барои шумо чӣ гуна усто лозим аст?</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Link href="/search?category=electrician" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-zinc-50 hover:bg-yellow-50 hover:text-yellow-600 transition-colors border border-black/5 group text-center cursor-pointer">
                <Zap size={28} className="text-zinc-400 group-hover:text-yellow-500 mb-2 transition-colors" />
                <span className="text-xs font-bold text-zinc-700 group-hover:text-yellow-700">Электрик</span>
              </Link>
              <Link href="/search?category=mechanic" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-zinc-50 hover:bg-blue-50 hover:text-blue-600 transition-colors border border-black/5 group text-center cursor-pointer">
                <Car size={28} className="text-zinc-400 group-hover:text-blue-500 mb-2 transition-colors" />
                <span className="text-xs font-bold text-zinc-700 group-hover:text-blue-700">Устои мошин</span>
              </Link>
              <Link href="/search?category=plumber" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-zinc-50 hover:bg-cyan-50 hover:text-cyan-600 transition-colors border border-black/5 group text-center cursor-pointer">
                <Droplets size={28} className="text-zinc-400 group-hover:text-cyan-500 mb-2 transition-colors" />
                <span className="text-xs font-bold text-zinc-700 group-hover:text-cyan-700">Сантехник</span>
              </Link>
              <Link href="/search?category=ac" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-zinc-50 hover:bg-sky-50 hover:text-sky-600 transition-colors border border-black/5 group text-center cursor-pointer">
                <Wind size={28} className="text-zinc-400 group-hover:text-sky-500 mb-2 transition-colors" />
                <span className="text-xs font-bold text-zinc-700 group-hover:text-sky-700">Кондиционер</span>
              </Link>
              <Link href="/search?category=furniture" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-zinc-50 hover:bg-amber-50 hover:text-amber-600 transition-colors border border-black/5 group text-center cursor-pointer">
                <Sofa size={28} className="text-zinc-400 group-hover:text-amber-500 mb-2 transition-colors" />
                <span className="text-xs font-bold text-zinc-700 group-hover:text-amber-700">Мебел</span>
              </Link>
              <Link href="/search" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-zinc-50 hover:bg-orange-50 hover:text-orange-600 transition-colors border border-black/5 group text-center cursor-pointer">
                <Search size={28} className="text-zinc-400 group-hover:text-orange-500 mb-2 transition-colors" />
                <span className="text-xs font-bold text-zinc-700 group-hover:text-orange-700">Ҳамаи касбҳо</span>
              </Link>
            </div>
          </div>
        )}

        {/* Saved / Favorite Masters (Only show if not fresh or if they actually have favorites) */}
        {(!isFresh || favoriteMasters.length > 0) && (
          <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6 border-b border-black/5 pb-4">
              <div>
                <h2 className="font-bold text-[#1a1a1a] text-xl flex items-center gap-2">
                  <Bookmark className="text-orange-500 fill-orange-100" size={22} /> Устоҳои сабтшуда
                </h2>
                <p className="text-sm text-gray-500 mt-1">Устоҳое, ки шумо барои оянда нигоҳ доштаед.</p>
              </div>
              <Link href="/search" className="hidden sm:flex text-orange-600 text-sm font-bold items-center gap-1 hover:text-orange-700 transition-colors">
                Ҷустуҷӯи нав <Search size={14} />
              </Link>
            </div>

            {favoriteMasters.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favoriteMasters.map(master => (
                  <Link 
                    href={`/masters/${master.id}`} 
                    key={master.id}
                    className="group p-4 rounded-2xl border border-black/5 hover:border-orange-500/30 hover:shadow-md hover:bg-orange-50/30 transition-all flex items-center gap-4 cursor-pointer"
                  >
                    <img src={master.avatar} alt={master.name} className="w-14 h-14 rounded-full bg-gray-100 border border-black/5 group-hover:scale-105 transition-transform" />
                    <div>
                      <h4 className="font-bold text-[#1a1a1a] text-sm group-hover:text-orange-600 transition-colors">{master.name}</h4>
                      <p className="text-xs text-gray-500 font-medium mb-1">{master.profession}</p>
                      <div className="flex items-center gap-1 text-xs font-bold text-orange-600">
                        <Star size={12} className="fill-orange-500" /> {master.rating}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <Bookmark size={32} className="text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-bold text-gray-700 mb-1">Устоҳои сабтшуда нест</p>
                <p className="text-xs text-gray-500 mb-4">Устоҳои беҳтаринро пайдо кунед ва нигоҳ доред.</p>
                <Link href="/search" className="inline-flex bg-white text-orange-600 border border-black/5 font-bold py-2 px-4 rounded-xl shadow-sm hover:shadow-md transition-all text-sm">
                  Ба ҷустуҷӯ гузаред
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Security Banner (Shown for existing users mostly) */}
        {!isFresh && (
          <div className="bg-[#FAF9F6] rounded-[2rem] border border-black/5 overflow-hidden flex flex-col md:flex-row items-center gap-6 p-8">
            <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center shrink-0 border border-black/5">
              <ShieldCheck className="text-green-500 w-10 h-10" />
            </div>
            <div className="text-center md:text-left flex-1">
              <h2 className="text-xl font-bold text-[#1a1a1a] mb-2">Бехатарии шумо кафолат дода мешавад</h2>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                Тавассути UstoTJ фармоиш диҳед ва маблағи шумо дар системаи <strong>Escrow</strong> нигоҳ дошта мешавад. Агар кор дуруст анҷом наёбад, маблағ 100% бармегардад.
              </p>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

