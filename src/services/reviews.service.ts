import { useAuthStore } from '../store/useAuthStore';

const API_BASE = "http://localhost:5000";

export interface ReviewData {
  id: string;
  _id: string;
  client: string;
  master: string;
  rating: number;
  comment: string;
  date: string;
  createdAt: string;
  clientUser?: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    avatar: string;
  };
}

export const reviewsApi = {
  async createReview(dto: { master: string; rating: number; comment: string }): Promise<ReviewData | null> {
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(`${API_BASE}/api/v1/reviews`, {
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
      console.error('[ReviewsAPI] Failed to create review:', err);
      return null;
    }
  },

  async getMasterReviews(masterId: string): Promise<ReviewData[]> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/reviews/master/${masterId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('[ReviewsAPI] Failed to get master reviews:', err);
      return [];
    }
  },
};
