"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Loader2, Menu, X, ShieldCheck } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!isAuthenticated || !currentUser) {
        router.push("/login");
      } else if (currentUser.role !== "admin") {
        router.push("/"); // Redirect non-admins to home
      }
    }
  }, [mounted, isAuthenticated, currentUser, router]);

  if (!mounted || !isAuthenticated || currentUser?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#111827]" size={32} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F7F9FC] lg:bg-white text-[#111827] font-sans overflow-hidden w-full">
      
      {/* Mobile Top Navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#E5E7EB] z-[60] flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#111827] rounded-lg flex items-center justify-center shadow-md">
            <ShieldCheck size={18} className="text-white" />
          </div>
          <span className="font-bold text-[#111827] text-lg tracking-tight">UstoAdmin</span>
        </div>
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)} 
          className="p-2 rounded-xl bg-gray-50 text-gray-700 border border-gray-200 shadow-sm active:scale-95 transition-all"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} strokeWidth={2.5} />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[40] lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Wrapper */}
      <div className={`
        fixed inset-y-0 left-0 z-[50] w-72 lg:w-64 transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
        lg:relative lg:translate-x-0
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <AdminSidebar onClose={() => setIsMobileOpen(false)} />
      </div>

      <main className="flex-1 overflow-y-auto overflow-x-hidden pt-16 lg:pt-0 relative w-full h-full pb-10 lg:pb-0">
        {children}
      </main>
    </div>
  );
}
