"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  Megaphone, AlertTriangle, Trophy, Gift, FileText, Bell, Check, Users, ShieldCheck, Send, Loader2 
} from "lucide-react";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");

const TYPES = [
  { id: 'General News', icon: Megaphone, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'Important Alert', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
  { id: 'Competition', icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  { id: 'Top Master Results', icon: Trophy, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'Promotion', icon: Gift, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'Policy Update', icon: FileText, color: 'text-gray-500', bg: 'bg-gray-50' },
];

const PRIORITIES = [
  { id: 'Low', color: 'bg-gray-100 text-gray-700' },
  { id: 'Medium', color: 'bg-blue-100 text-blue-700' },
  { id: 'High', color: 'bg-orange-100 text-orange-700' },
  { id: 'Critical', color: 'bg-red-100 text-red-700 animate-pulse' },
];

const RECIPIENTS = [
  'All',
  'All Masters',
  'All Clients',
  'Verified Masters Only',
  'Premium Masters Only'
];

export default function BroadcastCenterPage() {
  const { token } = useAuthStore();
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("General News");
  const [priority, setPriority] = useState("Medium");
  const [recipients, setRecipients] = useState("All Masters");
  const [submitting, setSubmitting] = useState(false);

  const loadBroadcasts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/v1/notifications/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if(res.ok) {
        const data = await res.json();
        setBroadcasts(data);
      }
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(token) loadBroadcasts();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!title || !content) return;
    
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/notifications`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ title, content, type, priority, recipients })
      });
      if(res.ok) {
        setTitle("");
        setContent("");
        loadBroadcasts();
      }
    } catch(e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Broadcast Center</h1>
          <p className="text-sm text-[#6B7280] mt-1">Send announcements, alerts, and updates to the platform.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CREATE BROADCAST FORM */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#E5E7EB] bg-[#F9FAFB]">
              <h2 className="font-bold text-[#111827] flex items-center gap-2">
                <Megaphone size={18} className="text-orange-500" /> New Broadcast
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Announcement Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {TYPES.map(t => {
                    const Icon = t.icon;
                    const isSelected = type === t.id;
                    return (
                      <button 
                        key={t.id} type="button" onClick={() => setType(t.id)}
                        className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold border transition-all ${
                          isSelected ? `border-gray-900 bg-gray-900 text-white` : `border-gray-200 bg-white text-gray-600 hover:bg-gray-50`
                        }`}
                      >
                        <Icon size={14} className={isSelected ? 'text-white' : t.color} /> {t.id}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Priority Level</label>
                <div className="flex gap-2">
                  {PRIORITIES.map(p => (
                    <button 
                      key={p.id} type="button" onClick={() => setPriority(p.id)}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                        priority === p.id ? `border-gray-900 ring-2 ring-gray-900/20 shadow-sm ${p.color}` : `border-gray-200 bg-white text-gray-500 opacity-50 hover:opacity-100`
                      }`}
                    >
                      {p.id}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recipients Target</label>
                <select 
                  value={recipients} onChange={e => setRecipients(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#374151] focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
                >
                  {RECIPIENTS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Title / Headline</label>
                <input 
                  type="text" value={title} onChange={e => setTitle(e.target.value)} required
                  placeholder="E.g. System Maintenance Tomorrow" 
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all placeholder:text-[#9CA3AF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Detailed Message</label>
                <textarea 
                  value={content} onChange={e => setContent(e.target.value)} required rows={4}
                  placeholder="Explain the update..." 
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all placeholder:text-[#9CA3AF] resize-none"
                />
              </div>

              <button 
                type="submit" disabled={submitting || !title || !content}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-[#111827] hover:bg-[#1F2937] transition-colors shadow-md disabled:opacity-50"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />} 
                Publish Broadcast
              </button>

            </form>
          </div>
        </div>

        {/* BROADCAST HISTORY */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-[#111827]">Past Broadcasts</h2>
          
          {loading ? (
             <div className="flex justify-center items-center py-20">
               <Loader2 className="animate-spin text-gray-400" size={32} />
             </div>
          ) : broadcasts.length === 0 ? (
            <div className="bg-white border border-[#E5E7EB] border-dashed rounded-2xl p-16 text-center">
               <Bell size={48} className="mx-auto text-gray-300 mb-4" />
               <h3 className="text-lg font-bold text-[#111827]">No broadcasts yet</h3>
               <p className="text-sm text-[#6B7280] mt-2">Send your first announcement to the platform.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {broadcasts.map(b => {
                const typeInfo = TYPES.find(t => t.id === b.type) || TYPES[0];
                const prioInfo = PRIORITIES.find(p => p.id === b.priority) || PRIORITIES[0];
                const Icon = typeInfo.icon;
                
                return (
                  <div key={b._id} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    {/* Priority Strip */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                      b.priority === 'Critical' ? 'bg-red-500' :
                      b.priority === 'High' ? 'bg-orange-500' :
                      b.priority === 'Medium' ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                    
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${typeInfo.bg}`}>
                        <Icon size={24} className={typeInfo.color} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${prioInfo.color}`}>{b.priority}</span>
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">{b.type}</span>
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-50 text-purple-600 border border-purple-100 flex items-center gap-1">
                                <Users size={10} /> {b.recipients}
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-[#111827]">{b.title}</h3>
                          </div>
                          <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                            {new Date(b.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">{b.content}</p>
                        
                        {/* Analytics Footer */}
                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-6">
                           <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                             <Check size={14} className="text-emerald-500" />
                             <span className="text-gray-900">{b.viewedBy?.length || 0}</span> Views
                           </div>
                           <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                             <ShieldCheck size={14} />
                             Sent by <span className="text-gray-900">{b.createdBy?.fullName || 'Admin'}</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
