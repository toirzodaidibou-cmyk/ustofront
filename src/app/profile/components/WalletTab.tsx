import React from 'react';
import { ShieldCheck, Plus, CreditCard, Clock, FileCheck, ArrowUpRight, ArrowDownToLine } from 'lucide-react';

interface WalletTabProps {
  walletBalance: number;
  walletTransactions: any[];
  role?: 'client' | 'master';
}

export function WalletTab({ walletBalance, walletTransactions, role = 'client' }: WalletTabProps) {
  return (
    <div className="bg-white rounded-[2rem] border border-black/5 p-6 sm:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1a1a1a] flex items-center gap-2">
            <ShieldCheck className="text-green-500" /> 
            {role === 'client' ? 'Ҳамёни Шахсӣ ва Escrow' : 'Даромад ва Ҳамёни Escrow'}
          </h2>
          <p className="text-sm text-gray-500 font-medium mt-1">
            {role === 'client' 
              ? 'Идоракунии маблағҳо ва пардохтҳои бехатар барои хизматрасониҳо'
              : 'Идоракунии даромад ва гирифтани маблағ барои корҳои анҷомёфта'}
          </p>
        </div>
        
        {role === 'client' ? (
          <button 
            onClick={() => alert("Системаи пардохтҳои бонкӣ ба наздикӣ пайваст карда мешавад.")}
            className="bg-[#1a1a1a] hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
          >
            <Plus size={16} /> Пур кардани ҳамён
          </button>
        ) : (
          <button 
            onClick={() => alert("Интиқоли маблағ ба корт ба наздикӣ дастрас мешавад.")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center shadow-orange-500/20"
          >
            <ArrowDownToLine size={16} /> Баровардани маблағ
          </button>
        )}
      </div>

      {/* Balance Card Premium */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-black rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden border border-white/10">
        {/* Glowing Escrow Orb */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="absolute -top-10 -right-10 opacity-10 transform rotate-12">
          <ShieldCheck size={200} />
        </div>
        
        <div className="relative z-10 flex flex-col justify-between h-full min-h-[140px]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-zinc-400 font-bold mb-1 uppercase tracking-widest text-[10px] flex items-center gap-2">
                <CreditCard size={14} /> {role === 'client' ? 'Бақияи дастрас' : 'Даромади дастрас барои гирифтан'}
              </p>
              <h3 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                {walletBalance.toFixed(2)} <span className="text-2xl font-bold text-zinc-500">TJS</span>
              </h3>
            </div>
            <div className="bg-white/10 glass px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs font-bold text-emerald-400">Escrow Фаъол</span>
            </div>
          </div>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2.5 bg-emerald-500/20 w-fit px-4 py-2.5 rounded-xl border border-emerald-500/30 backdrop-blur-md">
              <ShieldCheck size={18} className="text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-100">
                {role === 'client' 
                  ? 'Пул то тасдиқи мизоҷ бехатар нигоҳ дошта мешавад'
                  : 'Пас аз тасдиқи мизоҷ, маблағ ба тавозуни шумо мегузарад'
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#1a1a1a] mb-2 flex items-center gap-2">
          <Clock size={18} className="text-orange-500" /> Таърихи транзаксияҳо
        </h3>
        {walletTransactions.length === 0 ? (
          <div className="p-12 border border-black/5 rounded-3xl bg-[#FAFAF9] text-center">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-black/5 flex items-center justify-center mx-auto mb-4">
              <FileCheck size={28} className="text-gray-300" />
            </div>
            <p className="text-sm font-bold text-[#1a1a1a]">Ҳоло ягон транзаксия вуҷуд надорад</p>
            <p className="text-xs font-medium text-gray-500 mt-1 max-w-sm mx-auto">
              {role === 'client' 
                ? 'Ҳамаи пуркуниҳои ҳамён ва пардохтҳои шумо барои устоҳо дар ҳамин ҷо сабт мешаванд.'
                : 'Ҳамаи пардохтҳои қабулкардаи шумо ва хуруҷи маблағҳо дар ҳамин ҷо сабт мешаванд.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {walletTransactions.map((tx, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 border border-black/5 rounded-2xl hover:bg-gray-50 transition-colors bg-white">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'deposit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {tx.type === 'deposit' ? <Plus size={16} /> : <ArrowUpRight size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1a1a1a]">{tx.title}</p>
                    <p className="text-xs font-medium text-gray-500">{tx.date}</p>
                  </div>
                </div>
                <div className={`text-sm font-bold ${tx.type === 'deposit' ? 'text-green-600' : 'text-[#1a1a1a]'}`}>
                  {tx.type === 'deposit' ? '+' : '-'}{tx.amount} TJS
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
