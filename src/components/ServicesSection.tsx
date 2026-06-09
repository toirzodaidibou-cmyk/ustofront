"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Settings,
  Zap,
  Droplets,
  Hammer,
  Wrench,
  Snowflake,
  Truck,
  Sofa,
  ArrowRight,
  Loader2,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguageStore } from "@/store/useLanguageStore";
import { categoriesApi } from "@/services/categories.service";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ICON_MAP: Record<string, any> = {
  Settings,
  Zap,
  Droplets,
  Hammer,
  Wrench,
  Snowflake,
  Truck,
  Sofa,
};

export default function ServicesSection() {
  const { t, currentLanguage } = useLanguageStore();
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getAllCategories();
        setCategories(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!sectionRef.current || categories.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".services-header",
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
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [categories]);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="w-full bg-[#FAFAF9] py-24 md:py-32"
    >
      <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 md:mb-20">
          <div className="max-w-2xl">
            <p className="services-header text-[13px] font-semibold tracking-[0.1em] uppercase text-[#C2410C] mb-4">
              {t("categories.title")}
            </p>
            <h2 className="services-header text-[32px] md:text-[40px] lg:text-[48px] font-bold text-[#111] tracking-[-0.03em] leading-[1.1]">
              {currentLanguage === 'tg' ? (
                <>Ҳар навъ кор — <span className="text-[#6B7280]">як усто.</span></>
              ) : currentLanguage === 'ru' ? (
                <>Любая работа — <span className="text-[#6B7280]">один мастер.</span></>
              ) : (
                <>Any job — <span className="text-[#6B7280]">one master.</span></>
              )}
            </h2>
          </div>
          <div className="hidden md:block services-header pb-1">
            <Link href="/masters" className="group flex items-center gap-3 text-[14px] font-medium text-[#111] transition-colors">
              <span className="border-b border-[#E5E5E5] group-hover:border-[#111] transition-colors pb-0.5">
                {currentLanguage === 'tg' ? 'Ҳамаи самтҳо' : currentLanguage === 'ru' ? 'Все направления' : 'All categories'}
              </span>
              <div className="w-9 h-9 rounded-full border border-[#E5E5E5] flex items-center justify-center group-hover:bg-[#111] group-hover:text-white group-hover:border-[#111] transition-all duration-300">
                <ArrowRight size={14} strokeWidth={2} />
              </div>
            </Link>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-orange-500" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, index) => {
              const Icon = ICON_MAP[cat.icon] || Settings;
              const title = currentLanguage === 'tg' ? cat.nameTg : currentLanguage === 'ru' ? cat.nameRu : cat.nameEn;
              const desc = currentLanguage === 'tg' ? cat.descTg : currentLanguage === 'ru' ? cat.descRu : cat.descEn;
              
              return (
                <Link
                  key={cat._id || index}
                  href={`/masters?category=${cat.categoryId}`}
                  ref={(el) => {
                    cardsRef.current[index] = el;
                  }}
                  className="group relative flex flex-col justify-between p-7 bg-white dark:bg-[#18181b] border border-[#E5E5E5] dark:border-white/10 rounded-2xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-400 cursor-pointer min-h-[200px] hover:-translate-y-0.5"
                >
                  {/* Icon */}
                  <div className="flex items-start justify-between mb-10">
                    <div className="w-12 h-12 rounded-xl bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-center group-hover:bg-[#111] group-hover:border-[#111] transition-all duration-400">
                      <Icon
                        size={22}
                        strokeWidth={1.5}
                        className="text-[#6B7280] group-hover:text-white transition-colors duration-400"
                      />
                    </div>
                    <div className="w-7 h-7 rounded-full border border-[#E5E5E5] flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-400">
                      <ArrowRight size={12} className="text-[#6B7280]" />
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#111] mb-1.5 tracking-[-0.01em]">
                      {title}
                    </h3>
                    <p className="text-[13px] text-[#6B7280] leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Mobile CTA */}
        <Link href="/masters" className="mt-6 md:hidden w-full group flex items-center justify-between text-[14px] font-medium text-[#111] bg-white border border-[#E5E5E5] p-5 rounded-2xl hover:bg-[#FAFAF9] transition-colors">
          <span>{currentLanguage === 'tg' ? 'Ҳамаи самтҳо' : currentLanguage === 'ru' ? 'Все направления' : 'All categories'}</span>
          <ArrowRight
            size={16}
            className="text-[#6B7280] group-hover:text-[#111] transition-colors"
          />
        </Link>
      </div>
    </section>
  );
}
