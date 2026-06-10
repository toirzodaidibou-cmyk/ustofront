"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  MessageSquare, AlertCircle, Search, ShieldAlert,
  Clock, ShieldCheck, ChevronRight, Ban, CheckCircle2, CreditCard
} from "lucide-react";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");

export default function AdminChatsPage() {
  const { token } = useAuthStore();
  const [data, setData] = useState<{stats: any, conversations: any[]}>({ stats: {}, conversations: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/v1/admin/chats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if(res.ok) {
        setData(await res.json());
      }
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(token) loadData();
  }, [token]);

  const filteredConversations = data.conversations.filter(c => {
    const searchString = `${c.user1?.fullName} ${c.user2?.fullName}`.toLowerCase();
    return searchString.includes(search.toLowerCase());
  });

  const handleViewChat = async (chat: any) => {
    setSelectedChat(chat);
    setMessagesLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/chats/${chat._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if(res.ok) {
        setMessages(await res.json());
      }
    } catch(e) {
      console.error(e);
    } finally {
      setMessagesLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Chat Monitoring Center</h1>
          <p className="text-sm text-[#6B7280] mt-1">Monitor platform communications, resolve disputes, and review reported chats.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <MessageSquare size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Total Messages</p>
            <h3 className="text-2xl font-bold text-gray-900">{data.stats?.totalMessages || 0}</h3>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Active Chats (24h)</p>
            <h3 className="text-2xl font-bold text-gray-900">{data.stats?.activeChats || 0}</h3>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Reported Chats</p>
            <h3 className="text-2xl font-bold text-gray-900">{data.stats?.reportedChats || 0}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-[#E5E7EB] bg-white flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input 
              type="text" 
              placeholder="Search by user names..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-[#9CA3AF]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] text-[#6B7280] text-[11px] uppercase tracking-wider font-bold border-b border-[#E5E7EB]">
                <th className="px-6 py-4">Participants</th>
                <th className="px-6 py-4">Last Message</th>
                <th className="px-6 py-4">Activity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-[#6B7280] text-sm font-medium">Loading conversations...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredConversations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <p className="text-[#6B7280] text-sm font-medium">No conversations found.</p>
                  </td>
                </tr>
              ) : filteredConversations.map((chat) => (
                <tr key={chat._id} className="hover:bg-[#F9FAFB] transition-colors group cursor-pointer">
                  
                  {/* PARTICIPANTS */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-3">
                        {/* User 1 Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold overflow-hidden border-2 border-white z-10 shadow-sm">
                          {chat.user1?.avatar && !chat.user1?.avatar?.includes('dicebear') ? (
                            <img src={chat.user1.avatar} className="w-full h-full object-cover" />
                          ) : chat.user1?.fullName?.charAt(0) || "?"}
                        </div>
                        {/* User 2 Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold overflow-hidden border-2 border-white z-0 shadow-sm">
                          {chat.user2?.avatar && !chat.user2?.avatar?.includes('dicebear') ? (
                            <img src={chat.user2.avatar} className="w-full h-full object-cover" />
                          ) : chat.user2?.fullName?.charAt(0) || "?"}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{chat.user1?.fullName} <span className="text-gray-400 font-normal mx-1">and</span> {chat.user2?.fullName}</span>
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">{chat.messagesCount} Messages</span>
                      </div>
                    </div>
                  </td>

                  {/* LAST MESSAGE */}
                  <td className="px-6 py-4 max-w-[300px]">
                    <p className="text-sm text-gray-600 truncate font-medium">{chat.lastMessage}</p>
                  </td>

                  {/* ACTIVITY */}
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
                      {new Date(chat.lastMessageAt).toLocaleString()}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    {chat.reported ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2 py-1 rounded-md w-fit border border-red-200 uppercase">
                        <AlertCircle size={12} /> Reported
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md w-fit border border-emerald-200 uppercase">
                        <CheckCircle2 size={12} /> Clean
                      </span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleViewChat(chat)}
                      className="p-2 text-orange-500 bg-orange-50 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1 hover:bg-orange-100 transition-colors shadow-sm ml-auto"
                    >
                      View Chat <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chat View Modal */}
      {selectedChat && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedChat(null)}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-[#E5E7EB] bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border-2 border-white">
                    <img src={selectedChat.user1?.avatar || `https://api.dicebear.com/9.x/notionists/svg?seed=${selectedChat.user1?.fullName}`} className="w-full h-full object-cover" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border-2 border-white">
                    <img src={selectedChat.user2?.avatar || `https://api.dicebear.com/9.x/notionists/svg?seed=${selectedChat.user2?.fullName}`} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{selectedChat.user1?.fullName} & {selectedChat.user2?.fullName}</h3>
                  <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">{messages.length} Messages</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedChat(null)}
                className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F9FAFB]">
              {messagesLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500 py-10 text-sm font-medium">No messages found.</div>
              ) : (
                messages.map((msg: any) => {
                  // Determine sender
                  const isUser1 = String(msg.senderId) === String(selectedChat.user1?._id);
                  const sender = isUser1 ? selectedChat.user1 : selectedChat.user2;

                  return (
                    <div key={msg._id} className={`flex gap-3 max-w-[85%] ${isUser1 ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
                      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0 mt-auto">
                        <img src={sender?.avatar || `https://api.dicebear.com/9.x/notionists/svg?seed=${sender?.fullName}`} className="w-full h-full object-cover" />
                      </div>
                      <div className={`flex flex-col ${isUser1 ? 'items-end' : 'items-start'}`}>
                        <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">{sender?.fullName}</span>
                        
                        {msg.type === 'invoice' ? (
                          <div className={`p-4 rounded-2xl border shadow-sm ${isUser1 ? 'bg-orange-50 border-orange-100 text-orange-900 rounded-br-none' : 'bg-white border-gray-200 text-gray-900 rounded-bl-none'}`}>
                            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-black/5">
                              <span className="bg-orange-100 text-orange-600 p-1.5 rounded-lg">
                                <CreditCard size={14} />
                              </span>
                              <span className="font-bold text-sm">Invoice Request</span>
                            </div>
                            <p className="text-sm">{msg.messageText}</p>
                            <div className="mt-3 flex items-center justify-between font-bold">
                              <span>Amount:</span>
                              <span className="text-orange-600">{msg.invoiceAmount} TJS</span>
                            </div>
                            <div className="mt-2 text-xs font-semibold px-2 py-1 bg-black/5 rounded-md inline-block w-full text-center">
                              Status: {msg.invoiceStatus?.toUpperCase() || 'PENDING'}
                            </div>
                          </div>
                        ) : msg.fileUrl ? (
                          <div className={`rounded-2xl overflow-hidden shadow-sm ${isUser1 ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                            {msg.messageText === 'Овозӣ' ? (
                              <audio src={msg.fileUrl} controls className="h-10" />
                            ) : msg.fileUrl.match(/\.(jpeg|jpg|gif|png)$/i) || msg.messageText === 'Сурат' ? (
                              <img src={msg.fileUrl} alt="Attachment" className="max-w-[200px] object-cover" />
                            ) : (
                              <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-white border border-gray-200 text-blue-500 font-bold text-xs underline block text-center">Download Attachment</a>
                            )}
                          </div>
                        ) : (
                          <div className={`p-3 rounded-2xl text-[13px] shadow-sm ${isUser1 ? 'bg-orange-500 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none'}`}>
                            {msg.messageText}
                          </div>
                        )}
                        <span className="text-[9px] text-gray-400 font-medium mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
