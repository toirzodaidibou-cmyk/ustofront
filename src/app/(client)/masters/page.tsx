"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Search, SlidersHorizontal, Star, MapPin, BadgeCheck, 
  CalendarCheck, Phone, ArrowUpRight, HelpCircle, Shield, ShieldCheck, DollarSign,
  Award, Briefcase, ChevronRight, ChevronDown, Sparkles, Loader2, RefreshCw, X, Send, CheckCircle2,
  Zap, Car, Droplets, Wind, HardHat, Sofa, Tv2, Sparkle, Paintbrush, Flame, Trees, Monitor, Package, KeyRound, Truck, LucideIcon
} from 'lucide-react';
import { mastersApi, MasterProfileData } from '@/services/masters.service';
import { useLanguageStore } from '@/store/useLanguageStore';
import { bookingsApi } from '@/services/bookings.service';

function renderAvatar(avatarUrl: string | null | undefined, name: string, sizeClass: string = "w-10 h-10") {
  const isFake = !avatarUrl || avatarUrl.includes("dicebear.com") || avatarUrl.trim() === "";
  const roundedClass = sizeClass.includes("rounded-xl") ? "rounded-xl" : sizeClass.includes("rounded-2xl") ? "rounded-2xl" : "rounded-full";
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
      <div className={`${sizeClass.replace(/rounded-\w+/g, "")} ${roundedClass} bg-gradient-to-tr ${gradient} flex items-center justify-center border border-white/10 shadow-inner shrink-0 select-none`}>
        <span className="text-white font-extrabold text-[13px] tracking-wider drop-shadow-md">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <img 
      src={avatarUrl} 
      alt={name} 
      className={`${sizeClass} border border-white/10 bg-orange-50 shrink-0`} 
    />
  );
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  electrician: Zap,
  mechanic: Car,
  plumber: Droplets,
  ac: Wind,
  builder: HardHat,
  furniture: Sofa,
  appliance: Tv2,
  cleaning: Sparkle,
  painter: Paintbrush,
  welder: Flame,
  carpenter: Trees,
  it_repair: Monitor,
  movers: Package,
  door_lock: KeyRound,
  tow: Truck,
};

const CATEGORY_COLORS: Record<string, string> = {
  electrician: 'bg-yellow-50 text-yellow-600',
  mechanic: 'bg-blue-50 text-blue-600',
  plumber: 'bg-cyan-50 text-cyan-600',
  ac: 'bg-sky-50 text-sky-600',
  builder: 'bg-orange-50 text-orange-600',
  furniture: 'bg-amber-50 text-amber-700',
  appliance: 'bg-purple-50 text-purple-600',
  cleaning: 'bg-green-50 text-green-600',
  painter: 'bg-rose-50 text-rose-600',
  welder: 'bg-red-50 text-red-600',
  carpenter: 'bg-lime-50 text-lime-700',
  it_repair: 'bg-indigo-50 text-indigo-600',
  movers: 'bg-teal-50 text-teal-600',
  door_lock: 'bg-zinc-100 text-zinc-600',
  tow: 'bg-slate-50 text-slate-600',
};

