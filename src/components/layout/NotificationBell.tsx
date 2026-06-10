"use client";

import React, { useState, useEffect } from "react";
import { Bell, AlertTriangle, Trophy, Gift, FileText, Megaphone, Check } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");

const ICONS: Record<string, any> = {
  'General News': { icon: Megaphone, color: 'text-blue-500', bg: 'bg-blue-50' },
  'Important Alert': { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
  'Competition': { icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  'Top Master Results': { icon: Trophy, color: 'text-orange-500', bg: 'bg-orange-50' },
  'Promotion': { icon: Gift, color: 'text-purple-500', bg: 'bg-purple-50' },
  'Policy Update': { icon: FileText, color: 'text-gray-500', bg: 'bg-gray-50' },
};

export default function NotificationBell({ isScrolled }: { isScrolled: boolean }) {
  const { token, currentUser } = useAuthStore();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showCriticalModal, setShowCriticalModal] = useState<any | null>(null);

  useEffect(() => {
    if (!token || !currentUser) return;
    
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
          
          // Check for unread critical notifications
          const unreadCritical = data.find((n: any) => 
            n.priority === 'Critical' && 
            !(n.viewedBy || []).includes(String(currentUser.id))
          );
          
          if (unreadCritical) {
            setShowCriticalModal(unreadCritical);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    
    fetchNotifications();
    // In a real app we might poll every 60s, or use WebSockets.
  }, [token, currentUser]);

  const markAsRead = async (id: string) => {
    if (!token) return;
    try {
      await fetch(`${API_BASE}/api/v1/notifications/${id}/view`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      // Optimistically update
      setNotifications(prev => prev.map(n => 
        n._id === id ? { ...n, viewedBy: [...(n.viewedBy || []), String(currentUser?.id)] } : n
      ));
      if (showCriticalModal?._id === id) {
        setShowCriticalModal(null);
      }
    } catch(e) {
      console.error(e);
    }
  };

  if (!currentUser) return null;

  const unreadCount = notifications.filter(n => !(n.viewedBy || []).includes(String(currentUser.id))).length;

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            className={`relative p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center cursor-pointer outline-none ${
              isScrolled
                ? "text-stone-600 hover:bg-stone-50 dark:text-stone-300 dark:hover:bg-stone-800"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-stone-900">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content 
            className="w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 z-50 mr-4" 
            sideOffset={10} 
            align="end"
          >
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  <Bell size={32} className="mx-auto text-gray-300 mb-2" />
                  No notifications yet.
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {notifications.map(n => {
                    const isUnread = !(n.viewedBy || []).includes(String(currentUser.id));
                    const typeInfo = ICONS[n.type] || ICONS['General News'];
                    const Icon = typeInfo.icon;
                    return (
                      <DropdownMenu.Item 
                        key={n._id} 
                        onSelect={(e) => {
                          e.preventDefault();
                          if (isUnread) markAsRead(n._id);
                        }}
                        className={`p-4 flex gap-3 outline-none cursor-pointer transition-colors hover:bg-gray-50 ${isUnread ? 'bg-orange-50/30' : 'opacity-70'}`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${typeInfo.bg}`}>
                          <Icon size={18} className={typeInfo.color} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={`text-sm ${isUnread ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
                              {n.title}
                            </h4>
                            {isUnread && <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0 mt-1" />}
                          </div>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{n.content}</p>
                          <span className="text-[10px] font-semibold text-gray-400 mt-2 block">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </DropdownMenu.Item>
                    )
                  })}
                </div>
              )}
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {/* Critical Announcement Modal */}
      {showCriticalModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden scale-in animate-in zoom-in-95 duration-300">
            <div className="bg-red-500 p-6 text-center">
              <AlertTriangle size={48} className="text-white mx-auto animate-pulse" />
              <h2 className="text-xl font-bold text-white mt-4 uppercase tracking-wider">Critical Alert</h2>
            </div>
            <div className="p-6 text-center space-y-4">
              <h3 className="text-lg font-bold text-gray-900">{showCriticalModal.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                {showCriticalModal.content}
              </p>
              <button 
                onClick={() => markAsRead(showCriticalModal._id)}
                className="w-full py-3 rounded-xl bg-gray-900 hover:bg-black text-white font-bold transition-colors flex items-center justify-center gap-2 mt-2"
              >
                <Check size={18} /> I understand
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
