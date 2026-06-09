'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function ChatEmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full">
      <div className="w-20 h-20 bg-[#25D366]/5 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-[#25D366]/20">
        <MessageCircle className="w-10 h-10 text-[#25D366]" />
      </div>
      <h2 className="text-[20px] font-bold text-[#1a1a1a] tracking-tight">
        Сӯҳбатро интихоб кунед
      </h2>
      <p className="text-[14px] text-[#8c8c8c] max-w-[260px] mt-2 leading-relaxed">
        Барои оғоз кардани гуфтугӯ аз рӯйхати тарафи чап як шахсро интихоб намоед ё ба профили усто ворид шавед.
      </p>
    </div>
  );
}
