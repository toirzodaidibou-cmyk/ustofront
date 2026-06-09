import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { 
  Briefcase, Star, ShieldCheck, FileCheck,
  Clock, Plus, Loader2, Video, Eye, Heart, Trash2, Image as ImageIcon, 
  DollarSign, CheckCircle2, Activity, Wallet, Power, Camera, MapPin, Phone
} from 'lucide-react';
import { UserProfile } from '@/store/useAuthStore';
import { MasterPhotoData, mastersApi } from '@/services/masters.service';
import { reelsApi } from '@/services/reels.service';

interface MasterDashboardProps {
  profile: any;
  currentUser: UserProfile;
  photos: MasterPhotoData[];
  myReels: any[];
  setActiveSection: (s: 'bookings' | 'wallet') => void;
  isPhotoUploading: boolean;
  handleAddPhoto: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeletePhoto: (photoId: string) => void;
  setShowAddReelModal: (show: boolean) => void;
}

export function MasterDashboard({
  profile,
  currentUser,
  photos,
  myReels,
  setActiveSection,
  isPhotoUploading,
  handleAddPhoto,
  handleDeletePhoto,
  setShowAddReelModal
}: MasterDashboardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAvailable, setIsAvailable] = useState(currentUser.isAvailable ?? true);

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    let score = 0;
    if (currentUser.firstName && currentUser.lastName) score += 10;
    if (currentUser.profession) score += 15;
    if (currentUser.city) score += 10;
    if (currentUser.phone) score += 15;
    if (currentUser.avatar && !currentUser.avatar.includes('dicebear')) score += 15;
    if (currentUser.passportPhoto) score += 15;
    if (photos.length > 0) score += 10;
    if (myReels.length > 0) score += 10;
    return score;
  };
  const completionPercent = calculateCompletion();
  const isNewProfile = completionPercent < 50;

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
    // Real implementation would call authService.updateAvailability(!isAvailable)
  };

  const isVerified = currentUser.verificationStatus === 'verified';

  return (
    <>
      {/* Top Header / Availability Switch */}
      <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm p-4 sm:p-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
            <Activity className="text-orange-500" />
          </div>
          <div>
            <h3 className="font-bold text-[#1a1a1a] text-lg leading-tight">Ҳолати корӣ: {isAvailable ? 'Озод / Фаъол' : 'Банд / Истироҳат'}</h3>
            <p className="text-sm text-gray-500">{isAvailable ? 'Шумо фармоишҳои навро қабул карда метавонед.' : 'Шумо муваққатан пинҳон ҳастед.'}</p>
          </div>
        </div>
        <button 
          onClick={toggleAvailability}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
            isAvailable ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'
          }`}
        >
          <Power size={18} />
          {isAvailable ? 'Қатъ кардан' : 'Фаъол кардан'}
        </button>
      </div>

      {/* Completion Alert for New Profiles */}
      {completionPercent < 100 && (
        <div className="bg-orange-50 border border-orange-200 rounded-[2rem] p-6 mb-6 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-orange-900 mb-2">Профили худро пур кунед ({completionPercent}%)</h3>
            <p className="text-sm text-orange-700 mb-4">
              Аввал сурат, касб, минтақа ва корҳои худро илова кунед то мизоҷон шуморо зудтар пайдо кунанд.
            </p>
            <div className="w-full bg-orange-200 rounded-full h-2.5 mb-4">
              <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${completionPercent}%` }}></div>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <li className={`flex items-center gap-2 text-sm font-semibold ${currentUser.avatar && !currentUser.avatar.includes('dicebear') ? 'text-green-600' : 'text-orange-600'}`}>
                {currentUser.avatar && !currentUser.avatar.includes('dicebear') ? <CheckCircle2 size={16} /> : <div className="w-4 h-4 rounded-full border-2 border-orange-400" />} Сурати профил
              </li>
              <li className={`flex items-center gap-2 text-sm font-semibold ${currentUser.profession ? 'text-green-600' : 'text-orange-600'}`}>
                {currentUser.profession ? <CheckCircle2 size={16} /> : <div className="w-4 h-4 rounded-full border-2 border-orange-400" />} Касб ва фаъолият
              </li>
              <li className={`flex items-center gap-2 text-sm font-semibold ${currentUser.city ? 'text-green-600' : 'text-orange-600'}`}>
                {currentUser.city ? <CheckCircle2 size={16} /> : <div className="w-4 h-4 rounded-full border-2 border-orange-400" />} Шаҳр / Минтақа
              </li>
              <li className={`flex items-center gap-2 text-sm font-semibold ${currentUser.passportPhoto ? 'text-green-600' : 'text-orange-600'}`}>
                {currentUser.passportPhoto ? <CheckCircle2 size={16} /> : <div className="w-4 h-4 rounded-full border-2 border-orange-400" />} Сурати шиноснома
              </li>
              <li className={`flex items-center gap-2 text-sm font-semibold ${photos.length > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                {photos.length > 0 ? <CheckCircle2 size={16} /> : <div className="w-4 h-4 rounded-full border-2 border-orange-400" />} Нахустин акси корӣ (Портфолио)
              </li>
              <li className={`flex items-center gap-2 text-sm font-semibold ${myReels.length > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                {myReels.length > 0 ? <CheckCircle2 size={16} /> : <div className="w-4 h-4 rounded-full border-2 border-orange-400" />} Нахустин навор (Reel)
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Stats Grid - Hide if new profile to prevent showing 0 all over, or show real stats */}
      {!isNewProfile && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-[#111] to-[#222] p-5 rounded-[1.5rem] shadow-lg relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 text-white/5">
              <Wallet size={80} />
            </div>
            <div className="flex items-center gap-2 mb-2 text-white/70 relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider">Даромад</span>
            </div>
            <p className="text-2xl font-black text-white relative z-10">{currentUser.walletBalance || 0} TJS</p>
          </div>

          <div className="bg-white p-5 rounded-[1.5rem] border border-black/5 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-gray-500">
              <Briefcase size={16} className="text-blue-500" /> 
              <span className="text-xs font-bold uppercase tracking-wider">Иҷрошуда</span>
            </div>
            <p className="text-2xl font-black text-[#1a1a1a]">{currentUser.completedJobs || 0}</p>
          </div>
          
          <div className="bg-white p-5 rounded-[1.5rem] border border-black/5 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-gray-500">
              <Star size={16} className="text-orange-500" /> 
              <span className="text-xs font-bold uppercase tracking-wider">Рейтинг</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <p className="text-2xl font-black text-[#1a1a1a]">{currentUser.rating || "0.0"}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-[1.5rem] border border-black/5 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-gray-500">
              <ShieldCheck size={16} className="text-green-500" /> 
              <span className="text-xs font-bold uppercase tracking-wider">Боварӣ</span>
            </div>
            <p className="text-2xl font-black text-green-600">{currentUser.trustScore || 0}%</p>
          </div>
        </div>
      )}

      {/* Main Body */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Col */}
        <div className="xl:col-span-1 space-y-6">

          {/* Verification Documents Section (KYC) */}
          {!isVerified ? (
            <div className="bg-gradient-to-b from-blue-50/50 to-white rounded-[2rem] border border-blue-100 shadow-sm p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div>
                  <h3 className="font-bold text-[#1a1a1a] text-lg flex items-center gap-2">
                    <ShieldCheck size={20} className="text-blue-500" />
                    Тасдиқи шахсият
                  </h3>
                  <p className="text-xs text-zinc-500 font-medium mt-1">Барои гирифтани Галочкаи Кабуд</p>
                </div>
              </div>

              {(!currentUser.passportPhoto || !currentUser.selfiePhoto) ? (
                <div className="space-y-4 relative z-10">
                  <p className="text-sm text-gray-500 font-medium">Лутфан ҳуҷҷатҳои зеринро боргузорӣ кунед.</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/profile/kyc" className="border-2 border-dashed border-blue-200 bg-white rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors aspect-[4/3]">
                      <ImageIcon size={24} className="text-blue-400 mb-2" />
                      <span className="text-xs font-bold text-center text-blue-800">Шиноснома</span>
                    </Link>
                    <Link href="/profile/kyc" className="border-2 border-dashed border-blue-200 bg-white rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors aspect-[4/3]">
                      <Camera size={24} className="text-blue-400 mb-2" />
                      <span className="text-xs font-bold text-center text-blue-800">Селфи бо <br/> Шиноснома</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 relative z-10">
                  <p className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                    <Clock size={16} /> Дар раванди санҷиш
                  </p>
                  <p className="text-xs text-amber-700 mt-1">Администратор ҳуҷҷатҳои шуморо месанҷад.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-emerald-50 rounded-[2rem] border border-emerald-100 shadow-sm p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <FileCheck size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-emerald-900 text-sm">Профил тасдиқ шуд</h3>
                  <p className="text-xs text-emerald-700">Шумо Устои Санҷидашуда ҳастед.</p>
                </div>
              </div>
              <CheckCircle2 className="text-emerald-500" size={24} />
            </div>
          )}

          {/* Quick Info */}
          <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm p-6">
            <h3 className="font-bold text-[#1a1a1a] text-lg mb-4">Маълумоти Умумӣ</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Phone size={18} className="text-gray-400" />
                <span className="text-[#1a1a1a] font-semibold">{currentUser.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin size={18} className="text-gray-400" />
                <span className="text-[#1a1a1a] font-semibold">{currentUser.city || "Муайян нашудааст"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Briefcase size={18} className="text-gray-400" />
                <span className="text-[#1a1a1a] font-semibold">{currentUser.profession || "Муайян нашудааст"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Portfolio & Reels */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Portfolio */}
          <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-black/5 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-[#1a1a1a] text-lg flex items-center gap-2">
                  <ImageIcon className="text-orange-500" size={20} /> Портфолио
                </h2>
                <p className="text-xs text-gray-500 mt-1">Аксҳои корҳои анҷомдодаи худро илова кунед.</p>
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()} 
                disabled={isPhotoUploading}
                className="bg-orange-50 hover:bg-orange-100 disabled:opacity-50 text-orange-600 border border-orange-200 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {isPhotoUploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Акс
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAddPhoto} className="hidden" />
            </div>
            
            {photos.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center text-center bg-[#FAFAF9]">
                <div className="w-16 h-16 rounded-2xl bg-white border border-black/5 shadow-sm flex items-center justify-center mb-4">
                  <ImageIcon size={28} className="text-[#6B7280]" />
                </div>
                <p className="text-[16px] font-bold text-[#111] mb-2">Аксҳо мавҷуд нест</p>
                <p className="text-[13px] text-[#6B7280] mb-5 max-w-[280px]">
                  Бо илова кардани аксҳои корӣ, мизоҷонро тезтар ҷалб кунед.
                </p>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#111] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-black transition-colors"
                >
                  Аввалин аксро илова кунед
                </button>
              </div>
            ) : (
              <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-[#FAFAF9]">
                {photos.map((p) => (
                  <div key={p._id} className="aspect-square rounded-2xl overflow-hidden relative group border border-black/5 bg-white shadow-sm">
                    <img src={mastersApi.getPhotoUrl(p.url)} alt="Work" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Trash2 className="text-white hover:text-red-500 cursor-pointer" size={24} onClick={() => handleDeletePhoto(p._id)} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reels Manager */}
          <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-black/5 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-[#1a1a1a] text-lg flex items-center gap-2">
                  <Video className="text-[#d95d39]" size={20} /> Видеоҳо (Reels)
                </h2>
                <p className="text-xs text-[#666666] mt-1">Худро бо наворҳои кӯтоҳ муаррифӣ кунед.</p>
              </div>
              <button onClick={() => setShowAddReelModal(true)} className="bg-[#d95d39] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#c24b2a] transition-colors shadow-lg shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer">
                <Plus size={16} /> Навор
              </button>
            </div>
            
            {myReels.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center text-center bg-[#FAFAF9]">
                <div className="w-16 h-16 rounded-2xl bg-white border border-black/5 shadow-sm flex items-center justify-center mb-4">
                  <Video size={28} className="text-[#6B7280]" />
                </div>
                <p className="text-[16px] font-bold text-[#111] mb-2">Наворҳо мавҷуд нест</p>
                <p className="text-[13px] text-[#6B7280] mb-5 max-w-[280px]">
                  Видеои кӯтоҳ беҳтарин роҳи нишон додани маҳорат аст.
                </p>
                <button onClick={() => setShowAddReelModal(true)} className="bg-[#d95d39] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#c24b2a] transition-colors">
                  Иловаи видео
                </button>
              </div>
            ) : (
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAFAF9]">
                {myReels.map((r: any) => (
                  <div key={r.id} className="bg-white border border-black/5 rounded-2xl p-4 flex gap-4 hover:shadow-md transition-shadow group">
                    <div className="w-16 h-24 bg-zinc-900 rounded-xl relative overflow-hidden shrink-0 flex items-center justify-center">
                      <video src={reelsApi.getVideoUrl(r.videoUrl)} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                    </div>
                    <div className="flex flex-col justify-between flex-1 py-1">
                      <h4 className="font-bold text-[#1a1a1a] text-sm leading-snug line-clamp-2">{r.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-[#666666] font-semibold mt-2">
                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md"><Eye size={12} /> {r.views || "0"}</span>
                        <span className="flex items-center gap-1 bg-red-50 text-red-600 px-2 py-1 rounded-md"><Heart size={12} className="fill-red-500" /> {r.likes || "0"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
