"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { communityApi } from "@/services/community.service";
import { 
  Loader2, 
  ArrowLeft, 
  ShieldCheck, 
  Image as ImageIcon, 
  Send, 
  Heart, 
  MessageCircle, 
  MoreHorizontal,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function MasterCommunityPage() {
  const router = useRouter();
  const { currentUser, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Comment state per post
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  const loadPosts = async () => {
    const data = await communityApi.getAllPosts();
    setPosts(data);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!isAuthenticated || !currentUser) {
        router.push("/login");
        return;
      }
      if (currentUser.role !== "master" && currentUser.role !== "admin") {
        router.push("/");
        return;
      }
      if (currentUser.verificationStatus !== "verified" && currentUser.role !== "admin") {
        // Enforce verified only
        router.push("/profile?error=not_verified");
        return;
      }
      loadPosts().then(() => setLoading(false));
    }
  }, [mounted, isAuthenticated, currentUser, router]);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    setSubmitting(true);
    const success = await communityApi.createPost(newPostContent);
    if (success) {
      setNewPostContent("");
      await loadPosts();
    }
    setSubmitting(false);
  };

  const handleLike = async (postId: string) => {
    const success = await communityApi.likePost(postId);
    if (success) {
      await loadPosts(); // Simple reload for now
    }
  };

  const handleCommentSubmit = async (postId: string) => {
    if (!commentText.trim()) return;
    const success = await communityApi.addComment(postId, commentText);
    if (success) {
      setCommentText("");
      await loadPosts();
    }
  };

  if (!mounted || loading || !currentUser) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans pb-20">
      
      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
              <ArrowLeft size={20} className="text-[#111827]" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-[#111827] leading-tight flex items-center gap-1.5">
                Master Community <ShieldCheck size={18} className="text-orange-500" />
              </h1>
              <p className="text-xs font-semibold text-[#6B7280]">Exclusive network for verified professionals</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-100 overflow-hidden">
            {currentUser.avatar && !currentUser.avatar.includes("dicebear") ? (
              <img src={currentUser.avatar} alt="Me" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-orange-600 font-bold">
                {currentUser.fullName?.charAt(0) || "U"}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Feed */}
      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
        
        {/* Create Post Box */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm">
          <form onSubmit={handlePostSubmit}>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden shrink-0">
                {currentUser.avatar && !currentUser.avatar.includes("dicebear") ? (
                  <img src={currentUser.avatar} alt="Me" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                    {currentUser.fullName?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              <textarea 
                value={newPostContent}
                onChange={e => setNewPostContent(e.target.value)}
                placeholder="Share advice, discuss jobs, or warn about scams..."
                className="w-full bg-[#F9FAFB] border-none focus:ring-0 resize-none text-sm font-medium text-[#111827] pt-3 placeholder:text-[#9CA3AF]"
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#F3F4F6]">
              <div className="flex gap-2">
                <button type="button" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors" title="Attach Image">
                  <ImageIcon size={20} />
                </button>
              </div>
              <button 
                type="submit" 
                disabled={submitting || !newPostContent.trim()}
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full text-sm font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? <Loader2 size={16} className="animate-spin"/> : <Send size={16} />} 
                Post
              </button>
            </div>
          </form>
        </div>

        {/* Feed Posts */}
        <div className="space-y-4">
          {posts.map(post => {
            const hasLiked = post.likes.includes(currentUser.id);
            return (
              <div key={post._id} className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                
                {/* Post Header */}
                <div className="p-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                      {post.author?.avatar && !post.author.avatar.includes("dicebear") ? (
                        <img src={post.author.avatar} alt={post.author.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                          {post.author?.fullName?.charAt(0) || "U"}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-[#111827] text-sm">{post.author?.fullName || "Verified Master"}</h4>
                        {post.author?.isVerified && <ShieldCheck size={14} className="text-orange-500" />}
                      </div>
                      <p className="text-[11px] font-semibold text-gray-500 flex items-center gap-1 mt-0.5">
                        <Briefcase size={12} /> {post.author?.profession} • {dayjs(post.createdAt).fromNow()}
                      </p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:bg-gray-100 p-2 rounded-full transition-colors">
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                {/* Post Body */}
                <div className="px-4 pb-3">
                  <p className="text-[14px] text-[#374151] leading-relaxed whitespace-pre-wrap font-medium">
                    {post.content}
                  </p>
                </div>

                {/* Post Stats */}
                <div className="px-4 py-2 border-t border-[#F3F4F6] flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-gray-500">{post.likes?.length || 0} Likes</span>
                  <span className="text-[11px] font-semibold text-gray-500">{post.comments?.length || 0} Comments</span>
                </div>

                {/* Post Actions */}
                <div className="px-2 py-1.5 border-t border-[#F3F4F6] flex items-center justify-between">
                  <button 
                    onClick={() => handleLike(post._id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-colors ${
                      hasLiked ? "text-orange-600 hover:bg-orange-50" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Heart size={20} className={hasLiked ? "fill-orange-600" : ""} /> Like
                  </button>
                  <button 
                    onClick={() => setActiveCommentPost(activeCommentPost === post._id ? null : post._id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <MessageCircle size={20} /> Comment
                  </button>
                </div>

                {/* Comments Section */}
                {activeCommentPost === post._id && (
                  <div className="bg-[#F9FAFB] p-4 border-t border-[#E5E7EB] space-y-4">
                    {post.comments?.map((c: any) => (
                      <div key={c.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0 mt-1">
                           {c.avatar && !c.avatar.includes("dicebear") ? (
                            <img src={c.avatar} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs font-bold">
                              {c.authorName?.charAt(0) || "U"}
                            </div>
                          )}
                        </div>
                        <div className="bg-white border border-[#E5E7EB] px-3 py-2 rounded-2xl rounded-tl-none w-full shadow-sm">
                          <h5 className="text-xs font-bold text-[#111827] mb-0.5">{c.authorName}</h5>
                          <p className="text-xs font-medium text-[#4B5563]">{c.text}</p>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex gap-3 mt-4 pt-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                        {currentUser.avatar && !currentUser.avatar.includes("dicebear") ? (
                          <img src={currentUser.avatar} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs font-bold">
                            {currentUser.fullName?.charAt(0) || "U"}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 relative">
                        <input 
                          type="text" 
                          value={commentText}
                          onChange={e => setCommentText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCommentSubmit(post._id);
                          }}
                          placeholder="Write a comment..."
                          className="w-full bg-white border border-[#E5E7EB] rounded-full pl-4 pr-10 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium text-[#111827]"
                        />
                        <button 
                          onClick={() => handleCommentSubmit(post._id)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-orange-500 hover:bg-orange-50 p-1.5 rounded-full transition-colors"
                        >
                          <Send size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {posts.length === 0 && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center text-gray-500 font-medium text-sm">
              No posts yet. Be the first to share your experience with other masters!
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
