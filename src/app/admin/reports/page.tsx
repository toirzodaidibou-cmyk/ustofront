"use client";

import React from "react";
import { AlertTriangle, Clock } from "lucide-react";

export default function RiskCenterPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Risk Center</h1>
          <p className="text-sm text-[#6B7280] mt-1">Manage user reports and platform complaints.</p>
        </div>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-16 text-center shadow-sm">
        <AlertTriangle size={48} className="mx-auto text-orange-400 mb-4" />
        <h3 className="text-lg font-bold text-[#111827]">Coming Soon</h3>
        <p className="text-sm text-[#6B7280] mt-2 max-w-md mx-auto">
          The Risk Center is currently under development. Soon you'll be able to review complaints, issue warnings, and monitor suspicious activities.
        </p>
        <div className="mt-6 flex justify-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold border border-gray-200">
            <Clock size={16} /> In Progress
          </span>
        </div>
      </div>
    </div>
  );
}
