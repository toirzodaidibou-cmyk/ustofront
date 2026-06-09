'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useChatStore } from '@/store/useChatStore';
import { ChatContact, chatApi } from '@/services/chat.service';
import { ArrowLeft, Send, Check, CheckCheck, Smile, Paperclip, MoreVertical, Briefcase, Phone, Star, Receipt, CreditCard, Loader2, Clock, X } from 'lucide-react';
import Link from 'next/link';
import EmojiPicker from 'emoji-picker-react';
import { renderAvatar } from '@/utils/avatar';

export default function ChatRoomPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const targetId = params.id;
  
  const { currentUser } = useAuthStore();
  const currentUserId = currentUser?.id ? String(currentUser.id) : '';

  const { 
    contacts, messages, loadHistory, sendMessage, setTyping, typingUsers, 
    setActiveUser, addLocalContact, toggleReaction 
  } = useChatStore();

  const [messageText, setMessageText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [contactInfo, setContactInfo] = useState<ChatContact | null>(null);
  const [showQuickRequest, setShowQuickRequest] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [invoiceDesc, setInvoiceDesc] = useState('');
  const [isSendingInvoice, setIsSendingInvoice] = useState(false);
  const [reactionMenu, setReactionMenu] = useState<{ msgId: string, x: number, y: number, isOwn: boolean } | null>(null);

  const REACTION_EMOJIS = ['❤️', '👍', '🔥', '😂', '😮'];

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastTapTimeRef = useRef<number>(0);

  // Find or fetch contact
  useEffect(() => {
    setActiveUser(targetId);
    return () => setActiveUser(null);
  }, [targetId, setActiveUser]);

  useEffect(() => {
    const existing = contacts.find(c => c.userId === targetId);
    if (existing) {
      setContactInfo(existing);
    } else {
      // Fetch details if not in contacts
      fetch(`http://localhost:5000/api/v1/masters/${targetId}`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            const newContact: ChatContact = {
              userId: targetId,
              fullName: data.fullName || 'Усто',
              avatar: data.avatar || '',
              role: data.role || 'master',
              city: data.city || 'Душанбе',
              lastMessage: '',
              timestamp: new Date().toISOString(),
              unread: false
            };
            setContactInfo(newContact);
            addLocalContact(newContact);
          }
        })
        .catch(console.error);
    }
  }, [targetId, contacts, addLocalContact]);

  useEffect(() => {
    if (currentUserId && targetId) {
      loadHistory(currentUserId, targetId);
    }
  }, [currentUserId, targetId, loadHistory]);

  useEffect(() => {
    const handleClickOutside = () => setReactionMenu(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleReaction = (msgId: string, emoji: string) => {
    if (!currentUserId || !msgId) return;
    toggleReaction(msgId, currentUserId, targetId, emoji);
    setReactionMenu(null);
  };

  const handleTouchEnd = (e: React.TouchEvent, msgId: string) => {
    const now = Date.now();
    if (now - lastTapTimeRef.current < 300) {
      handleReaction(msgId, '❤️');
      lastTapTimeRef.current = 0;
      e.preventDefault(); // Prevent accidental clicks underneath
    } else {
      lastTapTimeRef.current = now;
    }
  };

  const handleContextMenu = (e: React.MouseEvent, msgId: string, isOwn: boolean) => {
    e.preventDefault();
    setReactionMenu({ msgId, x: e.clientX, y: e.clientY, isOwn });
  };

  const currentMessages = messages[targetId] || [];
  const isTyping = typingUsers[targetId];

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, isTyping]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageText.trim()) return;

    sendMessage(currentUserId, targetId, messageText.trim());
    setMessageText('');
    setShowEmojiPicker(false);
    
    // Stop typing
    setTyping(currentUserId, targetId, false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show temporary "Uploading..." feedback if needed, but for now just send it
    const uploadedUrl = await chatApi.uploadChatImage(file);
    
    if (uploadedUrl) {
      sendMessage(currentUserId, targetId, messageText.trim() || '📷 Сурат', uploadedUrl);
      setMessageText('');
    } else {
      alert("Хатогӣ ҳангоми боркунии сурат!");
    }
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceAmount || isNaN(Number(invoiceAmount))) return;
    
    setIsSendingInvoice(true);
    setTimeout(() => {
      // Send real invoice metadata
      const text = `Инвойс барои пардохт: ${invoiceDesc || 'Хизматрасонӣ'}`;
      sendMessage(currentUserId, targetId, text, undefined, 'invoice', Number(invoiceAmount));
      
      setShowInvoiceModal(false);
      setInvoiceAmount('');
      setInvoiceDesc('');
      setIsSendingInvoice(false);
    }, 600);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    
    setTyping(currentUserId, targetId, true);
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(currentUserId, targetId, false);
    }, 2000);
  };

  const onEmojiClick = (emojiObject: any) => {
    setMessageText(prev => prev + emojiObject.emoji);
  };

  const sendQuickRequest = () => {
    const requestText = `📋 **Фармоиши Хизматрасонӣ**\nСалом! Ман ба ёрии шумо ниёз дорам.\nЛутфан бо ман дар тамос шавед, то тафсилотро маслиҳат кунем.`;
    sendMessage(currentUserId, targetId, requestText);
    setShowQuickRequest(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f8f7]">
      {/* Header */}
      <div className="h-16 shrink-0 bg-white border-b border-stone-100 flex items-center justify-between px-4 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push('/chat')}
            className="md:hidden p-2 -ml-2 text-stone-500 hover:bg-stone-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="relative">
            {renderAvatar(contactInfo?.avatar, contactInfo?.fullName || 'U', "w-10 h-10 rounded-full border border-stone-100")}
            {isTyping && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                <span className="flex gap-0.5 bg-stone-100 px-1 py-0.5 rounded-full">
                  <span className="w-1 h-1 bg-stone-400 rounded-full animate-bounce"></span>
                  <span className="w-1 h-1 bg-stone-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1 h-1 bg-stone-400 rounded-full animate-bounce delay-150"></span>
                </span>
              </div>
            )}
          </div>
          
          <div>
            <h2 className="font-bold text-[#1a1a1a] text-[16px] flex items-center gap-1.5 leading-tight">
              {contactInfo?.fullName || 'Боркунӣ...'}
            </h2>
            {isTyping ? (
              <p className="text-[12px] text-[#E1306C] font-bold tracking-wide animate-pulse mt-0.5">менависад...</p>
            ) : (
              <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-1">
                <span className="flex items-center gap-1 text-[11px] font-bold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
                </span>
                {contactInfo?.role === 'master' && (
                  <>
                    <span className="flex items-center gap-0.5 text-[11px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-100/50">
                      <Star className="w-3 h-3 fill-blue-600" /> Verified Master
                    </span>
                    <span className="flex items-center gap-0.5 text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-100/50">
                      <Briefcase className="w-3 h-3" /> Усто
                    </span>
                  </>
                )}
                {contactInfo?.city && (
                  <span className="flex items-center gap-0.5 text-[11px] font-bold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded-md">
                    📍 {contactInfo.city}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {contactInfo?.role === 'master' && (
            <Link 
              href={`/masters/${targetId}`}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 rounded-full text-[12px] font-bold transition-colors"
            >
              <Briefcase className="w-3.5 h-3.5" />
              Профил
            </Link>
          )}
          <button className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Quick Request Hint (only show if few messages and interacting with a master) */}
        {currentMessages.length < 2 && contactInfo?.role === 'master' && !showQuickRequest && (
          <div className="flex justify-center mb-6">
            <button 
              onClick={() => setShowQuickRequest(true)}
              className="bg-white border border-stone-200 shadow-sm px-4 py-2 rounded-full text-sm font-semibold text-[#1a1a1a] hover:border-[#25D366] hover:shadow-md transition-all flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4 text-[#25D366]" />
              Фармоиши хизматрасонӣ
            </button>
          </div>
        )}

        {/* Quick Request Form Bubble */}
        {showQuickRequest && (
          <div className="flex justify-end mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white border border-stone-200 rounded-2xl rounded-tr-sm p-4 shadow-sm w-full max-w-[280px]">
              <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#25D366]" /> Фармоиши зуд
              </h4>
              <p className="text-xs text-stone-500 mb-3">Як паёми тайёр барои даъвати усто ба ин сӯҳбат фиристода мешавад.</p>
              <div className="flex gap-2">
                <button onClick={() => setShowQuickRequest(false)} className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold text-stone-600 transition-colors">Бекор кардан</button>
                <button onClick={sendQuickRequest} className="flex-1 py-2 bg-[#25D366] hover:bg-[#20ba59] rounded-xl text-xs font-bold text-white transition-colors">Фиристодан</button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex flex-col gap-[2px]">
          {currentMessages.map((msg, idx) => {
            const isOwn = msg.senderId === currentUserId;
            
            // Check grouping
            const isNextSame = currentMessages[idx + 1]?.senderId === msg.senderId;
            const isPrevSame = currentMessages[idx - 1]?.senderId === msg.senderId;
            const isLastInGroup = !isNextSame;
            const isFirstInGroup = !isPrevSame;
            
            const showAvatar = !isOwn && isLastInGroup;
            
            return (
              <div 
                key={msg._id || idx} 
                className={`flex w-full animate-in fade-in slide-in-from-bottom-1 duration-300 ${isOwn ? 'justify-end' : 'justify-start'} ${isLastInGroup ? 'mb-4' : ''} ${msg.reactions?.length ? 'mb-5' : ''}`}
              >
                {!isOwn && (
                  <div className="w-8 shrink-0 mr-2 flex flex-col justify-end">
                    {showAvatar ? renderAvatar(contactInfo?.avatar, contactInfo?.fullName || 'U', "w-7 h-7 rounded-full shadow-sm") : null}
                  </div>
                )}
                
                <div className={`relative flex flex-col max-w-[75%] sm:max-w-[65%] ${isOwn ? 'items-end' : 'items-start'}`}>
                  {/* Name header for group */}
                  {!isOwn && isFirstInGroup && (
                    <span className="text-[11px] font-bold text-stone-500 mb-1 ml-1">{contactInfo?.fullName}</span>
                  )}
                  
                  <div 
                    onDoubleClick={() => handleReaction(msg._id, '❤️')}
                    onTouchEnd={(e) => handleTouchEnd(e, msg._id)}
                    onContextMenu={(e) => handleContextMenu(e, msg._id, isOwn)}
                    className={`relative px-4 py-2.5 text-[15px] leading-relaxed shadow-[0_2px_10px_rgba(0,0,0,0.02)] cursor-pointer select-none border ${
                      isOwn 
                        ? 'bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#FCAF45] text-white border-transparent' 
                        : 'bg-white text-[#1a1a1a] border-stone-200/60'
                    } ${
                      isOwn 
                        ? `rounded-[22px] rounded-tr-[5px] ${isPrevSame ? 'rounded-tr-[22px]' : ''} ${isNextSame ? 'rounded-br-[5px]' : ''}`
                        : `rounded-[22px] rounded-tl-[5px] ${isPrevSame ? 'rounded-tl-[22px]' : ''} ${isNextSame ? 'rounded-bl-[5px]' : ''}`
                    }`}
                  >
                    {msg.imageUrl && (
                      <img src={msg.imageUrl} alt="attachment" className="max-w-[220px] sm:max-w-[280px] rounded-[14px] mb-2 object-cover" />
                    )}
                    
                    {/* Invoice Message Parsing */}
                    {msg.type === 'invoice' ? (
                      <div className="flex flex-col gap-2 min-w-[200px]">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isOwn ? 'bg-white/20' : 'bg-orange-100 text-orange-600'}`}>
                            <Receipt size={16} />
                          </div>
                          <span className="font-bold text-sm">Инвойс барои пардохт</span>
                        </div>
                        <div className={`rounded-xl p-3 flex flex-col items-center justify-center py-4 border shadow-inner ${isOwn ? 'bg-white/10 border-white/20' : 'bg-stone-50 border-stone-200'}`}>
                          <span className="text-3xl font-black">{msg.invoiceAmount} <span className="text-lg">TJS</span></span>
                          <span className="text-xs mt-1 text-center font-medium opacity-80">{msg.messageText}</span>
                        </div>
                        {!isOwn && msg.invoiceStatus !== 'paid' && (
                          <button 
                            onClick={async () => {
                              try {
                                const { useAuthStore } = await import('@/store/useAuthStore');
                                const token = useAuthStore.getState().token;
                                await fetch(`http://localhost:5000/api/v1/escrow/pay/${msg._id}`, {
                                  method: 'POST',
                                  headers: { 'Authorization': `Bearer ${token}` }
                                });
                                alert('Пардохт бомуваффақият анҷом ёфт!');
                                window.location.reload();
                              } catch (e) {
                                alert('Хатогӣ ҳангоми пардохт.');
                              }
                            }}
                            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-2 rounded-xl font-bold text-sm shadow-md mt-1 transition-all flex items-center justify-center gap-1.5"
                          >
                            <CreditCard size={14} /> Пардохт тавассути Escrow
                          </button>
                        )}
                        {msg.invoiceStatus === 'paid' && (
                          <div className={`w-full py-2 rounded-xl font-bold text-sm mt-1 flex items-center justify-center gap-1.5 ${isOwn ? 'bg-white text-emerald-600' : 'bg-emerald-500 text-white'}`}>
                            <CheckCheck size={14} /> Пардохт шуд
                          </div>
                        )}
                        {isOwn && msg.invoiceStatus !== 'paid' && (
                          <div className="w-full bg-white/20 text-white py-2 rounded-xl font-bold text-sm mt-1 flex items-center justify-center gap-1.5">
                            <Clock size={14} className="opacity-80" /> Интизори пардохт
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="break-words whitespace-pre-wrap">
                        {msg.messageText && msg.messageText !== '📷 Сурат' && msg.messageText}
                      </div>
                    )}

                    <div className={`flex justify-end items-center gap-1 mt-1 text-[10px] select-none ${isOwn ? 'text-white/80' : 'text-stone-400'}`}>
                      <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isOwn && (
                        msg.read ? <CheckCheck className="w-3.5 h-3.5 text-white" /> : <Check className="w-3.5 h-3.5 text-white/80" />
                      )}
                    </div>

                    {/* Reaction Badges Instagram Style */}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className={`absolute -bottom-3 ${isOwn ? 'right-2' : 'left-2'} bg-white border border-stone-200 rounded-full px-1.5 py-0.5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex items-center gap-1 text-[12px] z-10 animate-in zoom-in duration-200`}>
                        {Array.from(new Set(msg.reactions.map(r => r.emoji))).map(emoji => (
                          <span key={emoji} className="drop-shadow-sm">{emoji}</span>
                        ))}
                        {msg.reactions.length > 1 && <span className="font-bold text-stone-600 pl-0.5 text-[10px]">{msg.reactions.length}</span>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-white border border-stone-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-2" />

        {/* Reaction Context Menu Popover */}
        {reactionMenu && (
          <div 
            className="fixed z-50 bg-white rounded-full shadow-xl border border-stone-100 px-3 py-2 flex items-center gap-2 animate-in zoom-in-95 duration-200"
            style={{ 
              top: Math.max(20, reactionMenu.y - 60) + 'px', 
              left: reactionMenu.isOwn ? Math.max(20, reactionMenu.x - 200) + 'px' : Math.min(window.innerWidth - 250, reactionMenu.x + 10) + 'px' 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {REACTION_EMOJIS.map(emoji => (
              <button 
                key={emoji}
                onClick={() => handleReaction(reactionMenu.msgId, emoji)}
                className="text-2xl hover:scale-125 transition-transform origin-bottom cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 bg-white border-t border-stone-100 relative shrink-0">
        {showEmojiPicker && (
          <div className="absolute bottom-[70px] left-2 md:left-4 z-50 shadow-2xl rounded-2xl overflow-hidden animate-in slide-in-from-bottom-2 border border-black/5">
            <EmojiPicker 
              onEmojiClick={onEmojiClick} 
              searchPlaceHolder="Ҷустуҷӯи смайликҳо..." 
              width={320} 
              height={400} 
            />
          </div>
        )}
        
        {/* SVG Definition for Instagram Gradient */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="ig-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop stopColor="#833AB4" offset="0%" />
              <stop stopColor="#E1306C" offset="50%" />
              <stop stopColor="#FCAF45" offset="100%" />
            </linearGradient>
          </defs>
        </svg>
        
        <form onSubmit={handleSend} className="flex items-end gap-2 bg-[#f8f8f7] border border-stone-200 p-1.5 pl-3 rounded-3xl focus-within:border-[#25D366] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#25D366]/10 transition-all">
          <button 
            type="button" 
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2.5 rounded-full hover:bg-stone-100/80 transition-all duration-300 hover:scale-110 active:scale-95 group relative shrink-0 z-10"
          >
            <Smile 
              className="w-5 h-5 transition-all duration-300 group-hover:brightness-110" 
              style={{ stroke: "url(#ig-gradient)" }} 
            />
            {/* Glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-tr from-[#833AB4] via-[#E1306C] to-[#FCAF45] rounded-full blur-md opacity-0 ${showEmojiPicker ? 'opacity-40 animate-pulse' : 'group-active:opacity-50'} transition-opacity -z-10`}></div>
          </button>
          
          <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleImageUpload} />
          
          {currentUser?.role === 'master' && (
            <button 
              type="button" 
              onClick={() => setShowInvoiceModal(true)}
              className="p-2.5 text-stone-400 hover:text-orange-500 rounded-full hover:bg-stone-100 transition-colors shrink-0"
              title="Инвойс фиристодан"
            >
              <Receipt className="w-5 h-5" />
            </button>
          )}

          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 text-stone-400 hover:text-[#25D366] rounded-full hover:bg-stone-100 transition-colors shrink-0"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={messageText}
            onChange={handleInputChange}
            placeholder="Паём нависед..."
            className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-[14px] text-[#1a1a1a] py-3 placeholder:text-stone-400 min-w-0"
          />

          <button
            type="submit"
            disabled={!messageText.trim()}
            className="p-3 bg-[#25D366] hover:bg-[#20ba59] disabled:opacity-50 disabled:hover:bg-[#25D366] text-white rounded-full transition-all shrink-0 shadow-sm"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-black/5 flex justify-between items-center">
              <h2 className="text-[16px] font-bold text-[#1a1a1a] flex items-center gap-2">
                <Receipt className="text-orange-500" size={18} /> Инвойс фиристодан
              </h2>
              <button onClick={() => setShowInvoiceModal(false)} className="p-1.5 hover:bg-black/5 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSendInvoice} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1.5">Маблағ (TJS)</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="1"
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(e.target.value)}
                    placeholder="Масалан: 500"
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 pl-12 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold">SM</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1.5">Тавсифи хизматрасонӣ</label>
                <input
                  type="text"
                  required
                  value={invoiceDesc}
                  onChange={(e) => setInvoiceDesc(e.target.value)}
                  placeholder="Масалан: Таъмири мотори яхдон"
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!invoiceAmount || !invoiceDesc || isSendingInvoice}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white py-3.5 rounded-xl font-bold text-sm transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSendingInvoice ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  Фиристодани инвойс
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
