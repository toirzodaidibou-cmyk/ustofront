"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Phone, User, Briefcase, MapPin, Camera,
  CheckCircle2, ShieldCheck, Star, Zap, Clock, Loader2, Home, Check,
  UserSquare2, Fingerprint, Instagram, Send, MessageCircle, AlertCircle
} from "lucide-react";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";

/* ── Constants ── */
const CITIES = ["Душанбе", "Хуҷанд", "Бохтар", "Кӯлоб", "Истаравшан", "Норак", "Вахш"];
const PROFESSIONS = ["Электрик", "Сантехник", "Механик (Мошин)", "Устои кондиционер", "Бинокор / Таъмир", "Дуредгар / Мебел", "Рангкор", "Дигар"];
const TRUST_POINTS = [
  { icon: ShieldCheck, text: "Устоҳои санҷидашуда" },
  { icon: Star, text: "Рейтинг ва фикри мизоҷон" },
  { icon: Zap, text: "Фармоиши зуд ва бехатар" },
];

/* ── Sub-components ── */
function FormInput({
  label, icon: Icon, type = "text", placeholder, value, onChange, required, hint
}: {
  label: string; icon: any; type?: string; placeholder: string;
  value: string; onChange: (v: string) => void; required?: boolean; hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-[#1a1a1a]">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#9ca3af]">
          <Icon size={16} />
        </div>
        <input
          type={type} value={value} onChange={e => onChange(e.target.value)}
          required={required} placeholder={placeholder}
          className="w-full bg-[#f8f8f7] border border-[#e5e5e3] rounded-2xl pl-11 pr-4 py-3.5 text-[#1a1a1a] text-[15px] placeholder:text-[#c0bfba] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
        />
      </div>
      {hint && <p className="text-xs text-[#9ca3af] pl-1">{hint}</p>}
    </div>
  );
}

function FormSelect({
  label, icon: Icon, value, onChange, options, required
}: {
  label: string; icon: any; value: string; onChange: (v: string) => void;
  options: string[]; required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-[#1a1a1a]">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#9ca3af]">
          <Icon size={16} />
        </div>
        <select value={value} onChange={e => onChange(e.target.value)} required={required}
          className="w-full bg-[#f8f8f7] border border-[#e5e5e3] rounded-2xl pl-11 pr-4 py-3.5 text-[#1a1a1a] text-[15px] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all appearance-none cursor-pointer">
          <option value="">Интихоб кунед...</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    </div>
  );
}

function UploadBox({
  label, hint, icon: Icon, preview, onChange, badge, borderColor
}: {
  label: string; hint: string; icon: any; preview?: string; onChange: (f: File) => void;
  badge?: { text: string; color: string }; borderColor?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <label className="text-sm font-semibold text-[#1a1a1a]">{label}</label>
        {badge && (
          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${badge.color}`}>
            {badge.text}
          </span>
        )}
      </div>
      <label className={`relative flex flex-col items-center justify-center w-full min-h-[140px] border-2 border-dashed rounded-2xl cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition-all group overflow-hidden bg-[#f8f8f7] ${borderColor || "border-[#d9d8d5]"}`}>
        <input type="file" accept="image/*" className="sr-only" onChange={e => { const f = e.target.files?.[0]; if (f) onChange(f); }} />
        {preview
          ? <img src={preview} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
          : (
            <div className="flex flex-col items-center gap-2.5 pointer-events-none p-4">
              <div className="w-12 h-12 rounded-xl bg-[#f0efed] group-hover:bg-orange-100 flex items-center justify-center transition-colors">
                <Icon size={22} className="text-[#9ca3af] group-hover:text-orange-500 transition-colors" />
              </div>
              <span className="text-sm font-semibold text-[#1a1a1a] text-center">{label}</span>
              <span className="text-xs text-[#9ca3af] text-center leading-relaxed">{hint}</span>
            </div>
          )}
        {preview && (
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-sm font-semibold bg-black/40 px-4 py-2 rounded-xl backdrop-blur-sm">Иваз кардан</span>
          </div>
        )}
        {preview && (
          <div className="absolute top-2.5 right-2.5">
            <CheckCircle2 size={22} className="text-emerald-500 drop-shadow-lg" />
          </div>
        )}
      </label>
    </div>
  );
}

/* ── Main Component ── */
export default function RegisterPage() {
  const router = useRouter();
  
  // ROLE STATE: 'client' or 'master'
  const [role, setRole] = useState<'client' | 'master'>('client');

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Form state
  const [avatar, setAvatar] = useState<{ file?: File; preview?: string }>({});
  const [passport, setPassport] = useState<{ file?: File; preview?: string }>({});
  const [selfie, setSelfie] = useState<{ file?: File; preview?: string }>({});
  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "",
    profession: "", experience: "", city: "",
    address: "", instagram: "", telegram: "", whatsapp: "",
  });

  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const STEPS = role === 'master' 
    ? ["Маълумоти шахсӣ", "Кори касбӣ", "Тасдиқи ҳуввият"]
    : ["Маълумоти шахсӣ"];

  const validateStep = () => {
    if (step === 0) {
      if (!form.firstName.trim() || !form.lastName.trim() || !form.phone.trim()) {
        setToast({ msg: "Лутфан Ном, Насаб ва Рақами телефонро пур кунед", type: "error" }); return false;
      }
      if (role === 'client' && !form.city) {
        setToast({ msg: "Лутфан Шаҳрро интихоб кунед", type: "error" }); return false;
      }
    }
    if (role === 'master') {
      if (step === 1) {
        if (!form.profession || !form.experience.trim() || !form.city) {
          setToast({ msg: "Касб, таҷриба ва шаҳрро интихоб кунед", type: "error" }); return false;
        }
      }
      if (step === 2) {
        if (!passport.file) {
          setToast({ msg: "Сурати шиноснома (паспорт) ҳатмӣ аст!", type: "error" }); return false;
        }
      }
    }
    setToast(null);
    return true;
  };

  const nextStep = () => { if (validateStep()) setStep(s => s + 1); };
  const prevStep = () => { setToast(null); setStep(s => s - 1); };

  const handleRoleChange = (newRole: 'client' | 'master') => {
    setRole(newRole);
    setStep(0);
    setToast(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    setToast(null);
    try {
      if (role === 'client') {
        setToast({ msg: "⏳ Маълумот фиристода шуда истодааст...", type: "success" });
        await authService.registerClient({
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          city: form.city,
        });
        setToast({ msg: "✅ Сабти ном муваффақона анҷом ёфт!", type: "success" });
        setTimeout(() => router.push("/profile"), 1000);
      } else {
        // Master Registration
        let avatarUrl: string | undefined;
        if (avatar.file) {
          setToast({ msg: "⏳ Сурати профил бор шуда истодааст...", type: "success" });
          avatarUrl = await authService.uploadAvatar(avatar.file);
        }

        setToast({ msg: "⏳ Сурати шиноснома бор шуда истодааст...", type: "success" });
        const passportUrl = await authService.uploadPassport(passport.file!);

        let selfieUrl: string | undefined;
        if (selfie.file) {
          setToast({ msg: "⏳ Селфи бор шуда истодааст...", type: "success" });
          selfieUrl = await authService.uploadSelfie(selfie.file);
        }

        setToast({ msg: "⏳ Маълумот фиристода шуда истодааст...", type: "success" });
        await authService.registerMaster({
          ...form,
          avatar: avatarUrl,
          passportPhoto: passportUrl,
          selfiePhoto: selfieUrl,
        });

        setToast({ msg: "✅ Профили шумо ба администратор фиристода шуд!", type: "success" });
        setTimeout(() => router.push("/profile"), 1400);
      }
    } catch (err: any) {
      setToast({ msg: err?.message || "Хатогӣ ҳангоми сабти ном. Аз нав кӯшиш кунед.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#fafaf9] font-sans">

      {/* ── Left Brand Panel ── */}
      <div className="hidden lg:flex w-[38%] bg-[#111111] flex-col justify-between p-14 relative overflow-hidden shrink-0">
        <div className="absolute top-[-15%] left-[-10%] w-[480px] h-[480px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-[-15%] w-[350px] h-[350px] bg-orange-600/8 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors group text-sm mb-16">
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Ба саҳифаи асосӣ
          </Link>
          <div className="mb-3">
            <span className="text-sm font-semibold text-orange-500 tracking-widest uppercase">Usto.TJ</span>
          </div>
          <h1 className="text-[42px] font-black text-white leading-[1.1] tracking-tight mb-6">
            Беҳтарин хизматрасониҳо <br />
            <span className="text-orange-500">дар як ҷо.</span>
          </h1>
          <p className="text-white/50 text-[15px] leading-relaxed max-w-xs">
            Ба ҳазорон мизоҷон ва устоҳои ботаҷриба пайваст шавед. Платформаи рақами 1 дар Тоҷикистон.
          </p>
        </div>

        <div className="relative z-10 space-y-5">
          {TRUST_POINTS.map((p, i) => (
            <div key={i} className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-orange-500/15 flex items-center justify-center shrink-0">
                <p.icon size={17} className="text-orange-400" />
              </div>
              <span className="text-white/65 text-sm font-medium">{p.text}</span>
            </div>
          ))}

          {/* Verification note */}
          <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/8">
            <div className="flex items-start gap-3">
              <ShieldCheck size={16} className="text-orange-400 shrink-0 mt-0.5" />
              <p className="text-white/50 text-xs leading-relaxed">
                Амнияти маълумоти шумо пурра таъмин аст. Маълумоти махфӣ ҳеҷ гоҳ паҳн намегардад.
              </p>
            </div>
          </div>

          <div className="pt-2 text-white/20 text-xs">© 2025 UstoTJ — Платформаи устоҳои Тоҷикистон</div>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex flex-col items-center py-10 px-6 overflow-y-auto">
        <div className="w-full max-w-xl">

          {/* Mobile back */}
          <div className="lg:hidden mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-[#9ca3af] hover:text-[#1a1a1a] transition-colors text-sm">
              <ArrowLeft size={16} /> Ба саҳифаи асосӣ
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8 text-center sm:text-left">
            <h2 className="text-3xl font-black text-[#111111] tracking-tight mb-1.5">Сабти ном</h2>
            <p className="text-[#8c8c8c] text-[15px]">Лутфан намуди профилро интихоб кунед ва маълумотро пур кунед.</p>
          </div>

          {/* Role Selector Tabs */}
          <div className="flex p-1 bg-gray-100 rounded-2xl mb-8">
            <button 
              onClick={() => handleRoleChange('client')}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all cursor-pointer ${role === 'client' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Ман Мизоҷ ҳастам
            </button>
            <button 
              onClick={() => handleRoleChange('master')}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all cursor-pointer ${role === 'master' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Ман Усто ҳастам
            </button>
          </div>

          {/* Step bar (Only show if multiple steps) */}
          {STEPS.length > 1 && (
            <div className="flex items-center gap-0 mb-8">
              {STEPS.map((label, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${i < step ? "bg-orange-500 text-white" : i === step ? "bg-[#111111] text-white" : "bg-[#f0efed] text-[#9ca3af]"}`}>
                      {i < step ? <Check size={14} /> : i + 1}
                    </div>
                    <span className={`text-[10px] font-semibold whitespace-nowrap ${i === step ? "text-[#111111]" : "text-[#9ca3af]"}`}>{label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mb-4 mx-2 transition-all duration-500 ${i < step ? "bg-orange-500" : "bg-[#e8e7e4]"}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Toast */}
          {toast && (
            <div className={`p-3.5 rounded-2xl text-sm font-semibold flex items-center gap-2 mb-6 ${toast.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />} {toast.msg}
            </div>
          )}

          <form onSubmit={step === STEPS.length - 1 ? handleSubmit : e => { e.preventDefault(); nextStep(); }}>

            {/* ── STEP 0: Personal Info ── */}
            {step === 0 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Avatar upload for master only */}
                {role === 'master' && (
                  <div className="flex flex-col items-center gap-3 mb-4">
                    <div className="relative group cursor-pointer">
                      <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={e => { const f = e.target.files?.[0]; if (f) setAvatar({ file: f, preview: URL.createObjectURL(f) }); }} />
                      <div className={`w-24 h-24 rounded-full border-2 flex items-center justify-center overflow-hidden transition-all ${avatar.preview ? "border-orange-500" : "border-dashed border-[#d9d8d5] bg-[#f8f8f7] group-hover:border-orange-400"}`}>
                        {avatar.preview
                          ? <img src={avatar.preview} alt="avatar" className="w-full h-full object-cover" />
                          : <Camera size={24} className="text-[#9ca3af] group-hover:text-orange-500 transition-colors" />}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                        <Camera size={12} className="text-white" />
                      </div>
                    </div>
                    <p className="text-xs text-[#9ca3af]">Сурати профил <span className="text-[#c0bfba]">(Ихтиёрӣ)</span></p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="Ном *" icon={User} placeholder="Рустам" value={form.firstName} onChange={set("firstName")} required />
                  <FormInput label="Насаб *" icon={User} placeholder="Алиев" value={form.lastName} onChange={set("lastName")} required />
                </div>
                <FormInput label="Рақами телефон *" icon={Phone} type="tel" placeholder="+992 00 000 0000"
                  value={form.phone} onChange={set("phone")} required hint="Ин рақам барои логин истифода мешавад" />
                
                {/* For Client, city is required at step 0 */}
                {role === 'client' && (
                  <FormSelect label="Шаҳри шумо *" icon={MapPin} value={form.city} onChange={set("city")} options={CITIES} required />
                )}
              </div>
            )}

            {/* ── STEP 1: Work Details (Only Master) ── */}
            {step === 1 && role === 'master' && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <FormSelect label="Касб / Намуди фаъолият *" icon={Briefcase}
                  value={form.profession} onChange={set("profession")} options={PROFESSIONS} required />
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="Таҷриба (сол) *" icon={Clock} type="number" placeholder="5"
                    value={form.experience} onChange={set("experience")} required />
                  <FormSelect label="Шаҳр *" icon={MapPin}
                    value={form.city} onChange={set("city")} options={CITIES} required />
                </div>
                <FormInput label="Суроға (Кӯча / Маҳалла)" icon={Home} placeholder="кӯчаи Рӯдакӣ, 10"
                  value={form.address} onChange={set("address")} hint="Ихтиёрӣ" />

                <div className="pt-2">
                  <p className="text-xs font-bold text-[#9ca3af] uppercase tracking-wider mb-3">Шабакаҳои иҷтимоӣ <span className="text-[#c0bfba] normal-case">(Ихтиёрӣ)</span></p>
                  <div className="space-y-3">
                    <FormInput label="Instagram" icon={Instagram} placeholder="@username" value={form.instagram} onChange={set("instagram")} />
                    <FormInput label="Telegram" icon={Send} placeholder="@username" value={form.telegram} onChange={set("telegram")} />
                    <FormInput label="WhatsApp" icon={MessageCircle} placeholder="+992 00 000 0000" value={form.whatsapp} onChange={set("whatsapp")} />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2: Verification (Only Master) ── */}
            {step === 2 && role === 'master' && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                  <ShieldCheck size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-800 mb-0.5">Тасдиқи ҳуввият</p>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      Сурати шиноснома барои амнияти муштариён <strong>ҳатмӣ</strong> аст. Селфи ихтиёрӣ мебошад. Маълумот ба муштариён нишон дода <strong>намешавад</strong> ва пурра маҳфӣ аст.
                    </p>
                  </div>
                </div>

                <UploadBox
                  label="Нусхаи Шиноснома (Паспорт)"
                  hint="Тарафи асосӣ — равшан ва хонданшаванда"
                  icon={UserSquare2}
                  preview={passport.preview}
                  onChange={f => setPassport({ file: f, preview: URL.createObjectURL(f) })}
                  badge={{ text: "Ҳатмӣ", color: "bg-red-100 text-red-600 border border-red-200" }}
                  borderColor={!passport.file ? "border-red-300" : "border-emerald-400"}
                />

                <UploadBox
                  label="Селфи бо Шиноснома"
                  hint="Шиносномаро дар назди чеҳра нигоҳ доред"
                  icon={Fingerprint}
                  preview={selfie.preview}
                  onChange={f => setSelfie({ file: f, preview: URL.createObjectURL(f) })}
                  badge={{ text: "Ихтиёрӣ", color: "bg-gray-100 text-gray-500 border border-gray-200" }}
                />

                <div className="p-4 bg-[#f8f8f7] rounded-2xl border border-[#e8e7e4] space-y-2.5">
                  {[
                    "Маълумоти шумо тавассути администратор тасдиқ мешавад",
                    "Пас аз тасдиқ Нишони «Устои Санҷидашуда» мегиред",
                    "Профилҳои тасдиқнашуда барои муштариён намоён намешаванд",
                  ].map((txt, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <CheckCircle2 size={14} className="text-orange-500 shrink-0" />
                      <span className="text-xs text-[#6b7280]">{txt}</span>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* Navigation Buttons */}
            <div className={`flex gap-3 mt-8 ${step > 0 ? "justify-between" : "justify-end"}`}>
              {step > 0 && (
                <button type="button" onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-[#6b7280] bg-[#f0efed] hover:bg-[#e8e7e4] transition-all border border-[#e8e7e4]">
                  <ArrowLeft size={16} /> Қадами қаблӣ
                </button>
              )}

              {step < STEPS.length - 1 ? (
                <button type="submit"
                  className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-[#111111] hover:bg-[#1f1f1f] transition-all shadow-lg shadow-black/10 hover:-translate-y-0.5 group">
                  Идома <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              ) : (
                <button type="submit" disabled={loading || (role === 'master' && !passport.file)}
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-500/20 hover:-translate-y-0.5">
                  {loading
                    ? <><Loader2 size={17} className="animate-spin" /> Сабт шуда истодааст...</>
                    : <><ShieldCheck size={17} /> {role === 'client' ? 'Тасдиқ ва Сабти ном' : 'Фиристодан барои санҷиш'}</>}
                </button>
              )}
            </div>
          </form>

          {/* Login link */}
          <p className="text-center text-[14px] text-[#8c8c8c] mt-8">
            Аллакай профил доред?{" "}
            <Link href="/login" className="font-bold text-orange-600 hover:text-orange-700 transition-colors">
              Даромад кунед
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
