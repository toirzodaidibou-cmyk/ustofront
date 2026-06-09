import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'client' | 'master' | 'admin';

export interface UserProfile {
  id: string | number;
  firstName: string;
  lastName: string;
  fullName?: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  city?: string;
  isAvailable?: boolean;
  // Master specific
  profession?: string;
  experience?: string;
  bio?: string;
  workType?: string;
  workingHours?: string;
  Instagram?: string;
  Telegram?: string;
  WhatsApp?: string;
  address?: string;
  trustScore?: number;
  completedJobs?: number;
  reviewsCount?: number;
  rating?: string;
  followers?: number;
  responseTime?: string;
  complaintsResolved?: string;
  isVerified?: boolean;
  verificationStatus?: 'pending' | 'verified' | 'rejected' | 'unverified';
  passportPhoto?: string;
  selfiePhoto?: string;
  badges?: string[];
  walletBalance?: number;
}

interface AuthState {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (user: UserProfile, token: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      isAuthenticated: false,
      token: null,

      login: (user, token) => {
        const fullName = user.fullName || `${user.firstName} ${user.lastName}`;
        const updatedUser = { ...user, fullName };
        set({ currentUser: updatedUser, isAuthenticated: true, token });
        if (typeof window !== 'undefined') {
          localStorage.setItem('ustotj-current-user', JSON.stringify(updatedUser));
        }
      },
      
      logout: () => {
        set({ currentUser: null, isAuthenticated: false, token: null });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('ustotj-current-user');
        }
      },
      
      updateProfile: (data) => set((state) => {
        if (!state.currentUser) return { currentUser: null };
        const updated = { ...state.currentUser, ...data };
        if (data.firstName || data.lastName) {
          updated.fullName = `${data.firstName || state.currentUser.firstName} ${data.lastName || state.currentUser.lastName}`;
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('ustotj-current-user', JSON.stringify(updated));
        }
        return { currentUser: updated };
      }),
    }),
    {
      name: 'ustotj-auth-storage',
    }
  )
);
