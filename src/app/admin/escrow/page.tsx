"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  Briefcase, Search, Wallet, ShieldCheck, 
  ArrowRightLeft, AlertCircle, Clock, ChevronRight 
} from "lucide-react";

const API_BASE = "http://localhost:5000";

export default function EscrowDashboardPage() {
  const { token } = useAuthStore();
  const [data, setData] = useState<{stats: any, transactions: any[]}>({ stats: {}, transactions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch(`${API_BASE}/api/v1/escrow/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
    }
  }, [token]);

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Escrow & Payments</h1>
          <p className="text-sm text-[#6B7280] mt-1">Manage platform funds, review escrow transactions, and track revenue.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Total Funds Held</p>
            <h3 className="text-2xl font-bold text-gray-900">{data.stats?.totalHeld || 0} TJS</h3>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Total Released</p>
            <h3 className="text-2xl font-bold text-gray-900">{data.stats?.totalReleased || 0} TJS</h3>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#111827] to-gray-800 rounded-2xl p-6 shadow-sm flex items-center gap-4 text-white">
          <div className="w-12 h-12 rounded-full bg-white/10 text-orange-400 flex items-center justify-center shrink-0">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-300">Platform Revenue (5%)</p>
            <h3 className="text-2xl font-bold text-white">{data.stats?.totalFeesEarned || 0} TJS</h3>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Disputed</p>
            <h3 className="text-2xl font-bold text-gray-900">{data.stats?.disputedCount || 0}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden">
        
        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] text-[#6B7280] text-[11px] uppercase tracking-wider font-bold border-b border-[#E5E7EB]">
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Participants</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-[#6B7280] text-sm font-medium">Loading transactions...</p>
                    </div>
                  </td>
                </tr>
              ) : data.transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <p className="text-[#6B7280] text-sm font-medium">No escrow transactions found.</p>
                  </td>
                </tr>
              ) : data.transactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-[#F9FAFB] transition-colors">
                  
                  {/* ID */}
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{tx._id.substring(0, 8)}...</span>
                  </td>

                  {/* PARTICIPANTS */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-gray-900 flex items-center gap-1">
                        <span className="text-[10px] text-gray-400 font-normal w-12">From:</span> {tx.clientId?.fullName || 'Client'}
                      </span>
                      <span className="text-sm font-bold text-gray-900 flex items-center gap-1">
                        <span className="text-[10px] text-gray-400 font-normal w-12">To:</span> {tx.masterId?.fullName || 'Master'}
                      </span>
                    </div>
                  </td>

                  {/* AMOUNT */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-gray-900">{tx.totalAmount} TJS</span>
                      <span className="text-[10px] font-bold text-orange-500 uppercase">Fee: {tx.platformFee} TJS</span>
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    {tx.status === 'held' && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-md w-fit border border-blue-200 uppercase">
                        <Clock size={12} /> Held in Escrow
                      </span>
                    )}
                    {tx.status === 'released' && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md w-fit border border-emerald-200 uppercase">
                        <ShieldCheck size={12} /> Released
                      </span>
                    )}
                    {tx.status === 'refunded' && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded-md w-fit border border-gray-300 uppercase">
                        <ArrowRightLeft size={12} /> Refunded
                      </span>
                    )}
                    {tx.status === 'disputed' && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2 py-1 rounded-md w-fit border border-red-200 uppercase">
                        <AlertCircle size={12} /> Disputed
                      </span>
                    )}
                  </td>

                  {/* DATE */}
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-600">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
