"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Star, ShieldCheck, Briefcase, Filter, X, ChevronDown, Loader2 } from 'lucide-react';

const CITIES = ["Тамоми шаҳрҳо", "Душанбе", "Хуҷанд", "Бохтар", "Кӯлоб", "Истаравшан", "Норак", "Вахш"];
const PROFESSIONS = ["Ҳамаи касбҳо", "Электрик", "Сантехник", "Механик (Мошин)", "Устои кондиционер", "Бинокор / Таъмир", "Дуредгар / Мебел", "Рангкор", "Дигар"];

export default function SearchPage() {
  const [masters, setMasters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Тамоми шаҳрҳо");
  const [selectedProfession, setSelectedProfession] = useState("Ҳамаи касбҳо");

  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  useEffect(() => {
    // In a real scenario, this would be an API call to search/filter
    const loadMasters = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1/masters`);
        if (res.ok) {
          const data = await res.json();
          setMasters(data);
        } else {
          setMasters([]);
        }
      } catch (e) {
        setMasters([]);
      } finally {
        setLoading(false);
      }
    };
    loadMasters();
  }, []);

  const filteredMasters = masters.filter(m => {
    const fullName = `${m.user?.firstName || m.firstName || ""} ${m.user?.lastName || m.lastName || ""}`.toLowerCase();
    const prof = (m.profession || "").toLowerCase();
    
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || prof.includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === "Тамоми шаҳрҳо" || (m.user?.city || m.city) === selectedCity;
    const matchesProf = selectedProfession === "Ҳамаи касбҳо" || m.profession === selectedProfession;
    
    return matchesSearch && matchesCity && matchesProf;
  });

  return (
    <div className="min-h-screen bg-[#FBF9F6] pt-24 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search Bar */}
        <div className="bg-white rounded-[2rem] border border-black/5 p-6 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Ҷустуҷӯ аз рӯи ном ё касб..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-black/5 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-[#111]"
            />
          </div>
          
          <button 
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="md:hidden w-full bg-orange-50 text-orange-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2"
          >
            <Filter size={18} /> Филтрҳо
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className={`w-full md:w-[280px] shrink-0 space-y-6 ${showFiltersMobile ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-[2rem] border border-black/5 p-6 shadow-sm sticky top-28">
              <h3 className="font-bold text-[#111] mb-5 flex items-center gap-2">
                <Filter size={18} className="text-orange-500" /> Филтрҳо
              </h3>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Шаҳр</label>
                  <div className="relative">
                    <select 
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full bg-gray-50 border border-black/5 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none appearance-none cursor-pointer"
                    >
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Касб / Фаъолият</label>
                  <div className="relative">
                    <select 
                      value={selectedProfession}
                      onChange={(e) => setSelectedProfession(e.target.value)}
                      className="w-full bg-gray-50 border border-black/5 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none appearance-none cursor-pointer"
                    >
                      {PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <button 
                  onClick={() => { setSearchQuery(""); setSelectedCity("Тамоми шаҳрҳо"); setSelectedProfession("Ҳамаи касбҳо"); setShowFiltersMobile(false); }}
                  className="w-full bg-zinc-100 hover:bg-zinc-200 text-[#111] font-bold py-3 rounded-xl transition-all text-xs"
                >
                  Тоза кардани филтрҳо
                </button>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-[#111] mb-6">
              Натиҷаҳо ({filteredMasters.length})
            </h2>

            {loading ? (
              <div className="py-20 flex justify-center">
                <Loader2 className="animate-spin text-orange-500" size={40} />
              </div>
            ) : filteredMasters.length === 0 ? (
              <div className="bg-white rounded-[2rem] border border-black/5 p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="text-gray-400" size={24} />
                </div>
                <h3 className="text-lg font-bold text-[#111]">Мутаассифона, усто ёфт нашуд</h3>
                <p className="text-sm text-gray-500 mt-2">Лутфан филтрҳои дигарро санҷед.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMasters.map(master => (
                  <Link 
                    href={`/masters/${master.user?._id || master.user?.id || master.id}`} 
                    key={master.id}
                    className="bg-white rounded-[2rem] border border-black/5 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
                  >
                    <div className="flex gap-4">
                      <div className="relative">
                        <img 
                          src={master.user?.avatar || master.avatar || `https://api.dicebear.com/9.x/notionists/svg?seed=${master.user?.firstName || master.firstName}`} 
                          alt="Avatar" 
                          className="w-20 h-20 rounded-2xl object-cover bg-gray-50 border border-black/5 shrink-0"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white p-1 rounded-xl border-2 border-white">
                          <ShieldCheck size={14} />
                        </div>
                      </div>
                      <div className="flex flex-col justify-center">
                        <h3 className="font-bold text-[#111] text-base group-hover:text-orange-500 transition-colors">
                          {master.user?.firstName || master.firstName} {master.user?.lastName || master.lastName}
                        </h3>
                        <p className="text-orange-600 font-semibold text-xs flex items-center gap-1 mt-1">
                          <Briefcase size={12} /> {master.profession || "Усто"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-2 text-[11px] font-bold text-[#666]">
                      <div className="bg-gray-50 rounded-xl p-2.5 flex items-center gap-1.5 border border-black/5">
                        <MapPin size={14} className="text-gray-400" /> {master.user?.city || master.city || "Душанбе"}
                      </div>
                      <div className="bg-orange-50 rounded-xl p-2.5 flex items-center gap-1.5 border border-orange-500/10 text-orange-700">
                        <Star size={14} className="fill-orange-500 text-orange-500" /> {master.rating || "0.0"} ({master.reviewsCount || 0})
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
