"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  ShieldCheck, AlertCircle, Clock, Search, 
  CheckCircle2, XCircle, ChevronRight, Download, Filter
} from "lucide-react";
import Link from "next/link";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");

interface KycUser {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  role: string;
  city: string;
  avatar: string;
  passportPhoto: string;
  selfiePhoto: string;
  verificationStatus: string;
  createdAt: string;
}

export default function AdminKycPage() {
  const { token } = useAuthStore();
  const [users, setUsers] = useState<KycUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'verified' | 'rejected'>('pending');
  
  const [selectedUser, setSelectedUser] = useState<KycUser | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = () => {
    if (token) {
      setLoading(true);
      fetch(`${API_BASE}/api/v1/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        // Only keep users that have uploaded documents
        const kycUsers = data.filter((u: any) => u.passportPhoto && u.selfiePhoto);
        setUsers(kycUsers);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
    }
  };

  const handleVerifyAction = async (userId: string, status: 'verified' | 'rejected') => {
    if (!confirm(`Оё боварӣ доред, ки мехоҳед ҳуҷҷатҳоро ${status === 'verified' ? 'ТАСДИҚ' : 'РАД'} кунед?`)) return;

    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (!res.ok) throw new Error("Failed to verify user");

      // Update local state
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, verificationStatus: status } : u));
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser({ ...selectedUser, verificationStatus: status });
      }

    } catch (err) {
      console.error(err);
      alert("Хатогӣ рух дод!");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter(u => u.verificationStatus === filter);

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">KYC Verification</h1>
          <p className="text-sm text-[#6B7280] mt-1">Тасдиқи шиноснома ва ҳуҷҷатҳои устоҳо барои бехатарии платформа.</p>
        </div>
      </div>

      <div className="flex gap-6 h-[calc(100vh-200px)]">
        
        {/* Left Col: User List */}
        <div className="w-1/3 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm flex flex-col overflow-hidden">
          
          <div className="p-4 border-b border-[#E5E7EB] bg-gray-50/50 flex gap-2">
            <button 
              onClick={() => setFilter('pending')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${filter === 'pending' ? 'bg-white shadow-sm border border-gray-200 text-amber-600' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <Clock size={14} /> Нав ({users.filter(u => u.verificationStatus === 'pending').length})
            </button>
            <button 
              onClick={() => setFilter('verified')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${filter === 'verified' ? 'bg-white shadow-sm border border-gray-200 text-emerald-600' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <ShieldCheck size={14} /> Тасдиқшуда
            </button>
            <button 
              onClick={() => setFilter('rejected')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${filter === 'rejected' ? 'bg-white shadow-sm border border-gray-200 text-red-600' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <XCircle size={14} /> Радшуда
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {loading ? (
              <div className="p-10 flex justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-10 text-center text-gray-500 text-sm font-medium">
                Дар ин гурӯҳ ягон корбар ёфт нашуд.
              </div>
            ) : filteredUsers.map(user => (
              <div 
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`p-3 rounded-xl cursor-pointer transition-all border ${selectedUser?._id === user._id ? 'bg-blue-50 border-blue-200' : 'bg-white border-transparent hover:border-gray-200'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                    <img src={user.avatar || `https://api.dicebear.com/9.x/notionists/svg?seed=${user.firstName}`} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-gray-900 truncate">{user.fullName}</h4>
                    <p className="text-xs text-gray-500 truncate">{user.phone} • {user.role}</p>
                  </div>
                  <ChevronRight size={16} className={selectedUser?._id === user._id ? 'text-blue-500' : 'text-gray-300'} />
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Col: Details View */}
        <div className="flex-1 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden flex flex-col">
          {selectedUser ? (
            <div className="flex-1 overflow-y-auto">
              
              <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between bg-gray-50/30">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden shadow-sm">
                    <img src={selectedUser.avatar || `https://api.dicebear.com/9.x/notionists/svg?seed=${selectedUser.firstName}`} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedUser.fullName}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-medium text-gray-500">{selectedUser.phone}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="text-sm font-medium text-gray-500 capitalize">{selectedUser.role} дар {selectedUser.city}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {selectedUser.verificationStatus === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleVerifyAction(selectedUser._id, 'rejected')}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
                      >
                        Рад кардан
                      </button>
                      <button 
                        onClick={() => handleVerifyAction(selectedUser._id, 'verified')}
                        disabled={actionLoading}
                        className="px-6 py-2 bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        <ShieldCheck size={16} /> Тасдиқ кардан
                      </button>
                    </>
                  )}
                  {selectedUser.verificationStatus === 'verified' && (
                    <span className="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl text-sm font-bold flex items-center gap-2">
                      <CheckCircle2 size={16} /> Тасдиқшуда
                    </span>
                  )}
                  {selectedUser.verificationStatus === 'rejected' && (
                    <span className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-bold flex items-center gap-2">
                      <XCircle size={16} /> Рад карда шудааст
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-8">
                
                {/* Passport Image */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">1. Сурати Шиноснома (Паспорт)</h3>
                    <a href={selectedUser.passportPhoto} download target="_blank" rel="noreferrer" className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                      <Download size={18} />
                    </a>
                  </div>
                  <div className="w-full bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden flex items-center justify-center p-2 min-h-[300px]">
                    <img src={selectedUser.passportPhoto} alt="Passport" className="max-w-full max-h-[500px] object-contain rounded-xl shadow-sm" />
                  </div>
                </div>

                {/* Selfie Image */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">2. Селфи бо Шиноснома</h3>
                    <a href={selectedUser.selfiePhoto} download target="_blank" rel="noreferrer" className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                      <Download size={18} />
                    </a>
                  </div>
                  <div className="w-full bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden flex items-center justify-center p-2 min-h-[300px]">
                    <img src={selectedUser.selfiePhoto} alt="Selfie" className="max-w-full max-h-[500px] object-contain rounded-xl shadow-sm" />
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
              <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-2xl flex items-center justify-center mb-4">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Корбарро интихоб кунед</h3>
              <p className="text-sm text-gray-500 max-w-[250px]">Барои дидан ва тасдиқи ҳуҷҷатҳо як корбарро аз рӯйхат пахш кунед.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