const CATEGORIES = [
  { id: 'electrician', label: 'Электрикҳо', desc: 'Васлу насб ва таъмири таҷҳизоти барқӣ' },
  { id: 'mechanic', label: 'Устоҳои мошин', desc: 'Таъмири муҳаррик, ходовой ва ташхиси мошинҳо' },
  { id: 'plumber', label: 'Сантехникҳо', desc: 'Таъмир ва насби қубурҳо ва крани обӣ' },
  { id: 'ac', label: 'Устоҳои кондиционер', desc: 'Тозакунӣ, заправка ва таъмири хунуккунакҳо' },
  { id: 'builder', label: 'Таъмири хона ва сохтмон', desc: 'Ороиши дохилӣ, тарҳрезӣ ва таъмири хонаҳо' },
  { id: 'furniture', label: 'Устоҳои мебел', desc: 'Ҷамъоварӣ ва таъмири мебелҳои хона ва коргоҳ' },
  { id: 'appliance', label: 'Техникаи маишӣ', desc: 'Таъмири яхдон, мошини ҷомашӯӣ ва телевизор' },
  { id: 'cleaning', label: 'Тозакунӣ ва клининг', desc: 'Хизматрасонии фаррошӣ барои хона ва офис' },
  { id: 'painter', label: 'Рангмолҳо', desc: 'Рангкунии деворҳо ва корҳои ороишӣ' },
  { id: 'welder', label: 'Кафшергарон (Сваршик)', desc: 'Корҳои кафшеркунӣ ва сохтани дарвозаҳо' },
  { id: 'carpenter', label: 'Дуредгарон (Столяр)', desc: 'Сохтмон ва таъмири маҳсулоти чӯбӣ' },
  { id: 'it_repair', label: 'Компютер ва телефон', desc: 'Таъмири техникаи электронӣ ва насби барномаҳо' },
  { id: 'movers', label: 'Боркашонҳо (Грузчик)', desc: 'Кӯчонидани хона ва хизмати боркашонӣ' },
  { id: 'door_lock', label: 'Устои қулф', desc: 'Кушодан ва иваз кардани қулфи дарҳо' },
  { id: 'tow', label: 'Эвакуатор', desc: 'Ёрии шабонарӯзӣ дар роҳ ва кашонидани мошин' }
];

