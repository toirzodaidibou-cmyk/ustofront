import { useAuthStore } from '../store/useAuthStore';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");

export const communityApi = {
  async getAllPosts() {
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(`${API_BASE}/api/v1/community`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("[CommunityAPI] Failed to fetch posts:", err);
      return [];
    }
  },

  async createPost(content: string) {
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(`${API_BASE}/api/v1/community`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });
      return res.ok;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  async likePost(id: string) {
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(`${API_BASE}/api/v1/community/${id}/like`, {
        method: "POST",
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return res.ok;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  async addComment(id: string, text: string) {
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(`${API_BASE}/api/v1/community/${id}/comment`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      });
      return res.ok;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
};
