"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import gsap from "gsap";
import { useLanguageStore } from "@/store/useLanguageStore";


const SLIDES = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2000&auto=format&fit=crop",
  },
];

export default function SwiperHero() {
  const { t } = useLanguageStore();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.3,
      });

      tl.fromTo(
        ".hero-badge",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 }
      );

      tl.fromTo(
        ".hero-heading",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        "-=0.5"
      );

      tl.fromTo(
        ".hero-desc",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.6"
      );

      tl.fromTo(
        ".hero-actions",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.5"
      );

      tl.fromTo(
        ".hero-pagination-wrapper",
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        "-=0.3"
      );
    }, contentRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero-section" className="relative w-full bg-[#FAFAF9] pt-0">
      {/* Full-viewport hero container */}
      <div className="relative w-full h-[100vh] min-h-[600px] overflow-hidden">
        {/* Swiper Background */}
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          speed={1200}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            el: ".hero-custom-pagination",
            bulletClass: "custom-bullet",
            bulletActiveClass: "custom-bullet-active",
          }}
          loop={true}
          className="absolute inset-0 w-full h-full"
        >
          {SLIDES.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="w-full h-full relative">
                <img
                  src={slide.image}
                  alt="UstoTJ — устоҳои касбӣ"
                  className="w-full h-full object-cover object-center"
                  loading={slide.id === 1 ? "eager" : "lazy"}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Dark Overlay Gradient */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#000000]/80 via-[#000000]/50 to-[#000000]/20" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#000000]/60 via-transparent to-[#000000]/30" />

        {/* Content */}
        <div
          ref={contentRef}
          className="absolute inset-0 z-20 flex flex-col justify-end pb-16 md:pb-20 lg:pb-24"
        >
          <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-6 lg:px-8 w-full">
            {/* Badge */}
            <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/90 text-[13px] font-medium mb-8 opacity-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C]" />
              {t("homepage.hero.badge")}
            </div>

            {/* Heading */}
            <h1 className="hero-heading text-[40px] sm:text-[52px] md:text-[64px] lg:text-[76px] font-bold text-white tracking-[-0.03em] leading-[1.05] max-w-4xl mb-6 opacity-0">
              {t("homepage.hero.titleStart")}
              <br />
              <span className="text-white/60">{t("homepage.hero.titleEnd")}</span>
            </h1>

            {/* Description */}
            <p className="hero-desc text-[16px] sm:text-[18px] text-white/60 leading-relaxed max-w-xl mb-10 font-normal opacity-0">
              {t("homepage.hero.desc")}
            </p>

            {/* Action Buttons */}
            <div className="hero-actions flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-10 opacity-0">
              <Link
                href="/masters"
                id="hero-find-master-btn"
                className="group flex items-center justify-center gap-2.5 bg-white text-[#111] px-7 py-4 rounded-xl font-semibold text-[15px] hover:bg-[#F5F5F4] transition-all duration-300 shadow-lg shadow-black/10"
              >
                <Search size={18} strokeWidth={2.5} />
                {t("homepage.hero.findMaster")}
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-0.5 transition-transform duration-300"
                />
              </Link>
              <Link
                href="/register"
                id="hero-become-master-btn"
                className="group flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/15 px-7 py-4 rounded-xl font-medium text-[15px] hover:bg-white/20 transition-all duration-300"
              >
                {t("homepage.hero.becomeMaster")}
                <ArrowRight
                  size={16}
                  className="text-white/50 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300"
                />
              </Link>
            </div>

            {/* Pagination */}
            <div className="hero-pagination-wrapper opacity-0">
              <div className="hero-custom-pagination flex gap-2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
