'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useChatStore } from '@/store/useChatStore';
import { MessageSquare, Search, CircleDot } from 'lucide-react';
import Link from 'next/link';
import { renderAvatar } from '@/utils/avatar';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, isAuthenticated } = useAuthStore();
  const currentUserId = currentUser?.id ? String(currentUser.id) : '';
  
  const { contacts, searchQuery, setSearchQuery, loadContacts, initSocket, isSocketConnected, messages } = useChatStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated && typeof window !== 'undefined') {
      router.push('/login?redirect=/chat');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (currentUserId) {
      initSocket(currentUserId);
      loadContacts(currentUserId);
    }
  }, [currentUserId, initSocket, loadContacts]);

  if (!mounted || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-50">
        <div className="text-stone-500 animate-pulse text-sm font-semibold">Аввал ворид шавед...</div>
      </div>
    );
  }

  // If we are exactly at /chat, we are in "list mode" on mobile.
  // If we are at /chat/[id], we are in "chat mode" on mobile.
  const isChatView = pathname !== '/chat';

  const filteredContacts = contacts.filter(contact =>
    contact.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-50 pt-20 pb-10 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white border border-stone-200 rounded-[2rem] shadow-sm overflow-hidden flex h-[80vh]">
        
        {/* Contacts Sidebar */}
        <div className={`w-full md:w-[340px] border-r border-stone-100 flex flex-col bg-white shrink-0 ${
          isChatView ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Header */}
          <div className="p-5 border-b border-stone-100 shrink-0">
            <h1 className="text-xl font-bold mb-4 text-[#1a1a1a] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#25D366]" />
                Паёмҳо
              </span>
              <span className="text-xs font-semibold px-2 py-1 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center gap-1.5 border border-[#25D366]/20">
                <CircleDot className={`w-2.5 h-2.5 ${isSocketConnected ? 'text-[#25D366] animate-pulse' : 'text-stone-300'}`} />
                {isSocketConnected ? 'Онлайн' : 'Офлайн'}
              </span>
            </h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Ҷустуҷӯ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f8f8f7] border border-transparent focus:border-orange-500 focus:bg-white rounded-xl py-3 pl-10 pr-4 text-[14px] text-[#1a1a1a] outline-none transition-all placeholder:text-[#9ca3af]"
              />
              <Search className="w-4 h-4 text-[#9ca3af] absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Contact List */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {filteredContacts.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#9ca3af] flex flex-col items-center">
                <MessageSquare className="w-8 h-8 mb-3 opacity-20" />
                Шумо ягон суҳбат надоред
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {filteredContacts.map(contact => {
                  const isActive = pathname === `/chat/${contact.userId}`;
                  // Unread count based on local store if we track it, or contact.unread flag
                  return (
                    <Link
                      key={contact.userId}
                      href={`/chat/${contact.userId}`}
                      className={`p-3 flex gap-3.5 rounded-2xl cursor-pointer transition-all ${
                        isActive 
                          ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' 
                          : 'hover:bg-[#f8f8f7] text-[#1a1a1a]'
                      }`}
                    >
                      <div className="relative shrink-0">
                        {renderAvatar(contact.avatar, contact.fullName, `w-12 h-12 rounded-full border-2 ${isActive ? 'border-orange-400' : 'border-white bg-[#f8f8f7]'}`)}
                        {contact.unread && !isActive && (
                          <div className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 bg-[#25D366] text-white text-[10px] font-bold border-2 border-white rounded-full flex items-center justify-center shadow-sm">
                            1
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex justify-between items-center mb-0.5">
                          <h3 className={`font-bold text-[15px] truncate ${isActive ? 'text-white' : 'text-[#1a1a1a]'}`}>
                            {contact.fullName}
                          </h3>
                          <span className={`text-[10px] font-semibold shrink-0 ml-2 ${isActive ? 'text-orange-200' : 'text-[#9ca3af]'}`}>
                            {new Date(contact.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className={`text-[13px] truncate ${isActive ? 'text-orange-100' : 'text-[#666666]'}`}>
                          {contact.lastMessage || 'Оғози сӯҳбат...'}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className={`flex-1 flex flex-col bg-[#f8f8f7] ${
          !isChatView ? 'hidden md:flex' : 'flex'
        }`}>
          {children}
        </div>

      </div>
    </div>
  );
}