function CustomSelect({ 
  value, 
  onChange, 
  options, 
  placeholder 
}: { 
  value: string, 
  onChange: (v: string) => void, 
  options: {value: string, label: string}[], 
  placeholder: string 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find(o => o.value === value)?.label || placeholder;
  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-zinc-50 border border-zinc-200/80 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/15 focus:border-orange-500 transition-all font-semibold flex items-center justify-between cursor-pointer select-none"
      >
        <span className={value ? "text-zinc-800" : "text-zinc-800"}>{selectedLabel}</span>
        <ChevronDown size={16} className={`text-zinc-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </div>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-black/5 shadow-xl rounded-2xl py-2 z-50 overflow-y-auto max-h-[300px] transform origin-top animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
            <div 
              onClick={() => { onChange(''); setIsOpen(false); }}
              className={`px-4 py-2.5 text-sm font-semibold cursor-pointer hover:bg-orange-50 transition-colors text-left ${value === '' ? 'text-orange-600 bg-orange-50' : 'text-zinc-600'}`}
            >
              {placeholder}
            </div>
            {options.map(opt => (
              <div 
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`px-4 py-2.5 text-sm font-semibold cursor-pointer hover:bg-orange-50 transition-colors text-left ${value === opt.value ? 'text-orange-600 bg-orange-50' : 'text-zinc-600'}`}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function FindMastersPage() {
  const { t, currentLanguage } = useLanguageStore();
  const [allMasters, setAllMasters] = useState<MasterProfileData[]>([]);
  const [filteredMasters, setFilteredMasters] = useState<MasterProfileData[]>([]);
  const [loading, setLoading] = useState(true);

  // Search filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Booking states
  const [selectedMasterForBooking, setSelectedMasterForBooking] = useState<MasterProfileData | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Load masters on mount
  const loadMasters = async (cat?: string) => {
    setLoading(true);
    try {
      const data = await mastersApi.getAllMasters(cat);
      setAllMasters(data);
      setFilteredMasters(data);
    } catch (err) {
      console.error("Failed to load masters:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let catFromUrl = '';
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlCat = params.get('category');
      if (urlCat && CATEGORIES.some(c => c.id === urlCat)) {
        catFromUrl = urlCat;
        setSelectedCategory(urlCat);
      }
    }
    loadMasters(catFromUrl || undefined);
  }, []);

  // Filter application logic
  useEffect(() => {
    let result = [...allMasters];

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(m => 
        m.fullName.toLowerCase().includes(q) || 
        m.profession.toLowerCase().includes(q) ||
        m.skills.some(s => s.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== '') {
      result = result.filter(m => m.category === selectedCategory);
    }

    if (selectedCity !== '') {
      result = result.filter(m => m.city.toLowerCase() === selectedCity.toLowerCase());
    }

    if (verifiedOnly) {
      result = result.filter(m => m.isVerified);
    }

    setFilteredMasters(result);
  }, [searchQuery, selectedCategory, selectedCity, verifiedOnly, allMasters]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate || !bookingTime || !selectedMasterForBooking) return;
    
    const res = await bookingsApi.createBooking({
      master: selectedMasterForBooking.id,
      date: bookingDate,
      time: bookingTime,
      notes: "Банд кардани хизматрасонӣ тавассути сайт",
    });

    if (res) {
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        setSelectedMasterForBooking(null);
        setBookingDate('');
        setBookingTime('');
      }, 2000);
    } else {
      alert("Хатогӣ ҳангоми банд кардан. Лутфан аввал ба сайт ворид шавед (Логин кунед).");
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'available') {
      return (
        <span className="flex items-center gap-1 bg-green-500/10 text-green-600 px-2.5 py-1 rounded-full text-[10px] font-bold border border-green-500/10">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          Ҳозир озод
        </span>
      );
    }
    if (status === 'busy') {
      return (
        <span className="flex items-center gap-1 bg-yellow-500/10 text-yellow-600 px-2.5 py-1 rounded-full text-[10px] font-bold border border-yellow-500/10">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
          Банд
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 bg-gray-500/10 text-gray-600 px-2.5 py-1 rounded-full text-[10px] font-bold border border-gray-500/10">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
        Офлайн
      </span>
    );
  };

  // Extract masters available now
  const availableNowMasters = filteredMasters.filter(m => m.status === 'available');

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24 font-sans text-[#1a1a1a]">
      {/* Full Screen Hero & Premium Search Suite */}
      <div className="relative w-full h-[100vh] min-h-[600px] flex flex-col justify-center items-center text-white overflow-hidden mt-0 pt-16">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=2000&auto=format&fit=crop" 
            alt="UstoTJ Background" 
            className="w-full h-full object-cover object-center"
          />
        </div>
        
        {/* Dark Overlays matched to Main Page */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#000000]/80 via-[#000000]/50 to-[#000000]/20" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#000000]/60 via-transparent to-[#000000]/30" />

        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <span className="bg-white/10 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[13px] font-bold uppercase tracking-wider border border-white/20 inline-flex items-center gap-2 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              {t("hero.badge")}
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-[76px] font-black tracking-tight leading-[1.1] text-white max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            {selectedCategory ? (
              <>
                {CATEGORIES.find(c => c.id === selectedCategory)?.label} <br className="hidden sm:block" />
                <span className="text-white/80">
                  {currentLanguage === 'tg' ? 'дар Тоҷикистон.' : currentLanguage === 'ru' ? 'в Таджикистане.' : 'in Tajikistan.'}
                </span>
              </>
            ) : (
              <>
                {t("hero.title").split(" ").slice(0, 2).join(" ")} <br className="hidden sm:block" />
                <span className="text-white/80">{t("hero.title").split(" ").slice(2).join(" ")}</span>
              </>
            )}
          </h1>
          
          <p className="text-white/70 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto font-medium animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
            {t("hero.subtitle")}
          </p>

          {/* Elegant Search Panel */}
          <div className="max-w-5xl mx-auto mt-10 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20 shadow-2xl p-4 sm:p-6 text-zinc-800 space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Search by Query */}
              <div className="relative">
                <Search className="absolute left-4 top-3.5 text-zinc-400" size={18} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t("hero.searchPlaceholder")} 
                  className="w-full bg-zinc-50 border border-zinc-200/80 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/15 focus:border-orange-500 transition-all font-semibold"
                />
              </div>

              {/* Category selector */}
              <CustomSelect 
                value={selectedCategory}
                onChange={setSelectedCategory}
                placeholder={t("hero.allCategories")}
                options={CATEGORIES.map(cat => ({ value: cat.id, label: cat.label }))}
              />

              {/* City Selector */}
              <CustomSelect 
                value={selectedCity}
                onChange={setSelectedCity}
                placeholder={t("hero.allCities")}
                options={[
                  { value: 'Душанбе', label: 'Душанбе' },
                  { value: 'Хуҷанд', label: 'Хуҷанд' },
                  { value: 'Бохтар', label: 'Бохтар' },
                  { value: 'Кӯлоб', label: 'Кӯлоб' },
                  { value: 'Истаравшан', label: 'Истаравшан' },
                  { value: 'Ваҳдат', label: 'Ваҳдат' },
                  { value: 'Турсунзода', label: 'Турсунзода' },
                  { value: 'Конибодом', label: 'Конибодом' },
                  { value: 'Исфара', label: 'Исфара' },
                  { value: 'Панҷакент', label: 'Панҷакент' },
                  { value: 'Хоруғ', label: 'Хоруғ' },
                  { value: 'Ҳисор', label: 'Ҳисор' },
                  { value: 'Норак', label: 'Норак' },
                  { value: 'Данғара', label: 'Данғара' },
                  { value: 'Ашт', label: 'Ашт' },
                  { value: 'Ҷаббор Расулов', label: 'Ҷаббор Расулов' },
                  { value: 'Спитамен', label: 'Спитамен' },
                  { value: 'Шаҳринав', label: 'Шаҳринав' },
                  { value: 'Рӯдакӣ', label: 'Рӯдакӣ' },
                  { value: 'Фархор', label: 'Фархор' },
                  { value: 'Восеъ', label: 'Восеъ' },
                  { value: 'Ёвон', label: 'Ёвон' },
                  { value: 'Ҷалолиддини Балхӣ', label: 'Ҷалолиддини Балхӣ' },
                  { value: 'Шаҳритус', label: 'Шаҳритус' }
                ]}
              />

            </div>

            {/* Checkbox and stats row */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 px-2 border-t border-white/10">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={verifiedOnly}
                  onChange={e => setVerifiedOnly(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-zinc-300 text-orange-500 focus:ring-orange-500/30 cursor-pointer" 
                />
                <span className="text-xs sm:text-sm font-bold text-white/90 flex items-center gap-1">
                  <BadgeCheck size={16} className="text-orange-400" /> {t("hero.verifiedOnly")}
                </span>
              </label>

              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory(''); setSelectedCity(''); setVerifiedOnly(false); }}
                className="text-xs font-bold text-orange-400 hover:text-orange-300 hover:underline flex items-center gap-1 transition-colors"
              >
                <RefreshCw size={12} /> {t("hero.clearFilters")}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Main Discover Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        
        {loading ? (
          <div className="py-24 text-center space-y-2">
            <Loader2 className="animate-spin text-orange-500 mx-auto" size={40} />
            <p className="text-sm font-semibold text-zinc-500">{t("common.loading")}</p>
          </div>
        ) : (
          <>
            {/* 🟢 Available Now Section */}
            {availableNowMasters.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                  <h2 className="text-2xl font-black text-[#111] tracking-tight">
                    {currentLanguage === 'tg' ? 'Ҳозир озод ҳастанд' : currentLanguage === 'ru' ? 'Свободны сейчас' : 'Available Now'}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-zinc-500 font-medium -mt-2">
                  {currentLanguage === 'tg' 
                    ? 'Ин устоҳо ҳозир озоданд ва метавонанд фармоиши шуморо фавран қабул кунанд.' 
                    : currentLanguage === 'ru' 
                    ? 'Эти мастера свободны сейчас и готовы принять ваш заказ.' 
                    : 'These masters are free now and ready to accept your orders.'}
                </p>

                {/* Horizontal Scroll wrapper */}
                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                  {availableNowMasters.map(master => (
                    <div key={master.id} className="min-w-[280px] sm:min-w-[320px] max-w-[320px] bg-white rounded-3xl border border-black/5 p-5 shadow-sm hover:shadow-md transition-all space-y-4 shrink-0 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="relative">
                            {renderAvatar(master.avatar, master.fullName, "w-14 h-14 rounded-2xl object-cover")}
                            {master.isVerified && (
                              <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow-sm">
                                <BadgeCheck size={14} className="fill-[#1d9bf0] text-white" />
                              </div>
                            )}
                          </div>
                          {getStatusBadge(master.status)}
                        </div>

                        <div className="space-y-1">
                          <h3 className="font-extrabold text-base text-[#111] leading-tight line-clamp-1">{master.fullName}</h3>
                          <p className="text-xs font-bold text-orange-600">{master.profession}</p>
                          <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1"><MapPin size={10} /> {master.city}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100 text-center mb-1">
                          <div>
                            <span className="text-[9px] font-bold text-zinc-400 block uppercase">{t("common.rating")}</span>
                            <span className="text-xs font-extrabold text-zinc-800 flex items-center justify-center gap-0.5"><Star size={10} className="text-yellow-500 fill-yellow-500" /> {master.rating}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-zinc-400 block uppercase">{t("common.jobs")}</span>
                            <span className="text-xs font-extrabold text-zinc-800">{master.completedJobs}</span>
                          </div>
                        </div>

                        {/* Trust Badges Row */}
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-100">
                          <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 border border-green-500/20">
                            <ShieldCheck size={10} /> Санҷидашуда
                          </span>
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 border border-emerald-500/20">
                            <DollarSign size={10} /> Пардохти бехатар
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 pt-3">
                        <div className="flex justify-between items-center text-xs font-bold px-1 mb-1">
                          <span className="text-zinc-400">{t("common.price")}</span>
                          <span className="text-orange-600">{master.priceFrom}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Link 
                            href={`/masters/${master.id}`}
                            className="bg-zinc-100 hover:bg-zinc-200 text-[#111] font-bold py-2 rounded-xl text-center text-xs transition-colors"
                          >
                            {t("common.details")}
                          </Link>
                          <button 
                            onClick={() => setSelectedMasterForBooking(master)}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <CalendarCheck size={12} /> {t("common.bookNow")}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 📂 Category Sections */}
            {(selectedCategory ? CATEGORIES.filter(c => c.id === selectedCategory) : CATEGORIES).map(category => {
              const mastersInCat = filteredMasters.filter(m => m.category === category.id);

              return (
                <div key={category.id} className="space-y-5 border-t border-black/5 pt-12">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${CATEGORY_COLORS[category.id] ?? 'bg-zinc-100 text-zinc-600'}`}>
                        {React.createElement(CATEGORY_ICONS[category.id] ?? Briefcase, { size: 20, strokeWidth: 1.8 })}
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-[#111] tracking-tight">
                          {category.label}
                        </h2>
                        <p className="text-xs sm:text-sm text-zinc-500 font-semibold">{category.desc}</p>
                      </div>
                    </div>
                    {mastersInCat.length > 0 && (
                      <span className="text-xs font-extrabold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-xl">
                        {mastersInCat.length} {currentLanguage === 'tg' ? 'усто мавҷуд' : currentLanguage === 'ru' ? 'мастеров доступно' : 'masters available'}
                      </span>
                    )}
                  </div>

                  {mastersInCat.length === 0 ? (
                    <div className="bg-white rounded-3xl p-8 text-center border border-black/5 max-w-xl mx-auto shadow-sm space-y-4">
                      <HelpCircle className="mx-auto text-zinc-300" size={36} />
                      <div className="space-y-1">
                        <p className="font-extrabold text-[#111] text-base">
                          {currentLanguage === 'tg' ? 'Дар ин категория устоҳо ҳозир нест' : currentLanguage === 'ru' ? 'В этой категории пока нет мастеров' : 'No masters available in this category yet'}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {currentLanguage === 'tg' ? 'Шумо метавонед аввалин усто дар ин категория шавед!' : currentLanguage === 'ru' ? 'Вы можете стать первым мастером в этой категории!' : 'You can become the first master in this category!'}
                        </p>
                      </div>
                      <Link 
                        href="/register" 
                        className="inline-block bg-[#1a1a1a] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
                      >
                        {currentLanguage === 'tg' ? 'Аввалин усто шудан' : currentLanguage === 'ru' ? 'Стать первым мастером' : 'Become the first master'}
                      </Link>
                    </div>
                  ) : (
                    /* Horizontal Scrollable Card Feed */
                    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                      {mastersInCat.map(master => (
                        <div key={master.id} className="min-w-[280px] sm:min-w-[320px] max-w-[320px] bg-white rounded-3xl border border-black/5 p-5 shadow-sm hover:shadow-md transition-all space-y-4 shrink-0 flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div className="relative">
                                {renderAvatar(master.avatar, master.fullName, "w-14 h-14 rounded-2xl object-cover")}
                                {master.isVerified && (
                                  <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow-sm">
                                    <BadgeCheck size={14} className="fill-[#1d9bf0] text-white" />
                                  </div>
                                )}
                              </div>
                              {getStatusBadge(master.status)}
                            </div>

                            <div className="space-y-1">
                              <h3 className="font-extrabold text-base text-[#111] leading-tight line-clamp-1">{master.fullName}</h3>
                              <p className="text-xs font-bold text-orange-600">{master.profession}</p>
                              <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1"><MapPin size={10} /> {master.city}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100 text-center mb-1">
                              <div>
                                <span className="text-[9px] font-bold text-zinc-400 block uppercase">{t("common.rating")}</span>
                                <span className="text-xs font-extrabold text-zinc-800 flex items-center justify-center gap-0.5"><Star size={10} className="text-yellow-500 fill-yellow-500" /> {master.rating}</span>
                              </div>
                              <div>
                                <span className="text-[9px] font-bold text-zinc-400 block uppercase">{t("common.jobs")}</span>
                                <span className="text-xs font-extrabold text-zinc-800">{master.completedJobs}</span>
                              </div>
                            </div>

                            {/* Trust Badges Row */}
                            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-100">
                              <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 border border-green-500/20">
                                <ShieldCheck size={10} /> Санҷидашуда
                              </span>
                              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 border border-emerald-500/20">
                                <DollarSign size={10} /> Пардохти бехатар
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2 pt-3">
                            <div className="flex justify-between items-center text-xs font-bold px-1 mb-1">
                              <span className="text-zinc-400">{t("common.price")}</span>
                              <span className="text-orange-600">{master.priceFrom}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <Link 
                                href={`/masters/${master.id}`}
                                className="bg-zinc-100 hover:bg-zinc-200 text-[#111] font-bold py-2 rounded-xl text-center text-xs transition-colors"
                              >
                                {t("common.details")}
                              </Link>
                              <button 
                                onClick={() => setSelectedMasterForBooking(master)}
                                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <CalendarCheck size={12} /> {t("common.bookNow")}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

      </div>

      {/* Booking Modal Sheet */}
      {selectedMasterForBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-black/5 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#1a1a1a] flex items-center gap-2">
                <CalendarCheck className="text-orange-500" /> {currentLanguage === 'tg' ? 'Фармоиши Хизматрасонӣ' : currentLanguage === 'ru' ? 'Заказ Услуг' : 'Book a Service'}
              </h2>
              <button 
                onClick={() => setSelectedMasterForBooking(null)} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 mx-auto flex items-center justify-center">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-xl font-bold text-[#1a1a1a]">
                  {currentLanguage === 'tg' ? 'Бомуваффақият банд шуд!' : currentLanguage === 'ru' ? 'Успешно забронировано!' : 'Successfully booked!'}
                </h3>
                <p className="text-xs text-gray-500">
                  {currentLanguage === 'tg' 
                    ? 'Усто дар вақти интихобшуда ба шумо тамос хоҳад гирифт.' 
                    : currentLanguage === 'ru' 
                    ? 'Мастер свяжется с вами в выбранное время.' 
                    : 'The master will contact you at the selected time.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
                <div>
                  <span className="text-xs text-gray-500 block mb-2">
                    {currentLanguage === 'tg' ? 'Устои интихобшуда' : currentLanguage === 'ru' ? 'Выбранный мастер' : 'Selected Master'}
                  </span>
                  <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-2xl border border-black/5">
                    {renderAvatar(selectedMasterForBooking.avatar, selectedMasterForBooking.fullName, "w-10 h-10 rounded-xl object-cover")}
                    <div>
                      <h4 className="font-bold text-sm text-[#111]">{selectedMasterForBooking.fullName}</h4>
                      <p className="text-[11px] text-orange-600 font-bold">{selectedMasterForBooking.profession}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    {currentLanguage === 'tg' ? 'Интихоби рӯз' : currentLanguage === 'ru' ? 'Выберите дату' : 'Select Date'}
                  </label>
                  <input 
                    required 
                    type="date" 
                    value={bookingDate} 
                    onChange={e => setBookingDate(e.target.value)} 
                    className="w-full border border-black/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" 
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    {currentLanguage === 'tg' ? 'Интихоби соат' : currentLanguage === 'ru' ? 'Выберите время' : 'Select Time'}
                  </label>
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
                    {currentLanguage === 'tg' ? 'Тасдиқи Бандкунӣ' : currentLanguage === 'ru' ? 'Подтвердить бронирование' : 'Confirm Booking'}
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
