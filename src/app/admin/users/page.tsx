"use client";

import React, { useEffect, useState } from "react";
import { adminApi } from "@/services/admin.service";
import { 
  Search, Filter, ShieldAlert, Trash2, ShieldCheck, 
  Ban, CheckCircle2, Star, BadgeCheck, Trophy, Gem,
  MoreVertical, RefreshCw, XCircle, ChevronDown, Check
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadUsers = async () => {
    setLoading(true);
    const data = await adminApi.getAllUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAction = async (id: string, action: string) => {
    if (action === 'delete') {
      if(confirm("Are you sure you want to delete this user completely?")) {
        await adminApi.deleteUser(id);
        loadUsers();
      }
    } else {
      await adminApi.updateUserStatus(id, action);
      loadUsers();
    }
  };

  const handleToggleBadge = async (user: any, badge: string) => {
    const currentBadges = user.badges || [];
    const newBadges = currentBadges.includes(badge) 
      ? currentBadges.filter((b: string) => b !== badge)
      : [...currentBadges, badge];
    
    await adminApi.updateUserBadges(user._id, newBadges);
    loadUsers();
  };

  const filteredUsers = users.filter(u => {
    const matchSearch = u.fullName?.toLowerCase().includes(search.toLowerCase()) || u.phone?.includes(search);
    const matchCity = cityFilter === "All" || u.city === cityFilter;
    const matchRole = roleFilter === "All" || u.role === roleFilter.toLowerCase();
    const matchStatus = statusFilter === "All" || u.verificationStatus === statusFilter.toLowerCase();
    return matchSearch && matchCity && matchRole && matchStatus;
  });

  const uniqueCities = Array.from(new Set(users.map(u => u.city).filter(Boolean)));

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Users & Masters Management</h1>
          <p className="text-sm text-[#6B7280] mt-1">Manage platform accounts, assign badges, and enforce security policies.</p>
        </div>
        <button onClick={loadUsers} className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#374151] hover:bg-[#F9FAFB] transition-colors shadow-sm">
          <RefreshCw size={16} className={loading ? "animate-spin text-orange-500" : ""} /> Refresh Data
        </button>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden">
        
        {/* Advanced Toolbar */}
        <div className="p-4 border-b border-[#E5E7EB] bg-white flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-[#9CA3AF]"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            {/* Role Filter */}
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#374151] focus:outline-none cursor-pointer">
              <option value="All">All Roles</option>
              <option value="Master">Masters</option>
              <option value="Client">Clients</option>
            </select>
            
            {/* Status Filter */}
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#374151] focus:outline-none cursor-pointer">
              <option value="All">All Statuses</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
            </select>

            {/* City Filter */}
            <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#374151] focus:outline-none cursor-pointer">
              <option value="All">All Cities</option>
              {uniqueCities.map(city => <option key={city as string} value={city as string}>{city as string}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] text-[#6B7280] text-[11px] uppercase tracking-wider font-bold border-b border-[#E5E7EB]">
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Location / Profession</th>
                <th className="px-6 py-4">Performance</th>
                <th className="px-6 py-4">Badges</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-[#6B7280] text-sm font-medium">Loading user database...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <p className="text-[#6B7280] text-sm font-medium">No users found matching your filters.</p>
                  </td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-[#F9FAFB] transition-colors group">
                  
                  {/* USER DETAILS */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold overflow-hidden shrink-0 border border-gray-200">
                        {user.avatar && !user.avatar.includes('dicebear') ? (
                          <img src={user.avatar} className="w-full h-full object-cover" />
                        ) : user.fullName?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-bold text-[#111827]">{user.fullName}</p>
                          {user.role === 'admin' && <span className="bg-purple-100 text-purple-700 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">Admin</span>}
                          {user.role === 'client' && <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">Client</span>}
                        </div>
                        <p className="text-[12px] font-medium text-[#6B7280] mt-0.5">{user.phone}</p>
                      </div>
                    </div>
                  </td>

                  {/* LOCATION & CATEGORY */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-[#374151]">{user.city}</p>
                    <p className="text-[12px] font-medium text-[#6B7280] mt-0.5">{user.profession || 'N/A'}</p>
                  </td>

                  {/* PERFORMANCE */}
                  <td className="px-6 py-4">
                    {user.role === 'master' ? (
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Jobs</span>
                          <span className="text-sm font-bold text-gray-900">{user.masterData?.completedJobs || 0}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Rating</span>
                          <span className="text-sm font-bold text-gray-900 flex items-center gap-1">
                            <Star size={12} className="text-yellow-400 fill-yellow-400" /> {user.masterData?.rating || "0.0"}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Trust</span>
                          <span className="text-sm font-bold text-gray-900">{user.masterData?.trustScore || 0}%</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium">-</span>
                    )}
                  </td>

                  {/* BADGES */}
                  <td className="px-6 py-4">
                    {user.role === 'master' ? (
                      <div className="flex flex-wrap gap-1.5 max-w-[160px]">
                        {(user.badges || []).includes('verified') && (
                          <span title="Verified Master" className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200"><BadgeCheck size={14} /></span>
                        )}
                        {(user.badges || []).includes('featured') && (
                          <span title="Featured Master" className="w-6 h-6 rounded-md bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-200"><Star size={14} /></span>
                        )}
                        {(user.badges || []).includes('top') && (
                          <span title="Top Master" className="w-6 h-6 rounded-md bg-yellow-50 text-yellow-600 flex items-center justify-center border border-yellow-200"><Trophy size={14} /></span>
                        )}
                        {(user.badges || []).includes('premium') && (
                          <span title="Premium Master" className="w-6 h-6 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200"><Gem size={14} /></span>
                        )}
                        {(!user.badges || user.badges.length === 0) && (
                          <span className="text-xs text-gray-400 font-medium">No Badges</span>
                        )}
                      </div>
                    ) : <span className="text-xs text-gray-400 font-medium">-</span>}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    {user.verificationStatus === 'verified' ? (
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md w-fit border border-emerald-200 uppercase">
                        <CheckCircle2 size={12} /> Approved
                      </span>
                    ) : user.verificationStatus === 'suspended' ? (
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-md w-fit border border-red-200 uppercase">
                        <Ban size={12} /> Suspended
                      </span>
                    ) : user.verificationStatus === 'rejected' ? (
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md w-fit border border-gray-200 uppercase">
                        <XCircle size={12} /> Rejected
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-md w-fit border border-orange-200 uppercase">
                        Pending
                      </span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors outline-none data-[state=open]:bg-gray-200">
                          <MoreVertical size={16} className="text-gray-500" />
                        </button>
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Portal>
                        <DropdownMenu.Content className="min-w-[200px] bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 animate-in fade-in zoom-in-95 z-50 mr-4" sideOffset={5} align="end">
                          
                          <DropdownMenu.Label className="px-2 py-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Account Actions</DropdownMenu.Label>
                          <DropdownMenu.Item onSelect={() => handleAction(user._id, 'verified')} className="flex items-center gap-2 px-2 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer outline-none">
                            <CheckCircle2 size={16} className="text-emerald-500" /> Approve Account
                          </DropdownMenu.Item>
                          <DropdownMenu.Item onSelect={() => handleAction(user._id, 'suspended')} className="flex items-center gap-2 px-2 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer outline-none">
                            <Ban size={16} className="text-red-500" /> Suspend Account
                          </DropdownMenu.Item>
                          <DropdownMenu.Item onSelect={() => handleAction(user._id, 'pending')} className="flex items-center gap-2 px-2 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer outline-none">
                            <ShieldAlert size={16} className="text-orange-500" /> Mark as Pending
                          </DropdownMenu.Item>
                          
                          {user.role === 'master' && (
                            <>
                              <DropdownMenu.Separator className="h-px bg-gray-100 my-1.5" />
                              <DropdownMenu.Label className="px-2 py-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Manage Badges</DropdownMenu.Label>
                              {[
                                { id: 'verified', label: 'Verified Master', icon: BadgeCheck, color: 'text-blue-500' },
                                { id: 'featured', label: 'Featured Listing', icon: Star, color: 'text-orange-500' },
                                { id: 'top', label: 'Top Master', icon: Trophy, color: 'text-yellow-500' },
                                { id: 'premium', label: 'Premium Status', icon: Gem, color: 'text-purple-500' }
                              ].map(b => {
                                const hasBadge = (user.badges || []).includes(b.id);
                                const Icon = b.icon;
                                return (
                                  <DropdownMenu.Item key={b.id} onSelect={(e) => { e.preventDefault(); handleToggleBadge(user, b.id); }} className="flex items-center justify-between px-2 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer outline-none">
                                    <span className="flex items-center gap-2"><Icon size={16} className={b.color} /> {b.label}</span>
                                    {hasBadge && <Check size={16} className="text-emerald-500" />}
                                  </DropdownMenu.Item>
                                );
                              })}
                            </>
                          )}

                          <DropdownMenu.Separator className="h-px bg-gray-100 my-1.5" />
                          <DropdownMenu.Item onSelect={() => handleAction(user._id, 'delete')} className="flex items-center gap-2 px-2 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-md cursor-pointer outline-none">
                            <Trash2 size={16} /> Delete Account
                          </DropdownMenu.Item>
                          
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
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
