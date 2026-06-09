"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Heart,
  MessageCircle,
  Share2,
  Plus,
  X,
  Upload,
  BadgeCheck,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Loader2,
} from "lucide-react";
import { reelsApi, ReelData } from "@/services/reels.service";
import { useAuthStore } from "@/store/useAuthStore";

// ───────────────────────────────────
// Add Reel Modal
// ───────────────────────────────────
function AddReelModal({
  isOpen,
  onClose,
  onReelAdded,
}: {
  isOpen: boolean;
  onClose: () => void;
  onReelAdded: () => void;
}) {
  const { currentUser } = useAuthStore();
  const [file, setFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type.startsWith("video/")) {
      setFile(selected);
      setVideoPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async () => {
    if (!file || !title.trim() || !currentUser) return;

    setIsUploading(true);

    const masterInfo = {
      id: String(currentUser.id),
      name: `${currentUser.firstName} ${currentUser.lastName}`,
      profession: currentUser.profession || "Усто",
      city: currentUser.city || "Душанбе",
      isVerified: currentUser.isVerified || false,
      trustScore: currentUser.trustScore || 0,
      avatar:
        currentUser.avatar ||
        `https://api.dicebear.com/9.x/notionists/svg?seed=${currentUser.firstName}`,
    };

    const result = await reelsApi.uploadAndCreate(
      file,
      title,
      description,
      masterInfo
    );

    setIsUploading(false);

    if (result) {
      // Reset form
      setFile(null);
      setVideoPreview(null);
      setTitle("");
      setDescription("");
      onReelAdded();
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E5E5E5]">
          <h2 className="text-[18px] font-bold text-[#111] tracking-[-0.02em]">
            Навори нав
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#F5F5F4] flex items-center justify-center hover:bg-[#E5E5E5] transition-colors"
          >
            <X size={18} className="text-[#6B7280]" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* Video Upload Area */}
          {!videoPreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#E5E5E5] rounded-2xl h-[240px] flex flex-col items-center justify-center cursor-pointer hover:border-[#C2410C] hover:bg-[#FAFAF9] transition-all group"
            >
              <div className="w-14 h-14 rounded-xl bg-[#F5F5F4] flex items-center justify-center mb-4 group-hover:bg-[#C2410C]/10 transition-colors">
                <Upload
                  size={24}
                  className="text-[#6B7280] group-hover:text-[#C2410C] transition-colors"
                />
              </div>
              <p className="text-[14px] font-medium text-[#111] mb-1">
                Видеоро интихоб кунед
              </p>
              <p className="text-[12px] text-[#6B7280]">
                MP4, MOV ё WebM · то 100MB
              </p>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden bg-black h-[240px]">
              <video
                src={videoPreview}
                className="w-full h-full object-contain"
                controls
                muted
              />
              <button
                onClick={() => {
                  setFile(null);
                  setVideoPreview(null);
                }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Title */}
          <div>
            <label className="block text-[13px] font-semibold text-[#111] mb-2">
              Унвон
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Масалан: Таъмири кузови мошин"
              className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] text-[14px] text-[#111] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C]/20 transition-all bg-[#FAFAF9]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[13px] font-semibold text-[#111] mb-2">
              Тавсиф
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Тавсифи кор..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] text-[14px] text-[#111] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C]/20 transition-all resize-none bg-[#FAFAF9]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#E5E5E5]">
          <button
            onClick={handleSubmit}
            disabled={!file || !title.trim() || isUploading}
            className="w-full py-3.5 rounded-xl bg-[#111] text-white font-semibold text-[15px] hover:bg-[#C2410C] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Боргузорӣ...
              </>
            ) : (
              <>
                <Upload size={18} />
                Нашр кардан
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────
// Reel Fullscreen Viewer
// ───────────────────────────────────
function ReelViewer({
  reels,
  startIndex,
  onClose,
}: {
  reels: ReelData[];
  startIndex: number;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({});
  const videoRef = useRef<HTMLVideoElement>(null);

  const reel = reels[currentIndex];
  const reelId = reel?._id || String(reel?.id);

  const goNext = useCallback(() => {
    if (currentIndex < reels.length - 1) setCurrentIndex((i) => i + 1);
  }, [currentIndex, reels.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") goNext();
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev, onClose]);

  // Auto-play new video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [currentIndex]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleLike = async () => {
    if (isLiked[reelId]) return;
    setIsLiked((prev) => ({ ...prev, [reelId]: true }));
    await reelsApi.like(reelId);
  };

  if (!reel) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
      >
        <X size={20} />
      </button>

      {/* Navigation */}
      {currentIndex > 0 && (
        <button
          onClick={goPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
      )}
      {currentIndex < reels.length - 1 && (
        <button
          onClick={goNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Video Container (Instagram-like centered) */}
      <div className="relative w-full max-w-[420px] h-full max-h-[90vh] rounded-2xl overflow-hidden mx-auto">
        <video
          ref={videoRef}
          src={reelsApi.getVideoUrl(reel.videoUrl)}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover"
          onClick={() => {
            if (videoRef.current?.paused) videoRef.current.play();
            else videoRef.current?.pause();
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

        {/* Top: Counter */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-[13px] font-medium">
          {currentIndex + 1} / {reels.length}
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          {/* Master info */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src={reel.master.avatar}
              alt={reel.master.name}
              className="w-10 h-10 rounded-full border-2 border-white/20 bg-zinc-800"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-white font-semibold text-[14px] truncate">
                  {reel.master.name}
                </span>
                {reel.master.isVerified && (
                  <BadgeCheck
                    size={16}
                    className="text-[#1d9bf0] shrink-0"
                  />
                )}
              </div>
              <div className="flex items-center gap-1 text-white/50 text-[12px]">
                <MapPin size={11} />
                <span>{reel.master.city}</span>
              </div>
            </div>
          </div>

          {/* Title & description */}
          <h3 className="text-white font-semibold text-[15px] mb-1">
            {reel.title}
          </h3>
          {reel.description && (
            <p className="text-white/60 text-[13px] leading-relaxed line-clamp-2 mb-4">
              {reel.description}
            </p>
          )}
        </div>

        {/* Right side actions */}
        <div className="absolute right-4 bottom-32 flex flex-col items-center gap-5">
          <button onClick={handleLike} className="flex flex-col items-center gap-1">
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                isLiked[reelId]
                  ? "bg-red-500 text-white"
                  : "bg-white/10 backdrop-blur-md text-white hover:bg-white/20"
              }`}
            >
              <Heart size={20} fill={isLiked[reelId] ? "white" : "none"} />
            </div>
            <span className="text-white/80 text-[11px] font-medium">
              {reel.likes}
            </span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all">
              <MessageCircle size={20} />
            </div>
            <span className="text-white/80 text-[11px] font-medium">
              {reel.comments}
            </span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all">
              <Share2 size={20} />
            </div>
            <span className="text-white/80 text-[11px] font-medium">
              {reel.shares}
            </span>
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────
// Main ReelsSection Component
// ───────────────────────────────────
export default function ReelsSection() {
  const [reels, setReels] = useState<ReelData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const { isAuthenticated } = useAuthStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const fetchReels = useCallback(async () => {
    setIsLoading(true);
    const data = await reelsApi.getAll();
    setReels(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchReels();
  }, [fetchReels]);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -320, behavior: "smooth" });
  };
  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 320, behavior: "smooth" });
  };

  return (
    <>
      <section id="reels" className="w-full bg-white py-24 md:py-32 border-t border-[#E5E5E5]">
        <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-end justify-between gap-4 mb-10 md:mb-14">
            <div>
              <p className="text-[13px] font-semibold tracking-[0.1em] uppercase text-[#C2410C] mb-4">
                Видеоҳо
              </p>
              <h2 className="text-[32px] md:text-[40px] lg:text-[48px] font-bold text-[#111] tracking-[-0.03em] leading-[1.1]">
                Reels{" "}
                <span className="text-[#6B7280]">устоҳо.</span>
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {/* Add Reel Button (only if authenticated) */}
              {isAuthenticated && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 bg-[#111] text-white px-5 py-3 rounded-xl text-[14px] font-semibold hover:bg-[#C2410C] transition-all"
                >
                  <Plus size={18} />
                  <span className="hidden sm:inline">Навори нав</span>
                </button>
              )}

              {/* Scroll Controls */}
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={scrollLeft}
                  className="w-10 h-10 rounded-full border border-[#E5E5E5] flex items-center justify-center hover:bg-[#F5F5F4] transition-colors"
                >
                  <ChevronLeft size={18} className="text-[#6B7280]" />
                </button>
                <button
                  onClick={scrollRight}
                  className="w-10 h-10 rounded-full border border-[#E5E5E5] flex items-center justify-center hover:bg-[#F5F5F4] transition-colors"
                >
                  <ChevronRight size={18} className="text-[#6B7280]" />
                </button>
              </div>
            </div>
          </div>

          {/* Reels Grid / Horizontal Scroll */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-[#C2410C]" />
            </div>
          ) : reels.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#F5F5F4] flex items-center justify-center mb-4">
                <Play size={28} className="text-[#6B7280]" />
              </div>
              <p className="text-[16px] font-semibold text-[#111] mb-2">
                Ҳоло видеоҳо вуҷуд надоранд
              </p>
              <p className="text-[14px] text-[#6B7280]">
                {isAuthenticated
                  ? 'Тугмаи "Навори нав"-ро зада аввалин видеоро илова кунед!'
                  : "Даромад кунед ва аввалин видеоро илова кунед."}
              </p>
            </div>
          ) : (
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {reels.map((reel, index) => {
                const reelId = reel._id || String(reel.id);
                return (
                  <div
                    key={reelId}
                    onClick={() => setViewerIndex(index)}
                    className="group shrink-0 w-[260px] sm:w-[280px] aspect-[9/16] rounded-2xl overflow-hidden relative cursor-pointer snap-start bg-zinc-900 hover:ring-2 hover:ring-[#C2410C]/30 transition-all"
                  >
                    {/* Video Thumbnail */}
                    <video
                      src={reelsApi.getVideoUrl(reel.videoUrl)}
                      muted
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      onMouseEnter={(e) => {
                        (e.target as HTMLVideoElement).play().catch(() => {});
                      }}
                      onMouseLeave={(e) => {
                        const video = e.target as HTMLVideoElement;
                        video.pause();
                        video.currentTime = 0;
                      }}
                    />

                    {/* Play icon overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <Play
                          size={24}
                          className="text-white ml-1"
                          fill="white"
                        />
                      </div>
                    </div>

                    {/* Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                    {/* Bottom info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center gap-2.5 mb-2">
                        <img
                          src={reel.master.avatar}
                          alt={reel.master.name}
                          className="w-8 h-8 rounded-full border border-white/20 bg-zinc-800"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-white text-[13px] font-semibold truncate">
                              {reel.master.name}
                            </span>
                            {reel.master.isVerified && (
                              <BadgeCheck
                                size={13}
                                className="text-[#1d9bf0] shrink-0"
                              />
                            )}
                          </div>
                          <span className="text-white/50 text-[11px]">
                            {reel.master.profession}
                          </span>
                        </div>
                      </div>
                      <p className="text-white text-[13px] font-medium line-clamp-1">
                        {reel.title}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-white/50 text-[11px]">
                        <span className="flex items-center gap-1">
                          <Heart size={11} /> {reel.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle size={11} /> {reel.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Add Reel Modal */}
      <AddReelModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onReelAdded={fetchReels}
      />

      {/* Fullscreen Viewer */}
      {viewerIndex !== null && (
        <ReelViewer
          reels={reels}
          startIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
