"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Heart, MessageCircle, Share2, ArrowLeft, BadgeCheck, 
  MapPin, ShieldCheck, Briefcase, Play, CalendarCheck, Loader2, VolumeX, Volume2, X, Send
} from 'lucide-react';
import { reelsApi } from '@/services/reels.service';
import { useReelsStore } from '@/store/useReelsStore';
import { useAuthStore } from '@/store/useAuthStore';

interface Comment {
  id: string;
  name: string;
  avatar: string;
  text: string;
  createdAt: string;
}

const QUICK_EMOJIS = ["❤️", "🙌", "😂", "🔥", "👏", "😍", "😢", "😮"];

function renderAvatar(avatarUrl: string | null | undefined, name: string, sizeClass: string = "w-10 h-10") {
  const isFake = !avatarUrl || avatarUrl.includes("dicebear.com") || avatarUrl.trim() === "";
  if (isFake) {
    const initials = name
      ? name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()
      : "U";
    
    const charCode = name ? name.charCodeAt(0) : 0;
    const gradients = [
      "from-[#2A2D34] to-[#3B4252]",
      "from-[#e25e14] to-[#b83f0f]",
      "from-[#1E1E24] to-[#2E2E38]",
      "from-[#3F304F] to-[#2B1D38]",
      "from-[#1F3A52] to-[#0F1E2D]"
    ];
    const gradient = gradients[charCode % gradients.length];

    return (
      <div className={`${sizeClass} rounded-full bg-gradient-to-tr ${gradient} flex items-center justify-center border border-white/10 shadow-inner shrink-0 select-none`}>
        <span className="text-white font-extrabold text-[12px] tracking-wider drop-shadow-md">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <img 
      src={avatarUrl} 
      alt={name} 
      className={`${sizeClass} rounded-full border border-white/10 object-cover bg-zinc-800 shrink-0`} 
    />
  );
}

export default function ReelsPage() {
  const { reels, setReels } = useReelsStore();
  const { currentUser } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [activeReelId, setActiveReelId] = useState<string | number | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [likedReels, setLikedReels] = useState<string[]>([]);
  
  // Comments states
  const [activeCommentsReelId, setActiveCommentsReelId] = useState<string | number | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [guestName, setGuestName] = useState("");

  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const commentInputRef = useRef<HTMLInputElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Initialize liked reels from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ustotj-liked-reels");
    if (saved) {
      try {
        setLikedReels(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // Load all reels from API on mount
  useEffect(() => {
    const fetchReels = async () => {
      try {
        const data = await reelsApi.getAll();
        if (data) {
          const formatted = data.map((r: any) => ({
            id: r._id || r.id,
            videoUrl: r.videoUrl,
            title: r.title,
            description: r.description || "",
            likes: String(r.likes || "0"),
            comments: String(r.comments || "0"),
            shares: String(r.shares || "0"),
            master: r.master
          }));
          setReels(formatted);
          if (formatted.length > 0) {
            setActiveReelId(formatted[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load reels:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReels();
  }, [setReels]);

  // Load comments when drawer is opened
  useEffect(() => {
    const fetchComments = async () => {
      if (!activeCommentsReelId) return;
      try {
        const list = await reelsApi.getComments(String(activeCommentsReelId));
        setComments(list);
        
        // Auto scroll to bottom
        setTimeout(() => {
          commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } catch (err) {
        console.error("Failed to load comments:", err);
      }
    };
    fetchComments();
  }, [activeCommentsReelId]);

  // Handle intersection observer to auto play active video
  useEffect(() => {
    if (reels.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          const reelId = video.dataset.reelId;

          if (entry.isIntersecting) {
            if (reelId) {
              setActiveReelId(reelId);
              video.play().catch(() => {});
            }
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.6 }
    );

    Object.values(videoRefs.current).forEach((v) => {
      if (v) observer.observe(v);
    });

    return () => {
      observer.disconnect();
    };
  }, [reels]);

  // Handle play/pause when activeReelId changes
  useEffect(() => {
    Object.keys(videoRefs.current).forEach((key) => {
      const video = videoRefs.current[key];
      if (!video) return;

      if (key === String(activeReelId)) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [activeReelId]);

  // Handle Mute state change across all videos
  useEffect(() => {
    Object.values(videoRefs.current).forEach((v) => {
      if (v) v.muted = isMuted;
    });
  }, [isMuted]);

  // Handle Like/Unlike Toggle (strictly 1 like limit per user!)
  const handleLike = async (id: string | number) => {
    const stringId = String(id);
    const hasLiked = likedReels.includes(stringId);

    if (hasLiked) {
      const success = await reelsApi.unlike(stringId);
      if (success) {
        const updated = reels.map(r => {
          if (r.id === id) {
            const count = parseInt(r.likes) || 0;
            return { ...r, likes: String(Math.max(0, count - 1)) };
          }
          return r;
        });
        setReels(updated);
        
        const nextLiked = likedReels.filter(item => item !== stringId);
        setLikedReels(nextLiked);
        localStorage.setItem("ustotj-liked-reels", JSON.stringify(nextLiked));
      }
    } else {
      const success = await reelsApi.like(stringId);
      if (success) {
        const updated = reels.map(r => {
          if (r.id === id) {
            const count = parseInt(r.likes) || 0;
            return { ...r, likes: String(count + 1) };
          }
          return r;
        });
        setReels(updated);

        const nextLiked = [...likedReels, stringId];
        setLikedReels(nextLiked);
        localStorage.setItem("ustotj-liked-reels", JSON.stringify(nextLiked));
      }
    }
  };

  // Submit dynamic comment
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCommentsReelId || !newCommentText.trim()) return;

    setIsSubmittingComment(true);

    const name = currentUser 
      ? `${currentUser.firstName} ${currentUser.lastName}`
      : (guestName.trim() || "Меҳмон");

    const avatar = currentUser?.avatar || `https://api.dicebear.com/9.x/notionists/svg?seed=${name}`;

    const result = await reelsApi.addComment(
      String(activeCommentsReelId),
      name,
      avatar,
      newCommentText
    );

    setIsSubmittingComment(false);

    if (result) {
      // Append comment instantly to state
      setComments(prev => [...prev, result]);
      setNewCommentText("");

      // Update comments counter in reels Zustand state
      const updatedReels = reels.map(r => {
        if (String(r.id) === String(activeCommentsReelId)) {
          const count = parseInt(r.comments) || 0;
          return { ...r, comments: String(count + 1) };
        }
        return r;
      });
      setReels(updatedReels);

      // Auto scroll comments list to the bottom
      setTimeout(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Insert emoji quick click
  const handleEmojiClick = (emoji: string) => {
    setNewCommentText(prev => prev + emoji);
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-white/70">
        <Loader2 className="animate-spin text-orange-500 mb-3" size={40} />
        <span className="text-sm font-semibold tracking-wide">Боргузории наворҳо...</span>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-black flex overflow-hidden font-sans relative">
      
      {/* Top Header Controls */}
      <div className="absolute top-0 w-full z-30 p-5 sm:p-7 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
        <Link href="/" className="pointer-events-auto flex items-center gap-2 text-white hover:text-orange-500 transition-colors">
          <ArrowLeft size={22} className="drop-shadow-md" />
          <span className="font-bold text-sm sm:text-base drop-shadow-md uppercase tracking-wider">Асосӣ</span>
        </Link>
        <div className="pointer-events-auto font-black text-white text-lg sm:text-xl tracking-tight drop-shadow-md flex items-center gap-1.5">
          Usto<span className="text-orange-500">TJ</span> <span className="bg-orange-500/20 text-orange-500 border border-orange-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Reels</span>
        </div>
        <button 
          onClick={toggleMute}
          className="pointer-events-auto w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 hover:scale-105 transition-all"
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      {/* Reels Feed Container */}
      <div className="flex-1 h-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar relative bg-zinc-950">
        {reels.length === 0 ? (
          <div className="h-full w-full flex flex-col items-center justify-center text-white/50 p-6 text-center">
            <Play size={44} className="text-zinc-600 mb-3" />
            <p className="font-semibold text-lg text-white/80">Наворҳо ёфт нашуданд</p>
            <p className="text-sm text-white/40 mt-1 max-w-[280px]">Аввалин видеоро аз панели устои худ илова кунед!</p>
          </div>
        ) : (
          reels.map((reel) => {
            const isLiked = likedReels.includes(String(reel.id));
            return (
              <div 
                key={reel.id} 
                className="h-screen w-full snap-start relative flex justify-center items-center bg-black overflow-hidden"
              >
                
                {/* Fullscreen Video Element */}
                <video 
                  ref={(el) => { videoRefs.current[String(reel.id)] = el; }}
                  data-reel-id={String(reel.id)}
                  src={reelsApi.getVideoUrl(reel.videoUrl)}
                  loop 
                  muted={isMuted}
                  playsInline 
                  onClick={toggleMute}
                  className="w-full h-full object-cover sm:object-contain bg-black cursor-pointer"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/35 pointer-events-none"></div>

                {/* Reel Metadata & Sidebar Container */}
                <div className="absolute bottom-0 left-0 w-full p-5 sm:p-10 flex items-end justify-between z-20 max-w-4xl mx-auto right-0">
                  
                  {/* Left Side: Master Info Card & Caption */}
                  <div className="flex-1 max-w-xl pr-6 text-left">
                    
                    {/* Master Info Bubble */}
                    <div className="bg-black/55 backdrop-blur-lg border border-white/10 rounded-2xl p-4 mb-4 inline-block shadow-2xl">
                      <div className="flex items-center gap-3">
                        <Link href={`/masters/${reel.master.id}`} className="hover:scale-105 transition-transform shrink-0">
                        {renderAvatar(reel.master.avatar, reel.master.name, "w-11 h-11 border-2 border-orange-500/50")}
                        </Link>
                        <Link href={`/masters/${reel.master.id}`} className="hover:text-orange-400 transition-colors">
                          <div>
                            <h3 className="text-white font-bold text-base flex items-center gap-1 drop-shadow-md">
                              {reel.master.name} 
                              {reel.master.isVerified && <BadgeCheck size={16} className="text-[#1d9bf0] fill-white" />}
                            </h3>
                            <p className="text-white/60 text-xs flex items-center gap-1 mt-0.5">
                              <MapPin size={12} className="text-orange-500" /> {reel.master.city}
                            </p>
                          </div>
                        </Link>
                        <Link 
                          href={`/masters/${reel.master.id}`}
                          className="ml-auto bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-lg shadow-orange-500/20"
                        >
                          Тамос
                        </Link>
                      </div>
                      
                      <div className="flex items-center gap-4 text-[10px] font-semibold text-white/70 border-t border-white/10 pt-2.5 mt-2.5 uppercase tracking-wide">
                        <div className="flex items-center gap-1"><Briefcase size={12} className="text-orange-400" /> {reel.master.profession}</div>
                        <div className="flex items-center gap-1"><ShieldCheck size={12} className="text-green-400" /> Боварӣ: {reel.master.trustScore}%</div>
                      </div>
                    </div>

                    {/* Caption & Title */}
                    <h2 className="text-white font-black text-lg sm:text-xl mb-1.5 drop-shadow-lg leading-snug">{reel.title}</h2>
                    <p className="text-white/85 text-xs sm:text-sm leading-relaxed drop-shadow-md max-w-md line-clamp-2 sm:line-clamp-none">
                      {reel.description}
                    </p>
                  </div>

                  {/* Right Side Interactions Sidebar */}
                  <div className="flex flex-col items-center gap-5 sm:gap-6 ml-auto shrink-0 pb-1">
                    
                    {/* Like Button */}
                    <button 
                      onClick={() => handleLike(reel.id)}
                      className="group flex flex-col items-center gap-1.5 focus:outline-none"
                    >
                      <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-red-500 group-hover:border-red-500 hover:scale-110 active:scale-95 transition-all shadow-xl">
                        <Heart size={22} className={`${isLiked ? "text-red-500 fill-red-500" : "text-white"} transition-colors`} />
                      </div>
                      <span className="text-white text-xs font-black drop-shadow-lg tracking-wider">{reel.likes}</span>
                    </button>
                    
                    {/* Comments Button */}
                    <button 
                      onClick={() => setActiveCommentsReelId(reel.id)}
                      className="group flex flex-col items-center gap-1.5 focus:outline-none"
                    >
                      <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-orange-500 group-hover:border-orange-500 hover:scale-110 active:scale-95 transition-all shadow-xl">
                        <MessageCircle size={22} className="text-white" />
                      </div>
                      <span className="text-white text-xs font-black drop-shadow-lg tracking-wider">{reel.comments}</span>
                    </button>

                    {/* Share Button */}
                    <button className="group flex flex-col items-center gap-1.5 focus:outline-none">
                      <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-blue-500 group-hover:border-blue-500 hover:scale-110 active:scale-95 transition-all shadow-xl">
                        <Share2 size={22} className="text-white" />
                      </div>
                      <span className="text-white text-xs font-black drop-shadow-lg tracking-wider">{reel.shares}</span>
                    </button>

                    {/* Primary CTA Book Order */}
                    <div className="mt-2 flex flex-col items-center">
                      <button className="w-13 h-13 rounded-full bg-gradient-to-tr from-orange-600 to-[#d95d39] flex items-center justify-center shadow-lg shadow-orange-600/40 hover:scale-110 transition-transform relative animate-pulse border border-orange-400/20">
                        <CalendarCheck size={22} className="text-white" />
                      </button>
                      <span className="text-white text-[9px] font-black mt-2 text-center uppercase tracking-widest drop-shadow-lg">Фармоиш</span>
                    </div>
                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Instagram-Style Sliding Comments Drawer Overlay */}
      {activeCommentsReelId && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          
          {/* Close Area Backdrop */}
          <div className="flex-1" onClick={() => setActiveCommentsReelId(null)}></div>

          {/* Drawer Body Container */}
          <div className="w-full max-w-[450px] bg-[#121212] border-l border-white/10 h-full flex flex-col justify-between shadow-2xl relative animate-in slide-in-from-right duration-300">
            
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex justify-between items-center text-white">
              <div>
                <h3 className="font-extrabold text-lg flex items-center gap-2">
                  Шарҳҳо <span className="bg-orange-500/20 text-orange-500 border border-orange-500/20 text-xs px-2.5 py-0.5 rounded-full font-bold">{comments.length}</span>
                </h3>
                <p className="text-[11px] text-white/55 mt-0.5 uppercase tracking-wider font-semibold">UstoTJ Reels Community</p>
              </div>
              <button 
                onClick={() => setActiveCommentsReelId(null)}
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-105 active:scale-95 transition-all flex items-center justify-center text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Comments List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 hide-scrollbar">
              {comments.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-white/40 py-20 px-6">
                  <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-4 border border-white/5 animate-pulse">
                    <MessageCircle size={28} className="text-zinc-500" />
                  </div>
                  <p className="font-bold text-[16px] text-white/80">Ҳанӯз шарҳҳо нест</p>
                  <p className="text-xs text-white/40 mt-1 max-w-[240px]">Аввалин шуда шарҳи худро нависед ва фикратонро баён кунед!</p>
                </div>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="flex items-start gap-3.5 group animate-in fade-in duration-200">
                    {renderAvatar(c.avatar, c.name, "w-10 h-10")}
                    <div className="flex-1 text-left bg-white/5 rounded-2xl p-4.5 border border-white/5">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-bold text-sm text-white">{c.name}</span>
                        <span className="text-[10px] font-semibold text-white/40">{formatDate(c.createdAt)}</span>
                      </div>
                      <p className="text-sm text-white/85 leading-relaxed font-medium">{c.text}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={commentsEndRef} />
            </div>

            {/* Input Comment Footer */}
            <div className="p-5 border-t border-white/10 bg-[#121212]">
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                
                {/* Guest name input if not logged in */}
                {!currentUser && (
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      required
                      placeholder="Номи Шумо (Меҳмон)..." 
                      value={guestName}
                      onChange={e => setGuestName(e.target.value)}
                      className="w-full bg-white/5 text-white placeholder-white/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                )}

                {/* Instagram-Style Quick Emoji Bar */}
                <div className="flex gap-3 items-center justify-start overflow-x-auto hide-scrollbar border-b border-white/5 pb-3">
                  {QUICK_EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleEmojiClick(emoji)}
                      className="text-xl hover:scale-130 active:scale-90 transition-transform cursor-pointer shrink-0"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  {renderAvatar(currentUser?.avatar, currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : (guestName || 'Guest'), "w-10 h-10")}
                  <div className="flex-1 flex gap-2">
                    <input 
                      ref={commentInputRef}
                      type="text" 
                      required
                      placeholder="Фикри худро нависед..." 
                      value={newCommentText}
                      onChange={e => setNewCommentText(e.target.value)}
                      className="flex-1 bg-white/5 text-white placeholder-white/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500/50"
                    />
                    <button 
                      type="submit"
                      disabled={!newCommentText.trim() || isSubmittingComment}
                      className="bg-orange-500 disabled:opacity-50 text-white w-11 h-11 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 active:scale-95 transition-all hover:bg-orange-600 shrink-0 cursor-pointer"
                    >
                      {isSubmittingComment ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Send size={16} />
                      )}
                    </button>
                  </div>
                </div>

              </form>
            </div>

          </div>

        </div>
      )}

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
