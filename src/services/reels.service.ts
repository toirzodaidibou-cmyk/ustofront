const API_BASE = "http://localhost:5000";

export interface ReelData {
  _id?: string;
  id?: string | number;
  videoUrl: string;
  title: string;
  description: string;
  likes: number | string;
  comments: number | string;
  shares: number | string;
  master: {
    id: string | number;
    name: string;
    profession: string;
    city: string;
    isVerified: boolean;
    trustScore: number;
    avatar: string;
  };
  createdAt?: string;
}

export const reelsApi = {
  /**
   * Fetch all reels from the backend
   */
  async getAll(): Promise<ReelData[]> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/reels`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("[ReelsAPI] Failed to fetch reels:", err);
      return [];
    }
  },

  /**
   * Create a new reel with a video URL (no file upload)
   */
  async create(reel: {
    videoUrl: string;
    title: string;
    description?: string;
    master: ReelData["master"];
  }): Promise<ReelData | null> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/reels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reel),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("[ReelsAPI] Failed to create reel:", err);
      return null;
    }
  },

  /**
   * Upload a video file and create a reel
   */
  async uploadAndCreate(
    file: File,
    title: string,
    description: string,
    master: ReelData["master"]
  ): Promise<ReelData | null> {
    try {
      const formData = new FormData();
      formData.append("video", file);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("master", JSON.stringify(master));

      const res = await fetch(`${API_BASE}/api/v1/reels/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("[ReelsAPI] Failed to upload reel:", err);
      return null;
    }
  },

  /**
   * Like a reel
   */
  async like(id: string): Promise<ReelData | null> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/reels/${id}/like`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("[ReelsAPI] Failed to like reel:", err);
      return null;
    }
  },

  /**
   * Unlike a reel
   */
  async unlike(id: string): Promise<ReelData | null> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/reels/${id}/unlike`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("[ReelsAPI] Failed to unlike reel:", err);
      return null;
    }
  },

  /**
   * Get comments for a reel
   */
  async getComments(id: string): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/reels/${id}/comments`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("[ReelsAPI] Failed to fetch comments:", err);
      return [];
    }
  },

  /**
   * Add a comment to a reel
   */
  async addComment(id: string, name: string, avatar: string, text: string): Promise<any | null> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/reels/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, avatar, text }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("[ReelsAPI] Failed to add comment:", err);
      return null;
    }
  },

  /**
   * Delete a reel
   */
  async delete(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/reels/${id}`, {
        method: "DELETE",
      });
      return res.ok;
    } catch (err) {
      console.error("[ReelsAPI] Failed to delete reel:", err);
      return false;
    }
  },

  /**
   * Get the full video URL (handles relative paths from backend)
   */
  getVideoUrl(videoUrl: string): string {
    if (videoUrl.startsWith("http")) return videoUrl;
    return `${API_BASE}${videoUrl}`;
  },
};
