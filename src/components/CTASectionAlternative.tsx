"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguageStore } from "@/store/useLanguageStore";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CTASection() {
  const { t } = useLanguageStore();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cta-content",
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-white py-24 md:py-32">
      <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="cta-content relative bg-[#FAFAF9] border border-[#E5E5E5] rounded-3xl p-12 md:p-16 lg:p-20 text-center overflow-hidden">
          {/* Subtle background accent */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#C2410C]/[0.03] rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-[#C2410C]/[0.02] rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10">
            <p className="text-[13px] font-semibold tracking-[0.1em] uppercase text-[#C2410C] mb-5">
              {t("homepage.cta.badge")}
            </p>
            <h2 className="text-[28px] md:text-[36px] lg:text-[44px] font-bold text-[#111] tracking-[-0.03em] leading-[1.15] max-w-2xl mx-auto mb-6">
              {t("homepage.cta.title")}
            </h2>
            <p className="text-[15px] md:text-[16px] text-[#6B7280] leading-relaxed max-w-lg mx-auto mb-10">
              {t("homepage.cta.desc")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/masters"
                id="cta-find-master-btn"
                className="group flex items-center gap-2.5 bg-[#111] text-white px-8 py-4 rounded-xl font-semibold text-[15px] hover:bg-[#C2410C] transition-all duration-300 shadow-lg shadow-black/10"
              >
                {t("homepage.cta.findMaster")}
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
              <Link
                href="/register"
                id="cta-become-master-btn"
                className="group flex items-center gap-2 bg-white text-[#111] border border-[#E5E5E5] px-8 py-4 rounded-xl font-medium text-[15px] hover:bg-[#FAFAF9] hover:border-[#D1D5DB] transition-all duration-300"
              >
                {t("homepage.cta.becomeMaster")}
                <ArrowRight
                  size={16}
                  className="text-[#6B7280] group-hover:text-[#111] group-hover:translate-x-0.5 transition-all"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
