import React from "react";
import Link from "next/link";
import { Send, MessageCircle, Instagram, MapPin, Mail } from "lucide-react";

const footerLinks = {
  services: [
    { label: "Механикҳо", href: "#" },
    { label: "Электрикҳо", href: "#" },
    { label: "Сантехникҳо", href: "#" },
    { label: "Кондитсионер", href: "#" },
    { label: "Бинокорон", href: "#" },
    { label: "Устоҳои мебел", href: "#" },
  ],
  links: [
    { label: "Ёфтани устоҳо", href: "/masters" },
    { label: "Видеоҳо (Reels)", href: "/reels" },
    { label: "Усто шудан", href: "/register" },
    { label: "Чӣ тавр кор мекунад", href: "#how-it-works" },
    { label: "Дастгирӣ", href: "#" },
  ],
};

const socials = [
  { icon: Send, href: "https://t.me/ustotj", label: "Telegram" },
  {
    icon: Instagram,
    href: "https://instagram.com/ustotj",
    label: "Instagram",
  },
  {
    icon: MessageCircle,
    href: "https://wa.me/992XXXXXXXXX",
    label: "WhatsApp",
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#0A0A0A] text-[#9CA3AF] pt-16 md:pt-20 pb-8">
      <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-0.5 mb-5">
              <span className="text-[20px] font-bold tracking-[-0.03em] text-white">
                Usto
              </span>
              <span className="text-[20px] font-bold tracking-[-0.03em] text-[#C2410C]">
                TJ
              </span>
            </Link>
            <p className="text-[14px] leading-relaxed text-[#6B7280] mb-6 max-w-xs">
              Платформаи боэътимод барои ёфтани устоҳои санҷидашуда дар саросари
              Тоҷикистон.
            </p>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5 text-[13px] text-[#6B7280]">
                <MapPin size={15} className="text-[#C2410C] shrink-0" />
                <span>Тоҷикистон</span>
              </div>
              <div className="flex items-center gap-2.5 text-[13px] text-[#6B7280]">
                <Mail size={15} className="text-[#C2410C] shrink-0" />
                <span>info@usto.tj</span>
              </div>
            </div>
          </div>

          {/* Services Column */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="text-white font-semibold text-[14px] mb-5 tracking-[-0.01em]">
              Хизматрасониҳо
            </h4>
            <div className="flex flex-col gap-3">
              {footerLinks.services.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[13px] text-[#6B7280] hover:text-white transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Links Column */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold text-[14px] mb-5 tracking-[-0.01em]">
              Линкҳо
            </h4>
            <div className="flex flex-col gap-3">
              {footerLinks.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[13px] text-[#6B7280] hover:text-white transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social Column */}
          <div className="lg:col-span-3 lg:col-start-10">
            <h4 className="text-white font-semibold text-[14px] mb-5 tracking-[-0.01em]">
              Тамос
            </h4>
            <div className="flex flex-col gap-3">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-[13px] text-[#6B7280] hover:text-white transition-colors duration-300"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center group-hover:bg-[#C2410C] group-hover:border-[#C2410C] transition-all duration-300">
                      <Icon size={14} />
                    </div>
                    <span>{social.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-[#1A1A1A] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-[#4B5563]">
            © 2026 UstoTJ. Ҳамаи ҳуқуқҳо маҳфузанд.
          </p>
          <div className="flex gap-6 text-[12px] text-[#4B5563]">
            <Link
              href="#"
              className="hover:text-white transition-colors duration-300"
            >
              Сиёсати махфият
            </Link>
            <Link
              href="#"
              className="hover:text-white transition-colors duration-300"
            >
              Шартҳои хизмат
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
