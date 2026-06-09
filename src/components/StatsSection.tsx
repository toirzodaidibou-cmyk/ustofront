"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguageStore } from "@/store/useLanguageStore";
import { adminApi } from "@/services/admin.service";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function CountUp({
  target,
  isDecimal,
  suffix,
  shouldAnimate,
}: {
  target: number;
  isDecimal?: boolean;
  suffix: string;
  shouldAnimate: boolean;
}) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!shouldAnimate || hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 2000;
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = eased * target;

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [shouldAnimate, target]);

  const displayValue = isDecimal
    ? count.toFixed(1)
    : Math.floor(count).toLocaleString();

  return (
    <span>
      {displayValue}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const { t } = useLanguageStore();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [backendStats, setBackendStats] = useState({
    mastersCount: 500,
    ordersCount: 10000,
    averageRating: 4.8,
    citiesCount: 50
  });

  useEffect(() => {
    adminApi.getStats().then(data => {
      if (data) setBackendStats(data);
    });
  }, []);

  const stats = [
    { value: backendStats.mastersCount, suffix: "+", label: t("homepage.stats.masters") },
    { value: backendStats.ordersCount, suffix: "+", label: t("homepage.stats.orders") },
    { value: backendStats.averageRating, suffix: "", label: t("homepage.stats.rating"), isDecimal: true },
    { value: backendStats.citiesCount, suffix: "+", label: t("homepage.stats.cities") },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        onEnter: () => setIsVisible(true),
        once: true,
      });

      gsap.fromTo(
        ".stat-item",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-[#111111] py-20 md:py-24">
      <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-item flex flex-col items-center text-center py-4"
            >
              <span className="text-[36px] md:text-[44px] font-bold text-white tracking-[-0.03em] leading-none mb-3">
                <CountUp
                  target={stat.value}
                  isDecimal={stat.isDecimal}
                  suffix={stat.suffix}
                  shouldAnimate={isVisible}
                />
              </span>
              <span className="text-[14px] text-white/50 font-medium">
                {stat.label}
              </span>
              {/* Subtle divider between items on desktop */}
              {index < stats.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-12 bg-white/10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
