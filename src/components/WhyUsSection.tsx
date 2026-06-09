"use client";

import React, { useEffect, useRef } from "react";
import { ShieldCheck, Eye, Clock, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguageStore } from "@/store/useLanguageStore";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function WhyUsSection() {
  const { t } = useLanguageStore();
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const cards = [
    {
      title: t("homepage.whyUs.card1Title"),
      description: t("homepage.whyUs.card1Desc"),
      icon: ShieldCheck,
      image:
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: t("homepage.whyUs.card2Title"),
      description: t("homepage.whyUs.card2Desc"),
      icon: Eye,
      image:
        "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: t("homepage.whyUs.card3Title"),
      description: t("homepage.whyUs.card3Desc"),
      icon: Clock,
      image:
        "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop",
    },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".whyus-header",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        cardsRef.current.filter(Boolean),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white py-24 md:py-32"
    >
      <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 md:mb-20">
          <div className="max-w-2xl">
            <p className="whyus-header text-[13px] font-semibold tracking-[0.1em] uppercase text-[#C2410C] mb-4">
              {t("homepage.whyUs.badge")}
            </p>
            <h2 className="whyus-header text-[32px] md:text-[40px] lg:text-[48px] font-bold text-[#111] tracking-[-0.03em] leading-[1.1]">
              {t("homepage.whyUs.title").split(" — ")[0]} —{" "}
              <span className="text-[#6B7280]">{t("homepage.whyUs.title").split(" — ")[1] || "беҳтаринем."}</span>
            </h2>
          </div>
          <p className="whyus-header text-[15px] text-[#6B7280] max-w-sm leading-relaxed pb-1">
            {t("homepage.whyUs.desc")}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className="group relative bg-[#FAFAF9] rounded-2xl border border-[#E5E5E5] overflow-hidden flex flex-col h-[480px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-1"
              >
                {/* Image Area */}
                <div className="relative h-[220px] w-full overflow-hidden bg-[#F0F0EE]">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF9] via-transparent to-transparent opacity-60" />
                </div>

                {/* Content */}
                <div className="p-7 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-white border border-[#E5E5E5] flex items-center justify-center">
                      <Icon
                        size={20}
                        strokeWidth={1.5}
                        className="text-[#C2410C]"
                      />
                    </div>
                    <div className="w-8 h-8 rounded-full border border-[#E5E5E5] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400 bg-white">
                      <ArrowUpRight size={14} className="text-[#6B7280]" />
                    </div>
                  </div>

                  <h3 className="text-[20px] font-semibold text-[#111] mb-3 tracking-[-0.02em]">
                    {card.title}
                  </h3>
                  <p className="text-[14px] text-[#6B7280] leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
