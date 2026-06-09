"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, Upload, Image as ImageIcon, 
  CheckCircle2, AlertCircle, ArrowLeft, Camera, Loader2, Clock 
} from "lucide-react";
import Link from "next/link";

const API_BASE = "http://localhost:5000";

export default function KycVerificationPage() {
  const { currentUser, token, updateProfile } = useAuthStore();
  const router = useRouter();

  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [passportPreview, setPassportPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const passportRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);

  // Status variables
  const kycStatus = currentUser?.verificationStatus || 'unverified';
  const isPending = kycStatus === 'pending';
  const isVerified = kycStatus === 'verified';
  const isRejected = kycStatus === 'rejected';

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'passport' | 'selfie') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    if (type === 'passport') {
      setPassportFile(file);
      setPassportPreview(previewUrl);
    } else {
      setSelfieFile(file);
      setSelfiePreview(previewUrl);
    }
  };

  const uploadFile = async (file: File, endpoint: string) => {
    const formData = new FormData();
    formData.append(endpoint, file);
    
    const res = await fetch(`${API_BASE}/api/v1/uploads/${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!res.ok) throw new Error(`Failed to upload ${endpoint}`);
    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passportFile || !selfieFile) {
      setError("Лутфан ҳарду суратро бор кунед.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // 1. Upload both files
      const passportUrl = await uploadFile(passportFile, 'passport');
      const selfieUrl = await uploadFile(selfieFile, 'selfie');

      // 2. Update user profile with the URLs and set status to pending
      const res = await fetch(`${API_BASE}/api/v1/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          passportPhoto: passportUrl,
          selfiePhoto: selfieUrl,
          verificationStatus: 'pending'
        })
      });

      if (!res.ok) throw new Error("Хатогӣ ҳангоми навсозии профил");

      setSuccess(true);
      updateProfile({
        passportPhoto: passportUrl,
        selfiePhoto: selfieUrl,
        verificationStatus: 'pending'
      });
      
      // Clear forms
      setPassportFile(null);
      setSelfieFile(null);
    } catch (err: any) {
      setError(err.message || "Хатогӣ рух дод");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-[#F7F9FC] pb-20 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/profile" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Тасдиқи Шахсият (KYC)</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        
        {/* Status Card */}
        <div className="mb-8">
          {isVerified && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-600">
                <ShieldCheck size={32} />
              </div>
              <h2 className="text-xl font-bold text-emerald-800 mb-2">Шумо тасдиқ шудаед!</h2>
              <p className="text-emerald-600/80 text-sm max-w-sm">
                Профили шумо 100% тасдиқ шудааст ва шумо нишони "Verified Master"-ро соҳиб шудед. Шумо метавонед ба мизоҷон Инвойс фиристед ва аз ҳамёни Escrow истифода баред.
              </p>
            </div>
          )}

          {isPending && !success && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                <Clock size={32} />
              </div>
              <h2 className="text-xl font-bold text-blue-800 mb-2">Дар ҳоли санҷиш...</h2>
              <p className="text-blue-600/80 text-sm max-w-sm">
                Ҳуҷҷатҳои шумо аз тарафи модераторони мо санҷида шуда истодаанд. Одатан ин раванд то 24 соат вақтро мегирад.
              </p>
            </div>
          )}

          {isRejected && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                <AlertCircle size={32} />
              </div>
              <h2 className="text-xl font-bold text-red-800 mb-2">Дархост рад карда шуд</h2>
              <p className="text-red-600/80 text-sm max-w-sm mb-4">
                Мутаассифона, ҳуҷҷатҳои шумо ба талабот ҷавобгӯ набуданд. Лутфан, суратҳои равшантар бор кунед.
              </p>
              <button 
                onClick={() => setSuccess(false) /* Allow re-submit */} 
                className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold text-sm shadow-sm hover:bg-red-700 transition-colors"
              >
                Аз нав фиристодан
              </button>
            </div>
          )}
        </div>

        {/* Upload Form */}
        {(!isVerified && !isPending && !isRejected) || (isRejected && success === false) || success ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 md:p-8">
              
              {success ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Бомуваффақият фиристода шуд!</h2>
                  <p className="text-gray-500 max-w-sm mx-auto mb-8">
                    Ҳуҷҷатҳои шумо барои санҷиш қабул шуданд. Мо дар давоми 24 соат ба шумо ҷавоб медиҳем.
                  </p>
                  <Link href="/profile" className="inline-flex px-8 py-3 bg-[#111827] text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">
                    Ба профил баргаштан
                  </Link>
                </div>
              ) : (
                <>
                  <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Тасдиқи Шахсият</h2>
                    <p className="text-gray-500 text-sm">
                      Барои гирифтани нишони "Устои Тасдиқшуда" ва дастрасӣ ба пардохтҳои бехатар (Escrow), лутфан ҳуҷҷатҳои худро бор кунед.
                    </p>
                  </div>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
                      <AlertCircle size={18} className="shrink-0" /> {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* Passport/ID Upload */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-gray-900">1. Сурати Паспорт (ё ID Корт)</label>
                        <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-md">Ҳатмӣ</span>
                      </div>
                      <p className="text-xs text-gray-500">Лутфан сурати равшан ва хонои қисми пеши ҳуҷҷататонро бор кунед.</p>
                      
                      <div 
                        onClick={() => passportRef.current?.click()}
                        className="w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl hover:border-orange-500 hover:bg-orange-50/50 transition-all cursor-pointer flex flex-col items-center justify-center relative overflow-hidden group"
                      >
                        {passportPreview ? (
                          <>
                            <img src={passportPreview} alt="Passport" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-white font-bold text-sm flex items-center gap-2"><Upload size={16} /> Интихоби дигар</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3 group-hover:scale-110 group-hover:text-orange-500 transition-all">
                              <ImageIcon size={24} />
                            </div>
                            <span className="text-sm font-bold text-gray-600 group-hover:text-orange-600">Зер кунед барои боркунӣ</span>
                          </>
                        )}
                        <input ref={passportRef} type="file" accept="image/*" hidden onChange={(e) => handleFileChange(e, 'passport')} />
                      </div>
                    </div>

                    {/* Selfie Upload */}
                    <div className="space-y-3 pt-6 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-gray-900">2. Селфи бо Паспорт</label>
                        <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-md">Ҳатмӣ</span>
                      </div>
                      <p className="text-xs text-gray-500">Лутфан паспортатонро дар паҳлӯи рӯятон дошта як сурат гиред.</p>
                      
                      <div 
                        onClick={() => selfieRef.current?.click()}
                        className="w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl hover:border-orange-500 hover:bg-orange-50/50 transition-all cursor-pointer flex flex-col items-center justify-center relative overflow-hidden group"
                      >
                        {selfiePreview ? (
                          <>
                            <img src={selfiePreview} alt="Selfie" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-white font-bold text-sm flex items-center gap-2"><Camera size={16} /> Интихоби дигар</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3 group-hover:scale-110 group-hover:text-orange-500 transition-all">
                              <Camera size={24} />
                            </div>
                            <span className="text-sm font-bold text-gray-600 group-hover:text-orange-600">Зер кунед барои боркунӣ</span>
                          </>
                        )}
                        <input ref={selfieRef} type="file" accept="image/*" capture="user" hidden onChange={(e) => handleFileChange(e, 'selfie')} />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading || !passportFile || !selfieFile}
                      className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-2xl font-bold text-[15px] transition-colors shadow-md flex items-center justify-center gap-2 mt-8"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={20} className="animate-spin" /> Фиристодан...
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={20} /> Фиристодан барои санҷиш
                        </>
                      )}
                    </button>
                    
                    <p className="text-center text-[11px] text-gray-400 font-medium">
                      Бо боркунии ҳуҷҷатҳо шумо ба <Link href="/terms" className="text-orange-500 underline">Қоидаҳои Платформа</Link> розӣ мешавед. Маълумоти шумо 100% махфӣ нигоҳ дошта мешавад.
                    </p>

                  </form>
                </>
              )}
            </div>
          </div>
        ) : null}

      </div>
    </div>
  );
}
