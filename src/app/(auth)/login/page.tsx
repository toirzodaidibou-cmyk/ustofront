"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone, Lock, ArrowLeft, Eye, EyeOff, Loader2, CheckCircle2,
  ShieldCheck, Star, Zap, ChevronRight, User
} from "lucide-react";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";

const TRUST_POINTS = [
  { icon: ShieldCheck, text: "Устоҳои санҷидашуда ва боэътимод" },
  { icon: Star, text: "Рейтинг ва фикри мизоҷон" },
  { icon: Zap, text: "Фармоиши зуд ва бехатар" },
];

type Tab = "client" | "master";

function Input({
  label, icon: Icon, type = "text", placeholder, value, onChange, required, extra
}: {
  label: string; icon: any; type?: string; placeholder: string;
  value: string; onChange: (v: string) => void; required?: boolean; extra?: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  const isPass = type === "password";
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-[#1a1a1a]">{label}</label>
        {extra}
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#9ca3af]">
          <Icon size={17} />
        </div>
        <input
          type={isPass && show ? "text" : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className="w-full bg-[#f8f8f7] border border-[#e5e5e3] rounded-2xl pl-11 pr-11 py-3.5 text-[#1a1a1a] text-[15px] placeholder:text-[#c0bfba] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
        />
        {isPass && (
          <button type="button" onClick={() => setShow(!show)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#9ca3af] hover:text-[#1a1a1a] transition-colors">
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}

function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div className={`p-3.5 rounded-2xl text-sm font-semibold flex items-center gap-2 ${type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
      {type === "success" ? <CheckCircle2 size={16} /> : <span>⚠️</span>}
      {msg}
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("client");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) { setToast({ msg: "Рақами телефонро ворид кунед", type: "error" }); return; }
    setLoading(true);
    setToast(null);
    try {
      await authService.login(phone.trim());
      setToast({ msg: "Хуш омадед! Ба профил гузаштан...", type: "success" });
      setTimeout(() => router.push("/profile"), 1000);
    } catch {
      setToast({ msg: "Рақам ё рамз нодуруст аст. Аз нав кӯшиш кунед.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#fafaf9] font-sans">

      {/* ── Left Brand Panel ── */}
      <div className="hidden lg:flex w-[45%] bg-[#111111] flex-col justify-between p-14 relative overflow-hidden">
        {/* Subtle glow blobs */}
        <div className="absolute top-[-15%] left-[-10%] w-[480px] h-[480px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[5%] right-[-10%] w-[360px] h-[360px] bg-orange-600/8 rounded-full blur-[80px] pointer-events-none" />

        {/* Top: Logo + back */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors group text-sm mb-16">
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Ба саҳифаи асосӣ
          </Link>

          <div className="mb-3">
            <span className="text-sm font-semibold text-orange-500 tracking-widest uppercase">Usto.TJ</span>
          </div>
          <h1 className="text-[46px] font-black text-white leading-[1.1] tracking-tight mb-6">
            Беҳтарин<br />устоҳоро<br />
            <span className="text-orange-500">дар як ҷо</span><br />ёбед.
          </h1>
          <p className="text-white/50 text-[16px] leading-relaxed max-w-sm">
            UstoTJ ба шумо устоҳои санҷидашуда, рейтингдор ва боэътимодро пешниҳод мекунад.
          </p>
        </div>

        {/* Bottom: Trust points */}
        <div className="relative z-10 space-y-4">
          {TRUST_POINTS.map((p, i) => (
            <div key={i} className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-orange-500/15 flex items-center justify-center shrink-0">
                <p.icon size={17} className="text-orange-400" />
              </div>
              <span className="text-white/65 text-sm font-medium">{p.text}</span>
            </div>
          ))}
          <div className="pt-4 border-t border-white/8 text-white/25 text-xs">
            © 2024 UstoTJ — Платформаи устоҳои Тоҷикистон
          </div>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:py-0">

        {/* Mobile back link */}
        <div className="lg:hidden w-full max-w-sm mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[#9ca3af] hover:text-[#1a1a1a] transition-colors text-sm">
            <ArrowLeft size={16} /> Ба саҳифаи асосӣ
          </Link>
        </div>

        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-[#111111] tracking-tight mb-2">Хуш омадед 👋</h2>
            <p className="text-[#8c8c8c] text-[15px]">Ба профили худ даромадан кунед.</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-[#f0efed] p-1 rounded-2xl mb-8 border border-[#e8e7e4]">
            {(["client", "master"] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${tab === t ? "bg-white text-[#111111] shadow-sm border border-[#e8e7e4]" : "text-[#9ca3af] hover:text-[#1a1a1a]"}`}>
                <User size={14} />
                {t === "client" ? "Муштарӣ" : "Усто"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {toast && <Toast msg={toast.msg} type={toast.type} />}

            <Input label="Рақами телефон" icon={Phone} type="tel" placeholder="+992 00 000 0000"
              value={phone} onChange={setPhone} required />

            <Input label="Рамз (Парол)" icon={Lock} type="password" placeholder="••••••••"
              value={password} onChange={setPassword}
              extra={<a href="#" className="text-xs font-semibold text-orange-600 hover:text-orange-700">Фаромӯш кардед?</a>} />

            <button type="submit" disabled={loading}
              className="w-full bg-[#111111] hover:bg-[#1f1f1f] disabled:opacity-60 text-white rounded-2xl py-4 font-bold text-[15px] transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 group">
              {loading
                ? <><Loader2 size={18} className="animate-spin" /> Боркунӣ...</>
                : <>{tab === "client" ? "Даромадан ҳамчун муштарӣ" : "Даромадан ҳамчун усто"} <ChevronRight size={17} className="group-hover:translate-x-0.5 transition-transform" /></>}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 h-px bg-[#e8e7e4]" />
            <span className="text-xs text-[#c0bfba] font-medium">ё</span>
            <div className="flex-1 h-px bg-[#e8e7e4]" />
          </div>

          {/* Register link */}
          <div className="text-center space-y-2">
            <p className="text-[14px] text-[#8c8c8c]">
              Усто ҳастед ва профил надоред?{" "}
              <Link href="/register" className="font-bold text-orange-600 hover:text-orange-700 transition-colors">
                Сабти ном кунед
              </Link>
            </p>
            <p className="text-[13px] text-[#b8b7b3]">
              Ба муштарӣ ниёз нест — мустақим вориди кунед ☝️
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
