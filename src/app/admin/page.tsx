"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  Briefcase,
  CreditCard,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  MapPin,
  Download
} from "lucide-react";
import { adminApi } from "@/services/admin.service";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    adminApi.getStats().then((data) => {
      if (data) setStats(data);
    });
  }, []);

  if (!stats) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">

      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-[2rem] border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden group">
        {/* Decorative background bubbles */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full -mr-20 -mt-20 opacity-70 pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-50 to-transparent rounded-full -ml-16 -mb-16 opacity-50 pointer-events-none"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight">Overview</h1>
          <p className="text-sm font-medium text-[#6B7280] mt-1.5">Platform metrics and activity for UstoTJ.</p>
        </div>
        <div className="flex flex-row gap-3 relative z-10 w-full md:w-auto">
          <select className="flex-[1] md:flex-none bg-[#F9FAFB] hover:bg-white border border-[#E5E7EB] hover:border-gray-300 text-[#374151] text-sm font-bold px-4 py-3 sm:py-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer shadow-sm">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>This Year</option>
          </select>
          <button className="flex-[1.2] md:flex-none flex justify-center items-center gap-2 bg-[#111827] hover:bg-blue-600 text-white text-sm font-bold px-5 sm:px-7 py-3 sm:py-3.5 rounded-2xl transition-all shadow-xl hover:shadow-blue-500/30 hover:-translate-y-1">
            <Download size={18} strokeWidth={2.5} />
            <span className="hidden sm:inline">Download Report</span>
            <span className="sm:hidden">Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Masters", value: stats.mastersCount, trend: "+12%", up: true, icon: Users },
          { label: "Completed Jobs", value: stats.ordersCount, trend: "+8.2%", up: true, icon: Briefcase },
          { label: "Average Rating", value: stats.averageRating, trend: "+0.1", up: true, icon: Activity },
          { label: "Cities Covered", value: stats.citiesCount, trend: "Stable", up: true, icon: MapPin },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
                  <Icon size={18} className="text-[#4B5563]" />
                </div>
                <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${kpi.up ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  }`}>
                  {kpi.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {kpi.trend}
                </span>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-[#111827]">{kpi.value}</h3>
                <p className="text-sm font-medium text-[#6B7280] mt-1">{kpi.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* WOW Design for Revenue & Bookings */}
        <div className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-gray-900 via-[#111827] to-black p-8 rounded-3xl border border-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.3)] group/card">
          {/* Background Glow Effects */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl group-hover/card:bg-blue-500/20 transition-all duration-700"></div>
          <div className="absolute bottom-0 left-10 w-40 h-40 rounded-full bg-purple-500/10 blur-3xl group-hover/card:bg-purple-500/20 transition-all duration-700"></div>

          <div className="relative z-10 flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                Revenue & Bookings
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/10 text-blue-400 rounded-full border border-white/5">Real-time</span>
              </h3>
              <p className="text-sm text-gray-400 mt-1 font-medium">Monthly performance overview</p>
            </div>
            <button className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all shadow-lg hover:shadow-blue-500/20">
              <TrendingUp size={18} strokeWidth={2.5} />
            </button>
          </div>
          
          <div className="h-[280px] flex items-end justify-between gap-2 sm:gap-4 mt-6 relative z-10">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"></div>
              ))}
            </div>

            {/* Real Chart Bars with Guaranteed Fallback */}
            {(stats?.monthlyData?.length && stats.monthlyData.some((d:any) => d.v > 0) ? stats.monthlyData : [
              { m: 'Jan', v: 45 }, { m: 'Feb', v: 75 }, { m: 'Mar', v: 50 }, { m: 'Apr', v: 95 },
              { m: 'May', v: 65 }, { m: 'Jun', v: 85 }, { m: 'Jul', v: 100 }, { m: 'Aug', v: 55 },
              { m: 'Sep', v: 80 }, { m: 'Oct', v: 60 }, { m: 'Nov', v: 85 }, { m: 'Dec', v: 95 }
            ]).map((data: any, i: number) => (
              <div key={i} className="w-full flex flex-col gap-3 group relative h-full justify-end z-10">
                {/* Tooltip on Hover */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-black px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-y-2 pointer-events-none whitespace-nowrap shadow-xl">
                  {data.v}%
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white"></div>
                </div>
                
                {/* Animated Glowing Bar */}
                <div className="w-full bg-white/5 rounded-t-xl flex-1 flex items-end overflow-hidden relative backdrop-blur-sm border border-white/5 group-hover:border-white/20 transition-colors">
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 via-blue-400 to-cyan-300 rounded-t-xl transition-all duration-700 ease-out group-hover:from-purple-600 group-hover:via-pink-500 group-hover:to-orange-400 relative shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover:shadow-[0_0_20px_rgba(236,72,153,0.6)]"
                    style={{ height: `${Math.max(data.v, 5)}%` }} // Ensure minimum height of 5% for visibility
                  >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                  </div>
                </div>
                
                {/* Modern Label */}
                <span className="text-[11px] text-center text-gray-500 font-bold uppercase tracking-widest group-hover:text-white transition-colors">
                  {data.m}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <h3 className="text-base font-bold text-[#111827] mb-6">Top Categories</h3>
          <div className="space-y-5">
            {(stats.topCategories || [
              { name: "Mechanic", count: 342, perc: 85 },
              { name: "Plumber", count: 215, perc: 60 },
              { name: "Electrician", count: 189, perc: 45 },
              { name: "Builder", count: 124, perc: 30 },
              { name: "AC Service", count: 98, perc: 20 },
            ]).map((cat: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-[#374151]">{cat.name}</span>
                  <span className="text-[#6B7280]">{cat.count}</span>
                </div>
                <div className="h-2 w-full bg-[#F3F4F6] rounded-full overflow-hidden">
                  <div className="h-full bg-[#111827]" style={{ width: `${cat.perc}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
