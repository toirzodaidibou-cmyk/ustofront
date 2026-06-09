"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  MessageSquare,
  LogOut,
  Briefcase,
  Video,
  Store,
  Trophy,
  Bell,
  Globe,
  Heart
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Users & Masters", href: "/admin/users", icon: Users },
    { name: "Verification (KYC)", href: "/admin/kyc", icon: ShieldCheck },
    { name: "Risk Center", href: "/admin/reports", icon: AlertTriangle },
    { name: "Chat Monitoring", href: "/admin/chats", icon: MessageSquare },
    { name: "Escrow & Payments", href: "/admin/escrow", icon: Briefcase },
    { name: "Reels Moderation", href: "/admin/reels", icon: Video },
    { name: "Premium Store", href: "/admin/store", icon: Store },
    { name: "Top Masters", href: "/admin/top-masters", icon: Trophy },
    { name: "Master Community", href: "/master-community", icon: Globe },
    { name: "Notifications", href: "/admin/notifications", icon: Bell },
    { name: "❤️ Our Masters", href: "/admin/our-masters", icon: Heart },
  ];

  return (
    <div className="w-full h-full bg-[#F7F9FC] border-r border-[#E5E7EB] flex flex-col shrink-0">
      <div className="p-6 hidden lg:block">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#111827] rounded-lg flex items-center justify-center">
            <ShieldCheck size={18} className="text-white" />
          </div>
          <span className="font-bold text-[#111827] text-lg tracking-tight">UstoAdmin</span>
        </Link>
      </div>

      <div className="px-4 py-2 flex-1 overflow-y-auto space-y-1">
        <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider px-3 mb-2 block">
          Platform Management
        </span>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onClose && onClose()}
              className={`flex items-center gap-3 px-3 py-3 lg:py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? "bg-[#E5E7EB]/70 text-[#111827]" 
                  : "text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827]"
              }`}
            >
              <Icon size={20} className={isActive ? "text-[#111827]" : "text-[#9CA3AF]"} />
              <span className="text-base lg:text-sm">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-[#E5E7EB]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#EF4444] hover:bg-[#FEF2F2] transition-colors w-full"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </div>
  );
}
