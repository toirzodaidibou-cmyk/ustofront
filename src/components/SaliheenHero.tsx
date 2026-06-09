"use client";

import React from "react";
import { ArrowRight, Menu, Facebook, Instagram, Youtube } from "lucide-react";
import Link from "next/link";

export default function SaliheenHero() {
  return (
    <section className="relative w-full h-screen min-h-[700px] flex items-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        {/* Placeholder video matching the scenic mountain vibe */}
        <source src="https://cdn.pixabay.com/video/2020/05/25/40134-424915609_large.mp4" type="video/mp4" />
      </video>
      
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1d20]/90 via-[#1a1d20]/50 to-transparent z-10"></div>
      
      {/* Navbar (Overlaying Hero) */}
      <nav className="absolute top-0 left-0 w-full z-50 py-6 px-6 md:px-12 flex items-center justify-between border-b border-white/10">
        <Link href="/" className="flex items-center gap-4 group">
          <span className="text-3xl font-bold tracking-tight text-white drop-shadow-md">
            Saliheen
          </span>
          <div className="w-px h-8 bg-white/20 hidden md:block"></div>
          <span className="hidden md:block text-white/80 text-sm max-w-[150px] leading-tight group-hover:text-white transition-colors">
            Мо барои ҳаёти зеботар
          </span>
        </Link>

        <button className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2.5 text-white hover:bg-white/20 transition-colors">
          <span className="font-semibold text-sm tracking-widest">МЕНЮ</span>
          <Menu size={20} />
        </button>
      </nav>

      {/* Main Hero Content */}
      <div className="relative z-20 w-full max-w-[1440px] mx-auto px-6 md:px-12 flex justify-between items-center h-full pt-16">
        
        <div className="max-w-3xl">
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.2] mb-10 drop-shadow-lg">
            Ташкилот кумакҳои худро дар соҳаҳои иҷтимоӣ, таълим, тиб ва кӯмакҳои башардӯстона равона мекунад.
          </h1>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <button className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold text-sm tracking-widest flex items-center gap-4 hover:bg-white/30 transition-all group">
              ҲАМРОҲ ШУДАН
              <span className="bg-white text-black p-2 rounded-full group-hover:scale-110 transition-transform">
                <ArrowRight size={18} />
              </span>
            </button>
            <p className="text-white/70 max-w-sm text-sm leading-relaxed border-l-2 border-[#d97736] pl-4">
              Дар якҷоягӣ мо метавонем ҳаёти мардуми ниёзмандро беҳтар кунем ва маърифати саховатмандиро дар ҷомеа ба роҳ монем.
            </p>
          </div>
        </div>
        
        {/* Right Side Social Sidebar */}
        <div className="hidden lg:flex flex-col items-center gap-8 absolute right-12 top-1/2 -translate-y-1/2">
           <span className="text-white/80 uppercase tracking-[0.3em] text-xs [writing-mode:vertical-rl] rotate-180 mb-4 font-semibold">
             Моро пайгирӣ кунед
           </span>
           <div className="w-[1px] h-16 bg-white/30 mb-2"></div>
           <a href="#" className="text-white hover:text-[#d97736] transition-colors hover:scale-110"><Facebook size={20} /></a>
           <a href="#" className="text-white hover:text-[#d97736] transition-colors hover:scale-110"><Instagram size={20} /></a>
           <a href="#" className="text-white hover:text-[#d97736] transition-colors hover:scale-110"><Youtube size={20} /></a>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-12 left-6 md:left-12 flex items-center gap-6 text-white font-medium">
          <span className="text-lg">01</span>
          <div className="w-16 h-[2px] bg-white/30 relative">
            <div className="absolute top-0 left-0 h-full w-1/3 bg-[#d97736]"></div>
          </div>
          <span className="text-lg text-white/50">03</span>
        </div>

      </div>
    </section>
  );
}
