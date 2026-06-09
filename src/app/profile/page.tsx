"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Loader2, BadgeCheck, ChevronDown, X, Upload, Video } from 'lucide-react';
import gsap from 'gsap';
import { useReelsStore } from '@/store/useReelsStore';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/auth.service';
import { reelsApi } from '@/services/reels.service';
import { mastersApi, MasterPhotoData } from '@/services/masters.service';
import { bookingsApi, BookingData } from '@/services/bookings.service';
import { useRouter } from 'next/navigation';

import { Sidebar } from './components/Sidebar';
import { ClientDashboard } from './components/ClientDashboard';
import { MasterDashboard } from './components/MasterDashboard';
import { BookingsTab } from './components/BookingsTab';
import { WalletTab } from './components/WalletTab';

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
      <div className={`${sizeClass} rounded-full bg-gradient-to-tr ${gradient} flex items-center justify-center border border-black/10 shadow-inner shrink-0 select-none`}>
        <span className="text-white font-extrabold text-[12px] tracking-wider">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <img 
      src={avatarUrl} 
      alt={name} 
      className={`${sizeClass} rounded-full border border-black/10 object-cover bg-zinc-800 shrink-0`} 
    />
  );
}

export default function ProfileDashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  
  // Reels upload states
  const [showAddReelModal, setShowAddReelModal] = useState(false);
  const [reelVideoFile, setReelVideoFile] = useState<File | null>(null);
  const [reelVideoPreview, setReelVideoPreview] = useState<string | null>(null);
  const [newReelTitle, setNewReelTitle] = useState("");
  const [newReelDesc, setNewReelDesc] = useState("");
  const [isReelUploading, setIsReelUploading] = useState(false);
  const reelFileInputRef = useRef<HTMLInputElement>(null);

  // Photos state
  const [photos, setPhotos] = useState<MasterPhotoData[]>([]);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);

  // Edit Profile States
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editProfession, setEditProfession] = useState("");
  const [editExperience, setEditExperience] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editWhatsapp, setEditWhatsapp] = useState("");
  const [editInstagram, setEditInstagram] = useState("");
  const [editWorkingHours, setEditWorkingHours] = useState("");

  const [activeSection, setActiveSection] = useState<'dashboard' | 'bookings' | 'wallet' | 'chat'>('dashboard');
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [walletTransactions, setWalletTransactions] = useState<any[]>([]);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const router = useRouter();
  const { reels, setReels, addReel } = useReelsStore();
  const { currentUser, isAuthenticated } = useAuthStore();

  const loadBookingsData = async () => {
    if (!currentUser?.id) return;
    setLoadingBookings(true);
    try {
      let data = [];
      if (currentUser.role === 'master') {
        data = await bookingsApi.getMasterBookings();
      } else {
        data = await bookingsApi.getClientBookings();
      }
      setBookings(data);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled') => {
    const res = await bookingsApi.updateBookingStatus(id, status);
    if (res) {
      setBookings(prev => prev.map(b => (b.id === id || b._id === id) ? { ...b, status } : b));
    } else {
      alert("Хатогӣ ҳангоми навсозии статус");
    }
  };

  // Load photos & reels
  const loadProfileData = async () => {
    if (currentUser?.id) {
      try {
        if (currentUser.role === 'master') {
          const data = await mastersApi.getPhotos(String(currentUser.id));
          setPhotos(data);

          const allReels = await reelsApi.getAll();
          if (allReels) {
            const formatted = allReels.map((r: any) => ({
              id: r._id || r.id,
              videoUrl: r.videoUrl,
              title: r.title,
              description: r.description || "",
              likes: String(r.likes || "0"),
              comments: String(r.comments || "0"),
              shares: String(r.shares || "0"),
              master: r.master
            }));
            setReels(formatted);
          }
        }
      } catch (err) {
        console.error("Failed to load profile details:", err);
      }
    }
  };

  useEffect(() => {
    const initProfile = async () => {
      try {
        await authService.loadMe();
      } catch (err) {
        console.error("Failed to load profile from backend:", err);
      } finally {
        setMounted(true);
      }
    };
    initProfile();
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated || !currentUser) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, currentUser, router]);

  useEffect(() => {
    if (currentUser) {
      loadProfileData();
      loadBookingsData();
      setEditFirstName(currentUser.firstName || "");
      setEditLastName(currentUser.lastName || "");
      setEditCity(currentUser.city || "");
      setEditProfession(currentUser.profession || "");
      setEditExperience(currentUser.experience || "");
      setEditAvatar(currentUser.avatar || "");
      setEditAddress(currentUser.address || "");
      setEditWhatsapp(currentUser.whatsapp || "");
      setEditInstagram(currentUser.instagram || "");
      setEditWorkingHours(currentUser.workingHours || "");
      setWalletBalance(currentUser.walletBalance || 0);
      setTimeout(() => setLoading(false), 800);
    }
  }, [currentUser]);

  useEffect(() => {
    if (loading || !currentUser) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".fade-in-section",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: "back.out(1.2)" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [loading, currentUser, activeSection]);

  if (!mounted || !isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen bg-[#fbfaf8] flex items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  const profile = {
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    profession: currentUser.profession || "Усто",
    experience: currentUser.experience || "Муайян нашудааст",
    region: currentUser.city || "Муайян нашудааст",
    views: "1.2K",
    rating: currentUser.rating || "0.0",
    reviewsCount: currentUser.reviewsCount || 0,
    completedJobs: currentUser.completedJobs || 0,
    trustScore: currentUser.trustScore || 0,
    followers: currentUser.followers || 0,
    responseTime: currentUser.responseTime || "Муайян нашудааст",
    isVerified: currentUser.badges?.includes('verified') || false,
    avatar: currentUser.avatar
  };

  const myReels = reels.filter(r => String(r.master.id) === String(currentUser.id));

  const getStatusColor = () => {
    if (currentUser.isAvailable) return 'bg-green-500';
    return 'bg-yellow-500';
  };

  const getStatusText = () => {
    if (currentUser.isAvailable) return 'Озод (Қабули фармоиш)';
    return 'Бандам (Кор дорам)';
  };

  const setStatus = async (status: string) => {
    const isAvail = status === 'available';
    await authService.updateAvailability(isAvail);
    setShowStatusDropdown(false);
  };

  const handleAddPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsPhotoUploading(true);
    const result = await mastersApi.uploadPhoto(String(currentUser.id), file);
    setIsPhotoUploading(false);

    if (result) {
      loadProfileData();
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    const success = await mastersApi.deletePhoto(String(currentUser.id), photoId);
    if (success) {
      setPhotos(prev => prev.filter(p => p._id !== photoId));
    }
  };

  const handleAddNewReel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reelVideoFile || !newReelTitle.trim()) return;

    setIsReelUploading(true);

    const masterInfo = {
      id: String(currentUser.id),
      name: `${currentUser.firstName} ${currentUser.lastName}`,
      profession: currentUser.profession || "Усто",
      city: currentUser.city || "Душанбе",
      isVerified: currentUser.badges?.includes('verified') || false,
      trustScore: currentUser.trustScore || 0,
      avatar: currentUser.avatar || `https://api.dicebear.com/9.x/notionists/svg?seed=${currentUser.firstName}`,
    };

    const result = await reelsApi.uploadAndCreate(
      reelVideoFile,
      newReelTitle,
      newReelDesc,
      masterInfo
    );

    setIsReelUploading(false);

    if (result) {
      addReel({
        id: result._id || result.id || Date.now(),
        videoUrl: result.videoUrl,
        title: result.title,
        description: result.description,
        likes: "0",
        comments: "0",
        shares: "0",
        master: masterInfo
      });

      setShowAddReelModal(false);
      setReelVideoFile(null);
      setReelVideoPreview(null);
      setNewReelTitle("");
      setNewReelDesc("");
    }
  };

  const handleReelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type.startsWith("video/")) {
      setReelVideoFile(selected);
      setReelVideoPreview(URL.createObjectURL(selected));
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await authService.uploadAvatar(file);
        setEditAvatar(url);
      } catch (err) {
        console.error("Avatar upload failed:", err);
      }
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.updateProfile({
        firstName: editFirstName,
        lastName: editLastName,
        city: editCity,
        avatar: editAvatar
      }, {
        profession: editProfession,
        experience: editExperience.includes("сол") ? editExperience : `${editExperience} сол`,
        address: editAddress,
        whatsapp: editWhatsapp,
        instagram: editInstagram,
        workingHours: editWorkingHours
      });
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to save profile:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbfaf8] flex items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-[#fbfaf8] flex font-sans overflow-hidden">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        bookingsCount={bookings.length}
        role={currentUser?.role as any}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-black/5 px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] flex items-center gap-2">
              Салом, {profile.firstName} {profile.isVerified && <BadgeCheck size={24} className="text-[#1d9bf0] fill-[#1d9bf0] text-white" />}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-[#666666] text-xs sm:text-sm">Панели идоракунии {currentUser.role === 'client' ? 'мизоҷ' : 'усто'}</p>
              {currentUser.role === 'master' && (
                currentUser.verificationStatus === 'verified' ? (
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">✅ Тасдиқшуда</span>
                ) : currentUser.verificationStatus === 'rejected' ? (
                  <span className="text-[10px] font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded-full border border-red-200">❌ Рад шуд</span>
                ) : (
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">⏳ Дар интизори тасдиқ</span>
                )
              )}
            </div>
          </div>
          {/* Controls */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 bg-[#1a1a1a] text-white border border-black/10 px-4.5 py-2.5 rounded-full hover:bg-black hover:scale-102 active:scale-98 transition-all shadow-sm font-semibold text-xs sm:text-sm cursor-pointer"
            >
              Таҳрири Профил
            </button>

            {/* Status Dropdown (Only for masters) */}
            {currentUser.role === 'master' && (
              <div className="relative">
                <button 
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="flex items-center gap-2 bg-white border border-black/10 px-4 py-2.5 rounded-full hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${getStatusColor()} animate-pulse`}></span>
                  <span className="text-sm font-semibold text-[#1a1a1a] hidden sm:block">{getStatusText()}</span>
                  <ChevronDown size={16} className="text-[#666666]" />
                </button>
                {showStatusDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-black/5 shadow-xl rounded-2xl p-2 z-50">
                    <button onClick={() => setStatus('available')} className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-xl text-sm font-medium flex items-center gap-2 cursor-pointer"><span className="w-2 h-2 rounded-full bg-green-500"></span> Озод (Қабули фармоиш)</button>
                    <button onClick={() => setStatus('busy')} className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-xl text-sm font-medium flex items-center gap-2 cursor-pointer"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Бандам (Кор дорам)</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-8 max-w-[1400px] mx-auto w-full space-y-6 pb-24 fade-in-section">
          
          {/* Section switcher tabs */}
          <div className="flex border-b border-black/5 gap-6">
            <button 
              onClick={() => setActiveSection('dashboard')}
              className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${activeSection === 'dashboard' ? 'text-orange-500' : 'text-[#666] hover:text-[#1a1a1a]'}`}
            >
              Панели асосӣ
              {activeSection === 'dashboard' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full"></span>}
            </button>
            <button 
              onClick={() => setActiveSection('bookings')}
              className={`pb-3 text-sm font-bold transition-all relative flex items-center gap-1.5 cursor-pointer ${activeSection === 'bookings' ? 'text-orange-500' : 'text-[#666] hover:text-[#1a1a1a]'}`}
            >
              Бандкуниҳо (Фармоишҳо)
              {bookings.length > 0 && (
                <span className="bg-orange-500 text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-extrabold">
                  {bookings.length}
                </span>
              )}
              {activeSection === 'bookings' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full"></span>}
            </button>
            <button 
              onClick={() => setActiveSection('wallet')}
              className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${activeSection === 'wallet' ? 'text-orange-500' : 'text-[#666] hover:text-[#1a1a1a]'}`}
            >
              Ҳамён ва Escrow
              {activeSection === 'wallet' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full"></span>}
            </button>
          </div>

          {activeSection === 'dashboard' && currentUser.role === 'client' && (
            <ClientDashboard profile={profile} setActiveSection={setActiveSection} bookings={bookings} />
          )}

          {activeSection === 'dashboard' && currentUser.role === 'master' && (
            <MasterDashboard 
              profile={profile} 
              currentUser={currentUser} 
              photos={photos} 
              myReels={myReels} 
              setActiveSection={setActiveSection}
              isPhotoUploading={isPhotoUploading}
              handleAddPhoto={handleAddPhoto}
              handleDeletePhoto={handleDeletePhoto}
              setShowAddReelModal={setShowAddReelModal}
            />
          )}

          {activeSection === 'bookings' && (
            <BookingsTab 
              bookings={bookings} 
              loadingBookings={loadingBookings} 
              currentUser={currentUser} 
              handleUpdateStatus={handleUpdateStatus} 
              renderAvatar={renderAvatar}
            />
          )}

          {activeSection === 'wallet' && (
            <WalletTab 
              walletBalance={walletBalance} 
              walletTransactions={walletTransactions}
              role={currentUser?.role as any}
            />
          )}

        </div>
      </div>

      {/* Add Reel Modal */}
      {showAddReelModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-black/5 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#1a1a1a]">Иловаи Навор (Reel)</h2>
              <button onClick={() => setShowAddReelModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddNewReel} className="p-6 space-y-5">
              {!reelVideoPreview ? (
                <div 
                  onClick={() => reelFileInputRef.current?.click()}
                  className="border-2 border-dashed border-black/10 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/50 transition-colors"
                >
                  <Video size={32} className="text-[#a0a0a0] mb-2" />
                  <span className="font-semibold text-[#1a1a1a]">Видеоро интихоб кунед</span>
                  <span className="text-sm text-[#666666]">MP4, MOV то 50MB</span>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden bg-black h-[180px]">
                  <video src={reelVideoPreview} className="w-full h-full object-contain" controls muted />
                  <button 
                    type="button"
                    onClick={() => { setReelVideoFile(null); setReelVideoPreview(null); }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              <input
                ref={reelFileInputRef}
                type="file"
                accept="video/*"
                onChange={handleReelFileChange}
                className="hidden"
              />
              <div>
                <label className="text-sm font-semibold text-[#1a1a1a] block mb-2">Сарлавҳа</label>
                <input required value={newReelTitle} onChange={e => setNewReelTitle(e.target.value)} type="text" placeholder="Масалан: Таъмири муҳаррик" className="w-full border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1a1a1a] block mb-2">Шарҳ (Тавсиф)</label>
                <textarea required value={newReelDesc} onChange={e => setNewReelDesc(e.target.value)} rows={3} placeholder="Дар бораи ин видео маълумот диҳед..." className="w-full border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"></textarea>
              </div>
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={!reelVideoFile || !newReelTitle.trim() || isReelUploading}
                  className="w-full bg-[#d95d39] disabled:opacity-50 text-white py-4 rounded-xl font-bold text-lg hover:bg-[#c24b2a] transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                >
                  {isReelUploading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Боргузорӣ...
                    </>
                  ) : (
                    "Нашр кардан"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-black/5 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#1a1a1a]">Таҳрири Маълумот</h2>
              <button onClick={() => setShowEditModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div className="flex flex-col items-center mb-4">
                <div className="relative group cursor-pointer">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                  />
                  <div className="w-20 h-20 rounded-full border border-black/10 overflow-hidden relative bg-black/5 flex items-center justify-center group-hover:border-orange-500 transition-colors">
                    {editAvatar ? (
                      <img src={editAvatar} alt="Profile Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <Upload size={20} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
                    )}
                  </div>
                </div>
                <span className="text-[11px] text-gray-500 mt-1.5 font-semibold uppercase tracking-wider">Аватари нав</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Ном</label>
                  <input 
                    required 
                    type="text" 
                    value={editFirstName} 
                    onChange={e => setEditFirstName(e.target.value)} 
                    className="w-full border border-black/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" 
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Насаб</label>
                  <input 
                    required 
                    type="text" 
                    value={editLastName} 
                    onChange={e => setEditLastName(e.target.value)} 
                    className="w-full border border-black/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" 
                  />
                </div>
              </div>
              {currentUser.role === 'master' && (
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Касб / Фаъолият</label>
                  <input 
                    required 
                    type="text" 
                    value={editProfession} 
                    onChange={e => setEditProfession(e.target.value)} 
                    className="w-full border border-black/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" 
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Шаҳр</label>
                  <input 
                    required 
                    type="text" 
                    value={editCity} 
                    onChange={e => setEditCity(e.target.value)} 
                    className="w-full border border-black/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" 
                  />
                </div>
                {currentUser.role === 'master' && (
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Таҷриба (сол)</label>
                    <input 
                      required 
                      type="text" 
                      value={editExperience.replace(" сол", "")} 
                      onChange={e => setEditExperience(e.target.value)} 
                      className="w-full border border-black/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" 
                    />
                  </div>
                )}
              </div>
              {currentUser.role === 'master' && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Суроға / Нишона</label>
                    <input 
                      type="text" 
                      value={editAddress} 
                      onChange={e => setEditAddress(e.target.value)} 
                      className="w-full border border-black/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">WhatsApp</label>
                      <input 
                        type="text" 
                        value={editWhatsapp} 
                        onChange={e => setEditWhatsapp(e.target.value)} 
                        className="w-full border border-black/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">Instagram (Link)</label>
                      <input 
                        type="text" 
                        value={editInstagram} 
                        onChange={e => setEditInstagram(e.target.value)} 
                        className="w-full border border-black/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Вақти корӣ (Мас: 09:00 - 18:00)</label>
                    <input 
                      type="text" 
                      value={editWorkingHours} 
                      onChange={e => setEditWorkingHours(e.target.value)} 
                      className="w-full border border-black/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" 
                    />
                  </div>
                </>
              )}
              <div className="pt-4">
                <button 
                  type="submit" 
                  className="w-full bg-[#1a1a1a] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-black transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Сабт кардан
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
