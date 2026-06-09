"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, BadgeCheck, MapPin, ShieldCheck, Briefcase, 
  Star, Users, Eye, Heart, CalendarCheck, Loader2, Image as ImageIcon, Video,
  Phone, MessageSquare, Send, Instagram, Clock, DollarSign, Hammer, 
  CheckCircle2, AlertCircle, Calendar, Plus, Share2, Award, ClipboardCheck
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { mastersApi, MasterPhotoData } from '@/services/masters.service';
import { reelsApi } from '@/services/reels.service';
import { useAuthStore } from '@/store/useAuthStore';
import { bookingsApi } from '@/services/bookings.service';
import { reviewsApi } from '@/services/reviews.service';

function renderAvatar(avatarUrl: string | null | undefined, name: string, sizeClass: string = "w-10 h-10") {
  const isFake = !avatarUrl || avatarUrl.includes("dicebear.com") || avatarUrl.trim() === "";
  if (isFake) {
    const initials = name
      ? name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()
      : "U";
    
    const charCode = name ? name.charCodeAt(0) : 0;
    const gradients = [
      "from-[#2A2D34] to-[#3B4252]",
      "from-[#e25e14] to-[#b83f0f]",
      "from-[#1E1E24] to-[#2E2E38]",
      "from-[#3F304F] to-[#2B1D38]",
      "from-[#1F3A52] to-[#0F1E2D]"
    ];
    const gradient = gradients[charCode % gradients.length];

    return (
      <div className={`${sizeClass} rounded-full bg-gradient-to-tr ${gradient} flex items-center justify-center border border-white/10 shadow-inner shrink-0 select-none`}>
        <span className="text-white font-extrabold text-[16px] tracking-wider drop-shadow-md">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <img 
      src={avatarUrl} 
      alt={name} 
      className={`${sizeClass} rounded-full border border-white/10 object-cover bg-zinc-800 shrink-0`} 
    />
  );
}

export default function MasterPublicProfile() {
  const params = useParams();
  const router = useRouter();
  const masterId = String(params?.id || '');
  const { currentUser } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'portfolio' | 'reels' | 'reviews' | 'schedule'>('about');
  const [masterData, setMasterData] = useState<any>(null);
  const [photos, setPhotos] = useState<MasterPhotoData[]>([]);
  const [masterReels, setMasterReels] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");

  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Hydrate master profile dynamically!
  let masterInfo = {
    id: masterId,
    firstName: masterData?.fullName?.split(" ")[0] || "Мастер",
    lastName: masterData?.fullName?.split(" ")[1] || "UstoTJ",
    name: masterData?.fullName || "Мастер UstoTJ",
    profession: masterData?.profession || "Устои санҷидашуда",
    city: masterData?.city || "Ш. Душанбе",
    address: masterData?.address || "Н. Сино, назди Автовокзал",
    experience: masterData?.experience || "5 сол",
    isVerified: masterData?.isVerified ?? true,
    trustScore: masterData?.trustScore ?? 98,
    avatar: masterData?.avatar || "",
    followers: masterData?.followers ?? 0,
    rating: masterData?.rating || "0.0",
    reviewsCount: masterData?.reviewsCount ?? reviews.length,
    completedJobs: masterData?.completedJobs ?? 0,
    responseTime: masterData?.responseTime || "Муайян нашудааст",
    status: masterData?.status || "available", // 'available' | 'busy' | 'offline'
    skills: masterData?.skills || [],
    workType: masterData?.workType || "Муайян нашудааст",
    availableDays: masterData?.workingHours || "Муайян нашудааст",
    priceRange: masterData?.priceFrom || "Мувофиқи маслиҳат",
    about: masterData?.bio || "Устои нав. Маълумоти иловагӣ ҳоло ворид нашудааст.",
    phone: masterData?.phone || "Муайян нашудааст",
    complaintsResolved: "100%",
  };

  // If this is the active logged-in user, populate using their dynamic profile state!
  if (currentUser && String(currentUser.id) === masterId) {
    masterInfo = {
      id: String(currentUser.id),
      firstName: currentUser.firstName || "Мастер",
      lastName: currentUser.lastName || "UstoTJ",
      name: currentUser.fullName || `${currentUser.firstName} ${currentUser.lastName}`,
      profession: currentUser.profession || "Усто",
      city: currentUser.city || "Душанбе",
      address: "Кӯчаи Неъмат Қаробоев, н. Фирдавсӣ",
      experience: currentUser.experience || "1 сол",
      isVerified: currentUser.isVerified ?? true,
      trustScore: currentUser.trustScore ?? 98,
      avatar: currentUser.avatar || "",
      followers: currentUser.followers ?? 0,
      rating: currentUser.rating || "0.0",
      reviewsCount: currentUser.reviewsCount ?? reviews.length,
      completedJobs: currentUser.completedJobs ?? 0,
      responseTime: currentUser.responseTime || "Муайян нашудааст",
      status: "available",
      skills: currentUser.skills || [],
      workType: currentUser.workType || "Муайян нашудааст",
      availableDays: currentUser.workingHours || "Муайян нашудааст",
      priceRange: "Мувофиқи маслиҳат",
      about: currentUser.bio || "Устои нав. Маълумоти иловагӣ ҳоло ворид нашудааст.",
      phone: currentUser.phone || "Муайян нашудааст",
      complaintsResolved: "100%",
    };
  } else if (masterReels.length > 0 && !masterData) {
    // If not logged-in user but has reels, extract their master profile info from the reel!
    const m = masterReels[0].master;
    masterInfo = {
      id: String(m.id),
      firstName: m.name.split(" ")[0] || "Мастер",
      lastName: m.name.split(" ")[1] || "UstoTJ",
      name: m.name,
      profession: m.profession,
      city: m.city,
      address: "Н. Сино, назди Бозори Мошинҳо",
      experience: "6 сол",
      isVerified: m.isVerified ?? true,
      trustScore: m.trustScore ?? 95,
      avatar: m.avatar,
      followers: m.followers ?? 0,
      rating: m.rating || "0.0",
      reviewsCount: reviews.length,
      completedJobs: m.completedJobs ?? 0,
      responseTime: m.responseTime || "Муайян нашудааст",
      status: "available",
      skills: m.skills || [],
      workType: m.workType || "Муайян нашудааст",
      availableDays: m.workingHours || "Муайян нашудааст",
      priceRange: m.priceFrom || "Мувофиқи маслиҳат",
      about: m.bio || "Устои нав. Маълумоти иловагӣ ҳоло ворид нашудааст.",
      phone: m.phone || "Муайян нашудааст",
      complaintsResolved: "100%",
    };
  }

  useEffect(() => {
    const loadMasterData = async () => {
      if (!masterId) return;
      try {
        // Fetch actual master profile details from backend
        const dynamicData = await mastersApi.getMasterById(masterId);
        if (dynamicData) {
          setMasterData(dynamicData);
        }

        // Load real-world portfolio photos from backend
        const photoData = await mastersApi.getPhotos(masterId);
        setPhotos(photoData);

        // Load real reviews
        const reviewData = await reviewsApi.getMasterReviews(masterId);
        setReviews(reviewData);

        // Load and filter reels for this master from backend
        const allReels = await reelsApi.getAll();
        const filtered = allReels.filter(r => String(r.master.id) === masterId);
        setMasterReels(filtered);
      } catch (err) {
        console.error("Failed to load master profile data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadMasterData();
  }, [masterId]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate || !bookingTime) return;
    
    const res = await bookingsApi.createBooking({
      master: masterId,
      date: bookingDate,
      time: bookingTime,
      notes: "Банд кардани хизматрасонӣ аз профили усто",
    });

    if (res) {
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        setShowBookingModal(false);
        setBookingDate("");
        setBookingTime("");
      }, 2000);
    } else {
      alert("Хатогӣ ҳангоми банд кардан. Лутфан аввал ба сайт ворид шавед (Логин кунед).");
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Лутфан аввал ба сайт ворид шавед (Логин кунед) то фикри худро нависед.");
      return;
    }
    if (!reviewComment.trim()) return;

    setSubmittingReview(true);
    const res = await reviewsApi.createReview({
      master: masterId,
      rating: reviewRating,
      comment: reviewComment,
    });
    setSubmittingReview(false);

    if (res) {
      setReviewSuccess(true);
      setReviewComment("");
      
      // Reload reviews and master profile data
      const reviewData = await reviewsApi.getMasterReviews(masterId);
      setReviews(reviewData);

      const dynamicData = await mastersApi.getMasterById(masterId);
      if (dynamicData) {
        setMasterData(dynamicData);
      }

      setTimeout(() => {
        setReviewSuccess(false);
      }, 3000);
    } else {
      alert("Хатогӣ ҳангоми фиристодани шарҳ. Шумо наметавонед ба профили худатон шарҳ нависед.");
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'available') {
      return (
        <span className="flex items-center gap-1.5 bg-green-500/10 text-green-600 px-3 py-1.5 rounded-full text-xs font-bold border border-green-500/20">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Озод / Фаъол
        </span>
      );
    }
    if (status === 'busy') {
      return (
        <span className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-600 px-3 py-1.5 rounded-full text-xs font-bold border border-yellow-500/20">
          <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
          Бандам (Кор дорам)
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 bg-gray-500/10 text-gray-600 px-3 py-1.5 rounded-full text-xs font-bold border border-gray-500/20">
        <span className="w-2 h-2 rounded-full bg-gray-400"></span>
        Офлайн
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF9F6] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-orange-500 mb-2" size={40} />
        <span className="text-sm font-semibold text-[#1a1a1a]">Боргузории профили касбӣ...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24 font-sans antialiased text-[#1a1a1a]">
      
      {/* 1. Dynamic Premium Cover Section */}
      <div className="relative bg-[#111] h-60 sm:h-80 w-full overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-40 blur-sm scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1440&auto=format&fit=crop')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-black/40 to-black/20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white bg-white/10 hover:bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-2xl text-sm font-bold border border-white/10 transition-all shadow-md cursor-pointer"
          >
            <ArrowLeft size={16} /> Бозгашт ба ҷустуҷӯ
          </button>
        </div>
      </div>

      {/* Main Grid: Left (Profile & Tabs) + Right (Contact & Work details) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-32 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Columns: Main Profile Card & Tabs Section */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Main Premium Profile Header Card */}
            <div className="bg-white rounded-[2rem] border border-black/5 shadow-[0_10px_40px_rgba(0,0,0,0.02)] p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-6 right-6 flex items-center gap-2">
                {getStatusBadge(masterInfo.status)}
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative">
                  {renderAvatar(masterInfo.avatar, masterInfo.name, "w-28 h-28 sm:w-32 sm:h-32 rounded-[2rem] border-4 border-white shadow-xl bg-orange-50 object-cover shrink-0")}
                  {masterInfo.isVerified && (
                    <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white p-1.5 rounded-2xl shadow-md border-2 border-white">
                      <BadgeCheck size={18} className="fill-white text-orange-500" />
                    </div>
                  )}
                </div>

                <div className="text-center sm:text-left space-y-2 flex-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <h1 className="text-3xl font-black tracking-tight text-[#111]">
                      {masterInfo.name}
                    </h1>
                    <span className="bg-orange-500/10 text-orange-600 px-3 py-1 rounded-full text-xs font-bold border border-orange-500/10">
                      Устои Тасдиқшуда
                    </span>
                  </div>

                  <p className="text-orange-600 font-extrabold text-base flex items-center justify-center sm:justify-start gap-1.5">
                    <Briefcase size={16} /> {masterInfo.profession}
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3 text-xs sm:text-sm font-semibold text-[#666]">
                    <span className="flex items-center gap-1"><MapPin size={14} className="text-orange-500" /> {masterInfo.city}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-300"></span>
                    <span className="flex items-center gap-1"><Clock size={14} className="text-orange-500" /> {masterInfo.experience} таҷриба</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-300"></span>
                    <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-green-500" /> Ифтихории UstoTJ</span>
                  </div>

                  {/* Main Header CTAs */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-4">
                    <button 
                      onClick={() => setShowBookingModal(true)}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-orange-500/20 hover:scale-102 flex items-center justify-center gap-2 cursor-pointer text-sm"
                    >
                      <CalendarCheck size={16} /> Фармоиши усто
                    </button>
                    
                    <a 
                      href={`tel:${masterInfo.phone}`}
                      className="bg-zinc-100 hover:bg-zinc-200 text-[#111] font-bold px-5 py-3 rounded-2xl transition-all hover:scale-102 flex items-center justify-center gap-2 text-sm"
                    >
                      <Phone size={16} /> Занг задан
                    </a>

                    <Link 
                      href={`/chat/${masterInfo.id}`}
                      className="bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/20 font-bold px-5 py-3 rounded-2xl transition-all hover:scale-102 flex items-center justify-center gap-2 text-sm"
                    >
                      <MessageSquare size={16} /> Навиштан
                    </Link>

                    <button 
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={`font-bold px-5 py-3 rounded-2xl transition-all text-sm cursor-pointer ${
                        isFollowing 
                          ? 'bg-orange-500/10 text-orange-600 border border-orange-500/20' 
                          : 'bg-zinc-900 hover:bg-black text-white'
                      }`}
                    >
                      {isFollowing ? 'Обуна шудед' : 'Обуна шудан'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Features Block */}
            <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-3xl border border-green-500/20 p-4 sm:p-5 shadow-[0_4px_20px_rgba(34,197,94,0.05)]">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-green-500/10">
                <div className="flex items-start gap-3 pt-4 sm:pt-0">
                  <div className="bg-white p-2.5 rounded-xl shadow-sm border border-green-500/10 shrink-0">
                    <ShieldCheck size={22} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#111] text-sm flex items-center gap-1.5">
                      Санҷиши бехатарӣ <CheckCircle2 size={12} className="text-green-500 fill-green-100" />
                    </h4>
                    <p className="text-xs text-green-800 font-medium leading-snug mt-1 opacity-90">Шахсият, телефон ва сабти ҷиноятии ин усто аз ҷониби UstoTJ пурра тасдиқ шудааст.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-4 sm:pt-0 sm:pl-6">
                  <div className="bg-white p-2.5 rounded-xl shadow-sm border border-green-500/10 shrink-0">
                    <DollarSign size={22} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#111] text-sm flex items-center gap-1.5">
                      Пардохти бехатар <CheckCircle2 size={12} className="text-green-500 fill-green-100" />
                    </h4>
                    <p className="text-xs text-green-800 font-medium leading-snug mt-1 opacity-90">Пардохти Шумо дар суратҳисоби UstoTJ (Escrow) то хатми кор маҳфуз мемонад.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-4 sm:pt-0 sm:pl-6">
                  <div className="bg-white p-2.5 rounded-xl shadow-sm border border-green-500/10 shrink-0">
                    <Award size={22} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#111] text-sm flex items-center gap-1.5">
                      Фонди Кафолат <CheckCircle2 size={12} className="text-green-500 fill-green-100" />
                    </h4>
                    <p className="text-xs text-green-800 font-medium leading-snug mt-1 opacity-90">Дар сурати расонидани зарар аз тарафи усто, мо то 10,000 TJS ҷуброн медиҳем.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium 5 Tabs Control */}
            <div className="bg-white rounded-3xl border border-black/5 shadow-[0_4px_25px_rgba(0,0,0,0.01)] p-2 flex flex-wrap gap-1">
              {[
                { id: 'about', label: 'Дар бора', icon: Award },
                { id: 'portfolio', label: 'Портфолио', icon: ImageIcon },
                { id: 'reels', label: 'Наворҳо', icon: Video },
                { id: 'reviews', label: 'Шарҳҳо', icon: Star },
                { id: 'schedule', label: 'Ҷадвали корӣ', icon: Calendar }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      activeTab === tab.id 
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/15' 
                        : 'text-[#666] hover:text-[#111] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Contents Card */}
            <div className="bg-white rounded-[2rem] border border-black/5 shadow-[0_10px_40px_rgba(0,0,0,0.01)] p-6 sm:p-8">
              
              {/* TAB 1: About */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#111] mb-3 flex items-center gap-2">
                      <Award className="text-orange-500" size={20} /> Муаррифии усто
                    </h3>
                    <p className="text-sm text-[#555] leading-relaxed whitespace-pre-line">
                      {masterInfo.about}
                    </p>
                  </div>

                  <div className="border-t border-black/5 pt-6">
                    <h4 className="font-bold text-sm text-[#111] uppercase tracking-wider mb-3">Хизматрасониҳо ва кафолат</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        "Маводи баландсифат ва асбобҳои муосир",
                        "Кафолат барои корҳои иҷрошуда то 1 сол",
                        "Ташхиси ройгон ҳангоми таъмир",
                        "Маслиҳатҳои касбӣ барои нигоҳдории мошин"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs font-semibold text-[#555]">
                          <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 2: Portfolio Grid */}
              {activeTab === 'portfolio' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-[#111] flex items-center gap-2">
                      <ImageIcon className="text-orange-500" size={20} /> Портфолио ва Намунаҳои кор
                    </h3>
                    {currentUser && String(currentUser.id) === masterId && (
                      <Link 
                        href="/profile" 
                        className="flex items-center gap-1.5 text-xs font-bold text-orange-500 bg-orange-50 hover:bg-orange-100 px-3.5 py-2 rounded-xl transition-all"
                      >
                        <Plus size={14} /> Иловаи акс
                      </Link>
                    )}
                  </div>

                  {photos.length === 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {/* Premium Portfolio Placeholder Grid */}
                      {[
                        "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1617886322168-72b886573c3e?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=600&auto=format&fit=crop"
                      ].map((url, idx) => (
                        <div key={idx} className="aspect-square rounded-2xl overflow-hidden border border-black/5 bg-[#FAFAF9] shadow-sm relative group cursor-zoom-in">
                          <img 
                            src={url} 
                            alt={`Portfolio Sample ${idx + 1}`} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs font-bold bg-white/20 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20">Намоиш</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {photos.map((p) => (
                        <div key={p._id} className="aspect-square rounded-2xl overflow-hidden border border-black/5 bg-[#FAFAF9] shadow-sm relative group cursor-zoom-in">
                          <img 
                            src={mastersApi.getPhotoUrl(p.url)} 
                            alt="Portfolio Work" 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Reels */}
              {activeTab === 'reels' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-[#111] flex items-center gap-2">
                      <Video className="text-orange-500" size={20} /> Видеоҳо ва Маслиҳатҳо
                    </h3>
                    {currentUser && String(currentUser.id) === masterId && (
                      <Link 
                        href="/profile" 
                        className="flex items-center gap-1.5 text-xs font-bold text-orange-500 bg-orange-50 hover:bg-orange-100 px-3.5 py-2 rounded-xl transition-all"
                      >
                        <Plus size={14} /> Навори нав
                      </Link>
                    )}
                  </div>

                  {masterReels.length === 0 ? (
                    <div className="bg-[#FAF9F6] rounded-2xl p-10 text-center border border-black/5">
                      <Video className="mx-auto text-zinc-300 mb-3" size={36} />
                      <p className="font-bold text-[#111] text-base">Видеоҳо вуҷуд надоранд</p>
                      <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">Усто то ҳол ягон навори кӯтоҳ ё видеои кори худро бор накардааст.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {masterReels.map((r) => (
                        <Link 
                          key={r._id || r.id}
                          href="/reels"
                          className="bg-[#FAF9F6] rounded-2xl p-4 border border-black/5 shadow-sm hover:shadow-md transition-shadow flex gap-4 group"
                        >
                          <div className="w-16 h-24 bg-zinc-900 rounded-xl relative overflow-hidden shrink-0 flex items-center justify-center">
                            <video src={reelsApi.getVideoUrl(r.videoUrl)} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                            <div className="absolute bottom-1 right-1 bg-black/60 px-1.5 py-0.5 rounded text-[10px] text-white font-medium">0:59</div>
                          </div>
                          <div className="flex flex-col justify-between flex-1 py-1 text-left">
                            <h4 className="font-bold text-[#111] text-sm leading-snug line-clamp-2">{r.title}</h4>
                            <div className="flex items-center gap-3 text-xs text-[#666] font-semibold mt-1">
                              <span className="flex items-center gap-1"><Eye size={12} /> {r.views || "120"}</span>
                              <span className="flex items-center gap-1"><Heart size={12} className="text-red-500 fill-red-500" /> {r.likes || "45"}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: Reviews */}
              {activeTab === 'reviews' && (
                <div className="space-y-8">
                  
                  {/* Review Submission Form */}
                  {currentUser && String(currentUser.id) !== masterId && (
                    <div className="p-6 bg-orange-500/5 rounded-3xl border border-orange-500/10 space-y-4">
                      <h4 className="font-extrabold text-[#111] text-base flex items-center gap-2">
                        <Plus size={18} className="text-orange-500" /> Навиштани шарҳи нав
                      </h4>
                      <p className="text-xs font-semibold text-green-600 flex items-center gap-1.5 bg-green-500/10 px-3 py-1.5 rounded-lg w-fit border border-green-500/20">
                        <ShieldCheck size={14} /> Танҳо баъди фармоиш ва гирифтани хизматрасонӣ шарҳ навиштан мумкин аст. (Verified Reviews)
                      </p>

                      {reviewSuccess ? (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-xl text-sm font-semibold border border-green-200">
                          <CheckCircle2 size={18} /> Шарҳи шумо бомуваффақият сабт шуд ва аз ҷониби админ тафтиш мешавад. Ташаккур!
                        </div>
                      ) : (
                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                          {/* Star Selection */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-500">Баҳодиҳӣ:</span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setReviewRating(star)}
                                  className="transition-transform active:scale-95 hover:scale-110 cursor-pointer"
                                >
                                  <Star
                                    size={20}
                                    className={
                                      star <= reviewRating
                                        ? "fill-yellow-500 text-yellow-500"
                                        : "text-gray-300"
                                    }
                                  />
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Comment Input */}
                          <div>
                            <textarea
                              required
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              placeholder="Фикри худро оиди сифати кори усто, дақиқкорӣ ва нархи хизматрасонӣ бинависед..."
                              rows={3}
                              className="w-full text-sm border border-black/10 rounded-2xl p-4 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-[#111]"
                            />
                          </div>

                          {/* Submit Button */}
                          <button
                            type="submit"
                            disabled={submittingReview}
                            className="bg-[#1a1a1a] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                          >
                            {submittingReview ? (
                              <>
                                <Loader2 className="animate-spin" size={14} /> Фиристода истодааст...
                              </>
                            ) : (
                              "Шарҳро фиристодан"
                            )}
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  {!currentUser && (
                    <div className="p-4 bg-zinc-50 border border-zinc-200/60 rounded-2xl text-center text-xs font-semibold text-zinc-500">
                      Барои навиштани шарҳи худ, лутфан ба сайт <Link href="/login" className="text-orange-600 hover:underline">ворид шавед</Link>.
                    </div>
                  )}

                  {/* Reviews List Header */}
                  <h3 className="text-xl font-bold text-[#111] mb-2 flex items-center gap-2">
                    <Star className="text-orange-500 fill-orange-500" size={20} /> Шарҳҳои Мизоҷон ({reviews.length})
                  </h3>

                  <div className="space-y-4">
                    {reviews.length === 0 ? (
                      <div className="bg-[#FAF9F6] rounded-2xl p-8 text-center border border-black/5 text-gray-500 text-sm">
                        То ҳол ягон шарҳ навишта нашудааст. Аввалин шуда шарҳ гузоред!
                      </div>
                    ) : (
                      reviews.map((rev) => (
                        <div key={rev._id || rev.id} className="p-5 rounded-2xl border border-black/5 bg-[#FAF9F6] space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              {renderAvatar(rev.clientUser?.avatar, rev.clientUser?.fullName || "Мизоҷ", "w-10 h-10 rounded-full")}
                              <div>
                                <h4 className="font-bold text-[#111] text-sm leading-none">{rev.clientUser?.fullName || "Мизоҷи UstoTJ"}</h4>
                                <span className="text-[10px] text-gray-400 font-semibold block mt-1">{rev.date || "Имрӯз"}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-0.5 text-yellow-500">
                              {Array.from({ length: rev.rating }).map((_, i) => (
                                <Star key={i} size={12} className="fill-yellow-500 text-yellow-500" />
                              ))}
                            </div>
                          </div>
                          
                          <p className="text-xs sm:text-sm text-[#555] leading-relaxed pl-1">
                            {rev.comment}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: Schedule */}
              {activeTab === 'schedule' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-[#111] mb-2 flex items-center gap-2">
                    <Calendar className="text-orange-500" size={20} /> Ҷадвали кории усто
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-black/5 flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-600">Ҳолати кунунӣ</span>
                        {getStatusBadge(masterInfo.status)}
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Рӯзҳои корӣ</span>
                        <div className="flex items-center gap-3 bg-[#FAF9F6] p-4 rounded-2xl border border-black/5">
                          <Calendar size={18} className="text-orange-500" />
                          <span className="text-sm font-bold text-[#111]">{masterInfo.availableDays}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Соатҳои озод барои занг</span>
                        <div className="flex items-center gap-3 bg-[#FAF9F6] p-4 rounded-2xl border border-black/5">
                          <Clock size={18} className="text-orange-500" />
                          <span className="text-sm font-bold text-[#111]">09:00 - 20:00</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-orange-500/5 border border-orange-500/10 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h4 className="font-bold text-[#111] text-base">Мехоҳед вақтро банд кунед?</h4>
                        <p className="text-xs text-[#555] leading-relaxed">
                          Шумо метавонед ба таври худкор ва бевосита вақти холии усторо интихоб кунед. Мо ба шумо тавассути SMS тасдиқ мефиристем.
                        </p>
                      </div>
                      <button 
                        onClick={() => setShowBookingModal(true)}
                        className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-all cursor-pointer text-sm shadow-md flex items-center justify-center gap-1.5"
                      >
                        <CalendarCheck size={16} /> Банд кардани вақт
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Right Column: Contact Details, Work Info & Trust Cards */}
          <div className="space-y-8">
            
            {/* 2. Contact Information Card */}
            <div className="bg-white rounded-[2rem] border border-black/5 shadow-[0_10px_40px_rgba(0,0,0,0.01)] p-6 sm:p-8 space-y-6">
              <h3 className="text-lg font-bold text-[#111] border-b border-black/5 pb-3">Маълумот барои Тамос</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-gray-400 block uppercase tracking-wider">Рақами телефон</span>
                    <a href={`tel:${masterInfo.phone}`} className="text-sm font-bold text-[#111] hover:text-orange-500 transition-colors">
                      {masterInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-gray-400 block uppercase tracking-wider">Суроға / Роҳнамо</span>
                    <span className="text-sm font-bold text-[#111]">{masterInfo.address}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-gray-400 block uppercase tracking-wider">Ҳудуди фаъолият</span>
                    <span className="text-sm font-bold text-[#111]">{masterInfo.city} (тамоми ҳудуд)</span>
                  </div>
                </div>
              </div>

              {/* Social Premium Buttons */}
              <div className="space-y-2.5 pt-3 border-t border-black/5">
                <Link 
                  href={`/chat/${masterInfo.id}`}
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-3.5 rounded-xl font-bold text-xs transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.02]"
                >
                  <MessageSquare size={16} /> Чат дар UstoTJ
                </Link>
                
                <a 
                  href={`https://wa.me/${masterInfo.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-3.5 rounded-xl font-bold text-xs transition-colors shadow-sm"
                >
                  <MessageSquare size={16} /> Навиштан дар WhatsApp
                </a>
                
                <a 
                  href="https://t.me/ustotj" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#0088cc] hover:bg-[#0077b5] text-white py-3.5 rounded-xl font-bold text-xs transition-colors shadow-sm"
                >
                  <Send size={16} /> Навиштан дар Telegram
                </a>

                <a 
                  href="https://instagram.com/ustotj" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-white py-3.5 rounded-xl font-bold text-xs transition-opacity shadow-sm"
                >
                  <Instagram size={16} /> Саҳифаи Instagram
                </a>
              </div>
            </div>

            {/* 3. Work Details Card */}
            <div className="bg-white rounded-[2rem] border border-black/5 shadow-[0_10px_40px_rgba(0,0,0,0.01)] p-6 sm:p-8 space-y-6">
              <h3 className="text-lg font-bold text-[#111] border-b border-black/5 pb-3">Маълумоти Касбӣ</h3>

              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-gray-400 block uppercase tracking-wider mb-2">Категория ва Маҳоратҳо</span>
                  <div className="flex flex-wrap gap-1.5">
                    {masterInfo.skills.map((skill: string, idx: number) => (
                      <span key={idx} className="bg-zinc-100 text-[#111] px-3 py-1.5 rounded-xl text-xs font-bold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-black/5 pt-4 space-y-3.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-500">Намуди хизматрасонӣ</span>
                    <span className="text-xs font-bold text-[#111]">{masterInfo.workType}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-500">Рӯзҳои корӣ</span>
                    <span className="text-xs font-bold text-[#111]">{masterInfo.availableDays.split(",")[0]}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-500">Нархнома</span>
                    <span className="text-xs font-extrabold text-orange-600">{masterInfo.priceRange}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Professional Trust Cards Grid */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1">Нишондиҳандаҳои Боварӣ</span>
              <div className="grid grid-cols-2 gap-3">
                
                <div className="bg-white rounded-2xl border border-black/5 p-4 text-center space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Рейтинг</span>
                  <div className="flex items-center justify-center gap-0.5">
                    <Star className="text-yellow-500 fill-yellow-500" size={14} />
                    <span className="text-base font-black text-[#111]">{masterInfo.rating}</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-black/5 p-4 text-center space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Боварии умумӣ</span>
                  <span className="text-base font-black text-green-600">{masterInfo.trustScore}%</span>
                </div>

                <div className="bg-white rounded-2xl border border-black/5 p-4 text-center space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Корҳои анҷомёфта</span>
                  <span className="text-base font-black text-[#111]">{masterInfo.completedJobs} анҷом</span>
                </div>

                <div className="bg-white rounded-2xl border border-black/5 p-4 text-center space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Ҷавобдиҳӣ</span>
                  <span className="text-base font-black text-orange-600">{masterInfo.responseTime}</span>
                </div>

                <div className="bg-white rounded-2xl border border-black/5 p-4 text-center space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Обуначиён</span>
                  <span className="text-base font-black text-[#111]">{masterInfo.followers} нафар</span>
                </div>

                <div className="bg-white rounded-2xl border border-black/5 p-4 text-center space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Шикоятҳо</span>
                  <span className="text-base font-black text-green-600">{masterInfo.complaintsResolved} ҳалшуда</span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Booking Modal Sheet */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-black/5 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#1a1a1a] flex items-center gap-2">
                <CalendarCheck className="text-orange-500" /> Фармоиши Хизматрасонӣ
              </h2>
              <button 
                onClick={() => setShowBookingModal(false)} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors"
              >
                <Plus size={18} className="rotate-45" />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 mx-auto flex items-center justify-center">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-xl font-bold text-[#1a1a1a]">Бомуваффақият банд шуд!</h3>
                <p className="text-xs text-gray-500">Мо ба рақами шумо паёмак бо тафсилоти вохӯрӣ мефиристем.</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
                <div>
                  <span className="text-xs text-gray-500 block mb-2">Усто</span>
                  <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-2xl border border-black/5">
                    {renderAvatar(masterInfo.avatar, masterInfo.name, "w-10 h-10 rounded-xl")}
                    <div>
                      <h4 className="font-bold text-sm text-[#111]">{masterInfo.name}</h4>
                      <p className="text-[11px] text-orange-600 font-bold">{masterInfo.profession}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Интихоби рӯз</label>
                  <input 
                    required 
                    type="date" 
                    value={bookingDate} 
                    onChange={e => setBookingDate(e.target.value)} 
                    className="w-full border border-black/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" 
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Интихоби соат</label>
                  <input 
                    required 
                    type="time" 
                    value={bookingTime} 
                    onChange={e => setBookingTime(e.target.value)} 
                    className="w-full border border-black/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" 
                  />
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    className="w-full bg-[#1a1a1a] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-black transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Тасдиқи Бандкунӣ
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
