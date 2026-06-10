const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");

export interface MasterPhotoData {
  _id: string;
  masterId: string;
  url: string;
  createdAt: string;
}

export interface MasterProfileData {
  id: string;
  _id?: string;
  fullName: string;
  profession: string;
  category: 'electrician' | 'mechanic' | 'plumber' | 'ac' | 'builder' | 'furniture';
  city: string;
  address: string;
  phone: string;
  avatar: string;
  experience: string;
  rating: string;
  trustScore: number;
  completedJobs: number;
  status: 'available' | 'busy' | 'offline';
  isVerified: boolean;
  skills: string[];
  priceFrom: string;
  passportPhoto?: string;
  selfiePhoto?: string;
  verificationStatus?: string;
}

// Beautiful mock master data to populate discovery page if database is empty

export const mastersApi = {
  /**
   * Get all registered master profiles combined with user details
   */
  async getAllMasters(category?: string): Promise<MasterProfileData[]> {
    try {
      const url = category ? `${API_BASE}/api/v1/masters?category=${category}` : `${API_BASE}/api/v1/masters`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      
      // Combine backend master data with beautiful categories
      const formatted = data.map((m: any) => ({
        id: String(m.id || m._id || m.userId),
        fullName: m.fullName || m.name || 'Устои Санҷидашуда',
        profession: m.profession || 'Усто',
        category: (m.profession?.toLowerCase().includes('электрик') ? 'electrician' :
                   m.profession?.toLowerCase().includes('механик') || m.profession?.toLowerCase().includes('мошин') ? 'mechanic' :
                   m.profession?.toLowerCase().includes('сантехник') ? 'plumber' :
                   m.profession?.toLowerCase().includes('кондиционер') || m.profession?.toLowerCase().includes('яхдон') ? 'ac' :
                   m.profession?.toLowerCase().includes('сохтмон') || m.profession?.toLowerCase().includes('бинокор') ? 'builder' :
                   m.profession?.toLowerCase().includes('мебел') || m.profession?.toLowerCase().includes('дуредгар') ? 'furniture' : 'electrician') as any,
        city: m.city || 'Душанбе',
        address: m.address || 'ш. Душанбе',
        phone: m.phone || '+992 900 00 0000',
        avatar: m.avatar || `https://api.dicebear.com/9.x/notionists/svg?seed=${m.id}`,
        experience: m.experience || '1 сол',
        rating: m.rating || '5.0',
        trustScore: m.trustScore || 98,
        completedJobs: m.completedJobs || 24,
        status: m.status || 'available',
        isVerified: m.isVerified ?? true,
        skills: m.skills || ['Таъмири касбӣ'],
        priceFrom: m.priceRange || 'Аз 50 TJS',
        passportPhoto: m.passportPhoto,
        selfiePhoto: m.selfiePhoto,
        verificationStatus: m.verificationStatus,
      }));

      return formatted;
    } catch (err) {
      console.error("[MastersAPI] Failed to fetch master profiles:", err);
      return [];
    }
  },

  /**
   * Get specific master profile details by ID (Master ID or User ID)
   */
  async getMasterById(id: string): Promise<MasterProfileData | null> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/masters/${id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const m = await res.json();
      return {
        id: String(m.id || m._id || m.userId),
        fullName: m.fullName || m.name || 'Устои Санҷидашуда',
        profession: m.profession || 'Усто',
        category: (m.profession?.toLowerCase().includes('электрик') ? 'electrician' :
                   m.profession?.toLowerCase().includes('механик') || m.profession?.toLowerCase().includes('мошин') ? 'mechanic' :
                   m.profession?.toLowerCase().includes('сантехник') ? 'plumber' :
                   m.profession?.toLowerCase().includes('кондиционер') || m.profession?.toLowerCase().includes('яхдон') ? 'ac' :
                   m.profession?.toLowerCase().includes('сохтмон') || m.profession?.toLowerCase().includes('бинокор') ? 'builder' :
                   m.profession?.toLowerCase().includes('мебел') || m.profession?.toLowerCase().includes('дуредгар') ? 'furniture' : 'electrician') as any,
        city: m.city || 'Душанбе',
        address: m.address || 'ш. Душанбе',
        phone: m.phone || '+992 900 00 0000',
        avatar: m.avatar || `https://api.dicebear.com/9.x/notionists/svg?seed=${m.id}`,
        experience: m.experience || '1 сол',
        rating: m.rating || '5.0',
        trustScore: m.trustScore || 98,
        completedJobs: m.completedJobs || 24,
        status: m.status || 'available',
        isVerified: m.isVerified ?? true,
        skills: m.skills || ['Таъмири касбӣ'],
        priceFrom: m.priceRange || 'Аз 50 TJS',
        passportPhoto: m.passportPhoto,
        selfiePhoto: m.selfiePhoto,
        verificationStatus: m.verificationStatus,
      };
    } catch (err) {
      console.error("[MastersAPI] Failed to fetch master profile by ID:", err);
      return null;
    }
  },

  /**
   * Search masters by query text and filter properties
   */
  async searchMasters(filters: { query?: string; category?: string; city?: string; verifiedOnly?: boolean }): Promise<MasterProfileData[]> {
    const all = await this.getAllMasters();
    return all.filter(m => {
      if (filters.category && m.category !== filters.category) return false;
      if (filters.city && m.city.toLowerCase() !== filters.city.toLowerCase()) return false;
      if (filters.verifiedOnly && !m.isVerified) return false;
      if (filters.query) {
        const q = filters.query.toLowerCase();
        const matchName = m.fullName.toLowerCase().includes(q);
        const matchProfession = m.profession.toLowerCase().includes(q);
        const matchSkills = m.skills.some(s => s.toLowerCase().includes(q));
        if (!matchName && !matchProfession && !matchSkills) return false;
      }
      return true;
    });
  },

  /**
   * Get portfolio photos for a master
   */
  async getPhotos(masterId: string): Promise<MasterPhotoData[]> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/masters/${masterId}/photos`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("[MastersAPI] Failed to fetch portfolio photos:", err);
      return [];
    }
  },

  /**
   * Upload a photo to master's portfolio
   */
  async uploadPhoto(masterId: string, file: File): Promise<MasterPhotoData | null> {
    try {
      const formData = new FormData();
      formData.append("photo", file);

      const res = await fetch(`${API_BASE}/api/v1/masters/${masterId}/photos/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("[MastersAPI] Failed to upload portfolio photo:", err);
      return null;
    }
  },

  /**
   * Delete a portfolio photo
   */
  async deletePhoto(masterId: string, photoId: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/masters/${masterId}/photos/${photoId}`, {
        method: "DELETE",
      });
      return res.ok;
    } catch (err) {
      console.error("[MastersAPI] Failed to delete portfolio photo:", err);
      return false;
    }
  },

  /**
   * Get full photo URL helper
   */
  getPhotoUrl(url: string): string {
    if (url.startsWith("http")) return url;
    return `${API_BASE}${url}`;
  },
};
