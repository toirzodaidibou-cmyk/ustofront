const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");
import { useAuthStore } from "@/store/useAuthStore";

export const adminApi = {
  async getStats() {
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/stats`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("[AdminAPI] Failed to fetch stats:", err);
      return null;
    }
  },

  async getAllUsers() {
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/users`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("[AdminAPI] Failed to fetch users:", err);
      return [];
    }
  },

  async updateUserRole(id: string, role: string) {
    const token = useAuthStore.getState().token;
    const res = await fetch(`${API_BASE}/api/v1/admin/users/${id}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ role })
    });
    return res.ok;
  },

  async updateUserBadges(id: string, badges: string[]) {
    const token = useAuthStore.getState().token;
    const res = await fetch(`${API_BASE}/api/v1/admin/users/${id}/badges`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ badges })
    });
    return res.ok;
  },

  async updateUserStatus(id: string, status: string) {
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/users/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      return res.ok;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  async deleteUser(id: string) {
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/users/${id}`, {
        method: "DELETE"
      });
      return res.ok;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
};
