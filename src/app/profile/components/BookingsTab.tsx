import React from 'react';
import { Phone, Briefcase, Calendar, Clock, AlertTriangle, CheckCircle2, BadgeCheck, Loader2 } from 'lucide-react';
import { BookingData } from '@/services/bookings.service';
import { UserProfile } from '@/store/useAuthStore';

interface BookingsTabProps {
  bookings: BookingData[];
  loadingBookings: boolean;
  currentUser: UserProfile;
  handleUpdateStatus: (id: string, status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled') => void;
  renderAvatar: (avatarUrl: string | null | undefined, name: string, sizeClass?: string) => React.ReactNode;
}

export function BookingsTab({ bookings, loadingBookings, currentUser, handleUpdateStatus, renderAvatar }: BookingsTabProps) {
  return (
    <div className="bg-white rounded-[2rem] border border-black/5 p-6 sm:p-8 space-y-6">
      <h2 className="text-xl font-bold text-[#1a1a1a]">
        {currentUser.role === 'master' ? 'Дархостҳои бандкунӣ барои шумо' : 'Таърихи бандкуниҳои шумо'}
      </h2>
      {loadingBookings ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="animate-spin text-orange-500" size={30} />
        </div>
      ) : bookings.length === 0 ? (
        <div className="p-12 text-center text-gray-500 text-sm font-semibold">
          Шумо то ҳол ягон бандкунӣ надоред.
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isMaster = currentUser.role === 'master';
            const targetUser = isMaster ? booking.clientUser : booking.masterUser;
            return (
              <div key={booking._id || booking.id} className="p-5 sm:p-6 rounded-3xl border border-black/5 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-6">
                
                {/* Top: Avatar & User Info */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    {renderAvatar(targetUser?.avatar, targetUser?.fullName || (isMaster ? 'Мизоҷ' : 'Усто'), 'w-14 h-14 rounded-2xl')}
                    <div>
                      <h4 className="font-extrabold text-[#1a1a1a] text-base leading-none">
                        {targetUser?.fullName || (isMaster ? 'Мизоҷи UstoTJ' : 'Устои Санҷидашуда')}
                      </h4>
                      <p className="text-xs text-orange-600 font-bold mt-1.5 flex items-center gap-1">
                        {isMaster ? <Phone size={12} /> : <Briefcase size={12} />}
                        {isMaster ? `${targetUser?.phone || 'Рақами махфӣ'}` : (targetUser as any)?.profession || 'Усто'}
                      </p>
                      <div className="flex items-center gap-2 mt-2.5 text-[11px] font-bold">
                        <span className="bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <Calendar size={12} className="text-orange-500" /> {booking.date}
                        </span>
                        <span className="bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <Clock size={12} className="text-orange-500" /> {booking.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    {/* Master actions */}
                    {isMaster && booking.status === 'pending' && (
                      <>
                        <button onClick={() => handleUpdateStatus(booking._id || booking.id, 'accepted')} className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-green-500/20 cursor-pointer">
                          Қабул кардан
                        </button>
                        <button onClick={() => handleUpdateStatus(booking._id || booking.id, 'rejected')} className="bg-zinc-100 hover:bg-red-50 hover:text-red-600 text-zinc-600 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer">
                          Рад кардан
                        </button>
                      </>
                    )}
                    {isMaster && booking.status === 'accepted' && (
                      <button onClick={() => handleUpdateStatus(booking._id || booking.id, 'completed')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer">
                        Кори анҷомёфта
                      </button>
                    )}
                    
                    {/* Client actions */}
                    {!isMaster && booking.status === 'pending' && (
                      <button onClick={() => handleUpdateStatus(booking._id || booking.id, 'cancelled')} className="bg-red-50 hover:bg-red-500 text-red-600 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer">
                        Бекор кардан
                      </button>
                    )}
                  </div>
                </div>

                {/* Middle: Notes */}
                {booking.notes && (
                  <div className="bg-orange-50/50 border border-orange-500/10 p-3 rounded-xl">
                    <p className="text-xs text-orange-800 font-medium italic flex gap-2">
                      <AlertTriangle size={14} className="text-orange-500 shrink-0 mt-0.5" />
                      "{booking.notes}"
                    </p>
                  </div>
                )}

                {/* Bottom: Interactive Status Tracker */}
                <div className="pt-2">
                  <div className="relative">
                    {/* Background Line */}
                    <div className="absolute top-3 left-0 w-full h-1 bg-zinc-100 rounded-full"></div>
                    
                    {/* Active Line */}
                    <div 
                      className={`absolute top-3 left-0 h-1 rounded-full transition-all duration-700 ${
                        (booking.status === 'rejected' || booking.status === 'cancelled') ? 'bg-red-500 w-full' :
                        booking.status === 'completed' ? 'bg-green-500 w-full' :
                        booking.status === 'accepted' ? 'bg-orange-500 w-[50%]' :
                        'bg-orange-500 w-[15%]'
                      }`}
                    ></div>

                    <div className="flex justify-between relative z-10">
                      {/* Step 1: Pending / Cancelled / Rejected */}
                      <div className="flex flex-col items-center gap-1.5 w-1/3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs transition-colors duration-500 border-4 border-white ${
                          (booking.status === 'rejected' || booking.status === 'cancelled') ? 'bg-red-500' : 'bg-orange-500'
                        }`}>
                          <Clock size={12} />
                        </div>
                        <span className={`text-[10px] sm:text-xs font-bold text-center ${(booking.status === 'rejected' || booking.status === 'cancelled') ? 'text-red-500' : 'text-orange-600'}`}>
                          {booking.status === 'rejected' ? 'Рад шуд' : booking.status === 'cancelled' ? 'Бекор шуд' : 'Дархост рафт'}
                        </span>
                      </div>

                      {/* Step 2: Accepted */}
                      <div className="flex flex-col items-center gap-1.5 w-1/3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs transition-colors duration-500 border-4 border-white ${
                          booking.status === 'completed' || booking.status === 'accepted' ? 'bg-orange-500' : 'bg-zinc-200 text-zinc-400'
                        }`}>
                          <CheckCircle2 size={12} />
                        </div>
                        <span className={`text-[10px] sm:text-xs font-bold text-center ${booking.status === 'completed' || booking.status === 'accepted' ? 'text-orange-600' : 'text-zinc-400'}`}>
                          Қабул шуд
                        </span>
                      </div>

                      {/* Step 3: Completed */}
                      <div className="flex flex-col items-center gap-1.5 w-1/3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs transition-colors duration-500 border-4 border-white ${
                          booking.status === 'completed' ? 'bg-green-500' : 'bg-zinc-200 text-zinc-400'
                        }`}>
                          <BadgeCheck size={12} />
                        </div>
                        <span className={`text-[10px] sm:text-xs font-bold text-center ${booking.status === 'completed' ? 'text-green-600' : 'text-zinc-400'}`}>
                          Анҷом ёфт
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
