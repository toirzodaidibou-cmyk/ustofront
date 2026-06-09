"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Copy } from "lucide-react";
import gsap from "gsap";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(".bg-noise", { opacity: 0 }, { opacity: 0.6, duration: 2 });

      // Floating 3D Icons Entrance
      tl.fromTo(
        ".floating-icon",
        { y: 100, opacity: 0, scale: 0, rotate: -45 },
        { y: 0, opacity: 1, scale: 1, rotate: 0, duration: 1.5, stagger: 0.2, ease: "back.out(1.5)" },
        "-=1.5"
      );

      // Continuous float animation
      gsap.to(".floating-icon-1", { y: -20, duration: 2.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".floating-icon-2", { y: 25, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.5 });
      gsap.to(".floating-icon-3", { y: -30, rotate: 10, duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1 });
      gsap.to(".floating-icon-4", { y: 20, rotate: -15, duration: 2.8, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.2 });

      tl.fromTo(
        ".hero-pill",
        { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 1 },
        "-=1.5"
      );

      tl.fromTo(
        ".hero-title",
        { y: 60, opacity: 0, rotateX: -20 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.1 },
        "-=0.8"
      );

      tl.fromTo(
        ".hero-sub",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15 },
        "-=0.9"
      );

      tl.fromTo(
        ".hero-action",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1 },
        "-=0.7"
      );

      // Magnetic Button Effect
      const magneticBtns = document.querySelectorAll(".magnetic-btn");
      magneticBtns.forEach((btn) => {
        btn.addEventListener("mousemove", (e: any) => {
          const rect = btn.getBoundingClientRect();
          const x = (e.clientX - rect.left - rect.width / 2) * 0.4;
          const y = (e.clientY - rect.top - rect.height / 2) * 0.4;
          gsap.to(btn, { x, y, duration: 0.4, ease: "power2.out" });
          
          // Also slightly move the text inside
          const text = btn.querySelector(".btn-text");
          if (text) {
             gsap.to(text, { x: x * 0.5, y: y * 0.5, duration: 0.4, ease: "power2.out" });
          }
        });
        btn.addEventListener("mouseleave", () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
          const text = btn.querySelector(".btn-text");
          if (text) {
             gsap.to(text, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
          }
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full min-h-[100vh] flex flex-col justify-center bg-[#fbfaf8] overflow-hidden pt-32 pb-24 [perspective:1000px]">
      <div className="bg-noise absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-100/40 via-transparent to-transparent opacity-0"></div>

      {/* Realistic 3D Floating Icons */}
      <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Wrench.png" alt="Wrench" className="floating-icon floating-icon-1 absolute top-[20%] right-[15%] w-24 h-24 md:w-32 md:h-32 drop-shadow-2xl z-0 blur-[1px] opacity-80" />
      <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png" alt="Rocket" className="floating-icon floating-icon-2 absolute bottom-[25%] right-[5%] w-32 h-32 md:w-48 md:h-48 drop-shadow-2xl z-20" />
      <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Shield.png" alt="Shield" className="floating-icon floating-icon-3 absolute top-[30%] left-[5%] w-20 h-20 md:w-28 md:h-28 drop-shadow-2xl z-0 opacity-90 blur-[2px]" />
      <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Light%20Bulb.png" alt="Idea" className="floating-icon floating-icon-4 absolute bottom-[15%] left-[12%] w-28 h-28 md:w-36 md:h-36 drop-shadow-2xl z-20" />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start">
        
        <div className="hero-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200/60 text-[#d95d39] text-sm font-medium mb-8 cursor-pointer hover:bg-orange-100/50 transition-colors opacity-0 shadow-sm backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d95d39]"></span>
          Платформаи нави UstoTJ <ArrowRight size={14} className="ml-1" />
        </div>

        <h1 className="flex gap-2 text-7xl md:text-8xl lg:text-[120px] font-semibold text-[#1a1a1a] tracking-[-0.04em] leading-[1.05] mb-8 overflow-hidden drop-shadow-sm">
          <span className="hero-title inline-block origin-bottom">U</span>
          <span className="hero-title inline-block origin-bottom">s</span>
          <span className="hero-title inline-block origin-bottom">t</span>
          <span className="hero-title inline-block origin-bottom">o</span>
          <span className="hero-title inline-block origin-bottom text-[#d95d39]">T</span>
          <span className="hero-title inline-block origin-bottom text-[#d95d39]">J</span>
          <span className="hero-title inline-block origin-bottom text-[#d95d39]">.</span>
        </h1>
        
        <h2 className="hero-sub text-3xl md:text-5xl lg:text-[56px] font-medium text-[#1a1a1a] tracking-tight leading-[1.1] max-w-4xl mb-6 opacity-0">
          Платформа барои дарёфти устоҳои боэътимод дар Тоҷикистон
        </h2>

        <p className="hero-sub text-xl md:text-2xl text-[#d95d39] font-medium tracking-tight mb-8 opacity-0">
          Тез. Боэътимод. Бе зангҳои зиёдатӣ.
        </p>

        <p className="hero-sub text-lg md:text-xl text-[#666666] leading-relaxed max-w-2xl mb-14 font-medium opacity-0">
          Пойгоҳи ягонаи мутахассисони санҷидашуда. Шарҳҳоро хонед, нархҳоро муқоиса кунед ва беҳтарин устоҳоро барои ҳар гуна кор, аз таъмири мошин то сохтмон интихоб намоед.
        </p>



        <div className="flex flex-col sm:flex-row items-center gap-5">
          <button className="magnetic-btn hero-action w-full sm:w-auto bg-[#1a1a1a] text-white px-9 py-4 rounded-xl font-medium text-lg hover:bg-black transition-colors flex items-center justify-center shadow-xl shadow-black/20 opacity-0 relative overflow-hidden group">
            <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
            <span className="btn-text flex items-center pointer-events-none relative z-10">
              Усторо ёфтан <ArrowRight size={20} className="ml-2" />
            </span>
          </button>
          <Link href="/register" className="magnetic-btn hero-action w-full sm:w-auto bg-white/80 backdrop-blur-md text-[#1a1a1a] border border-black/10 px-9 py-4 rounded-xl font-medium text-lg hover:bg-white transition-colors flex items-center justify-center shadow-lg shadow-black/5 opacity-0 group">
            <span className="btn-text flex items-center pointer-events-none">
              Усто шудан <ArrowRight size={20} className="ml-2 text-gray-400 group-hover:text-[#1a1a1a] transition-colors" />
            </span>
          </Link>
        </div>

      </div>
    </section>
  );
}
