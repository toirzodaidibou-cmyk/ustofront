"use client";

import { ArrowRight } from "lucide-react";

export default function SaliheenZakat() {
  return (
    <section className="relative w-full py-32 overflow-hidden bg-gradient-to-br from-[#1b3d36] to-[#0d1e1c]">
      {/* Decorative Background */}
      <div 
        className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-no-repeat bg-contain opacity-[0.03] pointer-events-none translate-x-1/3 translate-y-1/3"
        style={{ backgroundImage: "url('https://www.svgrepo.com/show/475143/mosque.svg')" }}
      ></div>
      
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16 items-center">
        
        <div className="lg:w-1/2 text-white">
          <p className="text-[#d97736] font-bold text-sm tracking-widest mb-6 uppercase flex items-center gap-3">
            <span className="w-8 h-[2px] bg-[#d97736]"></span>
            Закот - Рукни сеюми ислом
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.2] mb-8">
            Закот дар миёни панҷ рукни бинои Ислом яке аз се рукни муҳимтарини он ба шумор меравад.
          </h2>
          <p className="text-white/60 text-lg leading-relaxed max-w-lg mb-8">
            Мавҷудият ва бақои имон ва исломи банда ба онҳо вобастагӣ дорад.
          </p>
        </div>
        
        <div className="lg:w-1/2 w-full">
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
            {/* Glossy effect */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none"></div>

            <p className="text-xl md:text-2xl font-medium leading-relaxed mb-8">
              Закот <span className="text-[#d97736] font-bold">2,5%</span> аз арзиши умумии молро, ки аз нисоб зиёд аст, талаб мекунад. Айни замон нисоб <span className="font-bold text-white">595 грамм нуқра</span> ё <span className="font-bold text-white">85 грамм тилло</span> муқаррар шудааст.
            </p>
            
            <div className="bg-black/20 p-6 rounded-2xl mb-10 border border-white/5">
              <p className="text-white/80 leading-relaxed text-sm md:text-base">
                Тибқи қарори Маркази исломии Ҷумҳурии Тоҷикистон, дар соли 2026 миқдори нисоб <span className="font-bold text-white text-lg">64 000 сомонӣ</span> муқаррар шудааст, ки аз он <span className="font-bold text-[#d97736] text-lg">1600 сомонӣ</span> закот дода мешавад.
              </p>
            </div>
            
            <button className="w-full sm:w-auto bg-white text-[#0d1e1c] px-8 py-4 rounded-full font-bold tracking-widest flex items-center justify-center gap-3 hover:bg-[#d97736] hover:text-white transition-all group">
              ҲИСОБ КАРДАНИ ЗАКОТ
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
