"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight, User, LogOut, MessageSquare } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { ThemeToggle } from "./ThemeToggle";
import NotificationBell from "./layout/NotificationBell";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { currentUser, isAuthenticated, logout } = useAuthStore();
  const { currentLanguage, setLanguage, t } = useLanguageStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  const navLinks = [
    { label: t("common.findMasters"), href: "/masters" },
    { label: t("common.reels"), href: "/reels" },
  ];

  return (
    <>
      <nav
        id="main-navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
            ? "bg-white/95 dark:bg-[#111111]/95 backdrop-blur-xl shadow-[0_1px_0_0_#E5E5E5] dark:shadow-[0_1px_0_0_#222]"
            : "bg-transparent"
          }`}
      >
        <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-0.5 group relative z-10">
              <span className={`text-[22px] font-bold tracking-[-0.03em] transition-colors duration-300 ${isScrolled ? "text-[#111] dark:text-white" : "text-white"
                }`}>
                Usto
              </span>
              <span className="text-[22px] font-bold tracking-[-0.03em] text-[#C2410C]">
                TJ
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-[14px] font-medium transition-all duration-300 ${isScrolled
                      ? "text-[#6B7280] hover:text-[#111] hover:bg-[#F5F5F4] dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Language Switcher */}
              <div className="relative group">
                <button
                  className={`text-[13px] font-bold px-3 py-2 rounded-xl border transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                    isScrolled
                      ? "text-stone-700 border-stone-200 hover:bg-stone-50 dark:text-stone-300 dark:border-stone-800 dark:hover:bg-stone-800"
                      : "text-white border-white/20 hover:bg-white/10"
                  }`}
                >
                  <span>{currentLanguage === 'tg' ? '🇹🇯' : currentLanguage === 'ru' ? '🇷🇺' : '🇬🇧'}</span>
                  <span className="uppercase text-[11px]">{currentLanguage}</span>
                </button>
                <div className="absolute right-0 top-[calc(100%+8px)] bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 shadow-xl rounded-xl py-1.5 w-32 hidden group-hover:block z-50">
                  <button
                    onClick={() => setLanguage('tg')}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-2 cursor-pointer"
                  >
                    <span>🇹🇯</span> Тоҷикӣ
                  </button>
                  <button
                    onClick={() => setLanguage('ru')}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-2 cursor-pointer"
                  >
                    <span>🇷🇺</span> Русский
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-2 cursor-pointer"
                  >
                    <span>🇬🇧</span> English
                  </button>
                </div>
              </div>

              <ThemeToggle isScrolled={isScrolled} />
              
              {isAuthenticated && currentUser ? (
                <>
                  <Link
                    href="/chat"
                    className={`p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center cursor-pointer ${isScrolled
                        ? "text-stone-600 hover:bg-stone-50 dark:text-stone-300 dark:hover:bg-stone-800"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    title={t("common.chat")}
                  >
                    <MessageSquare size={18} />
                  </Link>

                  <NotificationBell isScrolled={isScrolled} />

                  <Link
                    href="/profile"
                    className={`flex items-center gap-2 text-[14px] font-semibold px-3 py-2 rounded-xl transition-all duration-300 ${isScrolled
                        ? "text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200"
                        : "text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20"
                      }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border border-orange-500/40 overflow-hidden ${currentUser.avatar ? "" : "bg-gradient-to-tr from-orange-600 to-orange-800"}`}>
                      {currentUser.avatar
                        ? <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
                        : <span className="text-white font-bold text-[9px]">{currentUser.firstName?.[0]?.toUpperCase()}</span>
                      }
                    </div>
                    <span>{currentUser.firstName}</span>
                  </Link>
                  <button
                    onClick={() => logout()}
                    className={`text-[14px] font-semibold p-2.5 rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center ${isScrolled
                        ? "text-red-500 hover:bg-red-50"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    title={t("common.logout")}
                  >
                    <LogOut size={18} />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/register"
                    className={`text-[14px] font-medium px-4 py-2 rounded-lg transition-all duration-300 ${isScrolled
                        ? "text-[#6B7280] hover:text-[#111] hover:bg-[#F5F5F4] dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                  >
                    {t("common.register")}
                  </Link>
                  <Link
                    href="/login"
                    id="navbar-login-btn"
                    className={`text-[14px] font-medium px-5 py-2.5 rounded-xl transition-all duration-300 ${isScrolled
                        ? "bg-[#111] text-white hover:bg-[#C2410C]"
                        : "bg-white text-[#111] hover:bg-white/90"
                      }`}
                  >
                    {t("common.login")}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Nav Icons (Right Side) */}
            <div className="flex items-center gap-1.5 lg:hidden relative z-10">
              {isAuthenticated && currentUser && (
                <Link
                  href="/chat"
                  className={`p-2 rounded-xl flex items-center justify-center transition-colors relative cursor-pointer ${
                    isMobileOpen
                      ? "text-white"
                      : isScrolled
                        ? "text-[#111] hover:bg-[#F5F5F4]"
                        : "text-white hover:bg-white/10"
                  }`}
                  title={t("common.chat")}
                >
                  <MessageSquare size={20} />
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#25D366] border-2 border-transparent rounded-full animate-pulse"></span>
                </Link>
              )}

              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
                  isMobileOpen
                    ? "text-white"
                    : isScrolled
                      ? "text-[#111] hover:bg-[#F5F5F4]"
                      : "text-white hover:bg-white/10"
                  }`}
                aria-label="Toggle menu"
              >
                {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 lg:hidden ${isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-[#0A0A0A]/95 backdrop-blur-xl"
          onClick={() => setIsMobileOpen(false)}
        />

        {/* Content */}
        <div className={`relative z-10 flex flex-col justify-center h-full px-8 transition-all duration-500 ${isMobileOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}>
          <div className="space-y-1">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center justify-between py-4 text-white text-[28px] font-semibold tracking-tight border-b border-white/10 hover:text-[#C2410C] transition-colors group"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <span>{link.label}</span>
                <ChevronRight
                  size={20}
                  className="text-white/30 group-hover:text-[#C2410C] group-hover:translate-x-1 transition-all"
                />
              </Link>
            ))}
          </div>

          {/* Mobile Language Switcher */}
          <div className="flex justify-center gap-3 mt-8 border-b border-white/10 pb-6">
            <button
              onClick={() => setLanguage('tg')}
              className={`flex-1 max-w-[100px] text-center py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentLanguage === 'tg' ? 'bg-white text-black' : 'text-white/60 bg-white/5 border border-white/10'
              }`}
            >
              🇹🇯 TG
            </button>
            <button
              onClick={() => setLanguage('ru')}
              className={`flex-1 max-w-[100px] text-center py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentLanguage === 'ru' ? 'bg-white text-black' : 'text-white/60 bg-white/5 border border-white/10'
              }`}
            >
              🇷🇺 RU
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`flex-1 max-w-[100px] text-center py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentLanguage === 'en' ? 'bg-white text-black' : 'text-white/60 bg-white/5 border border-white/10'
              }`}
            >
              🇬🇧 EN
            </button>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            {isAuthenticated && currentUser ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setIsMobileOpen(false)}
                  className="w-full bg-[#C2410C] text-white text-center py-4 rounded-xl font-bold text-[16px] hover:bg-[#A1340A] transition-colors flex items-center justify-center gap-2"
                >
                  <User size={18} /> {t("common.profile")} ({currentUser.firstName})
                </Link>
                <button
                  onClick={() => { logout(); setIsMobileOpen(false); }}
                  className="w-full bg-white/10 text-white text-center py-4 rounded-xl font-medium text-[16px] border border-white/10 hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut size={18} /> {t("common.logout")}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileOpen(false)}
                  className="w-full bg-white text-[#111] text-center py-4 rounded-xl font-semibold text-[16px] hover:bg-white/90 transition-colors"
                >
                  {t("common.login")}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileOpen(false)}
                  className="w-full bg-white/10 text-white text-center py-4 rounded-xl font-medium text-[16px] border border-white/10 hover:bg-white/20 transition-colors"
                >
                  {t("common.register")}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
