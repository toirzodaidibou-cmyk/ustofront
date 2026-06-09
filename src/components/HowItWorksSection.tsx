"use client";

import React, { useEffect, useRef } from "react";
import { Search, BarChart3, Phone } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguageStore } from "@/store/useLanguageStore";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HowItWorksSection() {
  const { t } = useLanguageStore();
  const sectionRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      number: "01",
      title: t("homepage.howItWorks.step1Title"),
      description: t("homepage.howItWorks.step1Desc"),
      icon: Search,
    },
    {
      number: "02",
      title: t("homepage.howItWorks.step2Title"),
      description: t("homepage.howItWorks.step2Desc"),
      icon: BarChart3,
    },
    {
      number: "03",
      title: t("homepage.howItWorks.step3Title"),
      description: t("homepage.howItWorks.step3Desc"),
      icon: Phone,
    },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hiw-header",
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
        ".hiw-step",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
          },
        }
      );

      gsap.fromTo(
        ".hiw-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="w-full bg-[#FAFAF9] py-24 md:py-32 border-t border-[#E5E5E5]"
    >
      <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <p className="hiw-header text-[13px] font-semibold tracking-[0.1em] uppercase text-[#C2410C] mb-4">
            {t("homepage.howItWorks.badge")}
          </p>
          <h2 className="hiw-header text-[32px] md:text-[40px] lg:text-[48px] font-bold text-[#111] tracking-[-0.03em] leading-[1.1]">
            {t("homepage.howItWorks.title")}
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Connecting line (hidden on mobile, hidden after last) */}
                {index < steps.length - 1 && (
                  <div className="hiw-line hidden md:block absolute top-[52px] left-[60%] right-0 h-[1px] bg-[#E5E5E5] origin-left z-0" />
                )}

                <div className="hiw-step flex flex-col items-center text-center px-8 py-8 md:py-0 relative z-10">
                  {/* Number Badge */}
                  <div className="relative mb-8">
                    <div className="w-[104px] h-[104px] rounded-2xl bg-white border border-[#E5E5E5] flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                      <Icon
                        size={36}
                        strokeWidth={1.2}
                        className="text-[#111]"
                      />
                    </div>
                    <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#111] text-white text-[12px] font-bold flex items-center justify-center">
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-[20px] font-semibold text-[#111] mb-3 tracking-[-0.02em]">
                    {step.title}
                  </h3>
                  <p className="text-[14px] text-[#6B7280] leading-relaxed max-w-[280px]">
                    {step.description}
                  </p>
                </div>

                {/* Mobile separator */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center py-2">
                    <div className="w-[1px] h-8 bg-[#E5E5E5]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
