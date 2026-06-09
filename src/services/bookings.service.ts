import { useAuthStore } from '../store/useAuthStore';

const API_BASE = "http://localhost:5000";

export interface BookingData {
  id: string;
  _id: string;
  client: string;
  master: string;
  date: string;
  time: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  notes: string;
  createdAt: string;
  masterUser?: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    phone: string;
    avatar: string;
  };
  clientUser?: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    phone: string;
    avatar: string;
  };
}

export const bookingsApi = {
  async createBooking(dto: { master: string; date: string; time: string; notes?: string }): Promise<BookingData | null> {
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(`${API_BASE}/api/v1/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dto),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('[BookingsAPI] Failed to create booking:', err);
      return null;
    }
  },

  async getClientBookings(): Promise<BookingData[]> {
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(`${API_BASE}/api/v1/bookings/client`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('[BookingsAPI] Failed to get client bookings:', err);
      return [];
    }
  },

  async getMasterBookings(): Promise<BookingData[]> {
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(`${API_BASE}/api/v1/bookings/master`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('[BookingsAPI] Failed to get master bookings:', err);
      return [];
    }
  },

  async updateBookingStatus(id: string, status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled'): Promise<BookingData | null> {
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(`${API_BASE}/api/v1/bookings/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('[BookingsAPI] Failed to update booking status:', err);
      return null;
    }
  },
};
