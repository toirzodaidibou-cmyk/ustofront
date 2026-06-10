import { UserProfile, useAuthStore } from '../store/useAuthStore';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1`;

export const authService = {
  getToken(): string | null {
    return useAuthStore.getState().token;
  },

  getHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  },

  async registerMaster(data: any): Promise<UserProfile> {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        profession: data.profession || 'Усто',
        experience: data.experience || '1',
        city: data.city || 'Душанбе',
        passportPhoto: data.passportPhoto,
        avatar: data.avatar || undefined,
        selfiePhoto: data.selfiePhoto || undefined,
        address: data.address || undefined,
        instagram: data.instagram || undefined,
        telegram: data.telegram || undefined,
        whatsapp: data.whatsapp || undefined,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Registration failed');
    }

    const { user, token } = await res.json();

    // Fetch combined master details
    const mRes = await fetch(`${API_URL}/masters/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const masterDetails = mRes.ok ? await mRes.json() : {};

    const profile: UserProfile = {
      ...user,
      ...masterDetails,
      id: user._id || user.id,
    };

    useAuthStore.getState().login(profile, token);
    return profile;
  },

  async registerClient(data: { firstName: string; lastName: string; phone: string; city: string; }): Promise<UserProfile> {
    const res = await fetch(`${API_URL}/auth/register-client`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Client registration failed');
    }

    const { user, token } = await res.json();
    
    const profile: UserProfile = {
      ...user,
      id: user._id || user.id,
    };

    useAuthStore.getState().login(profile, token);
    return profile;
  },

  async login(phone: string): Promise<UserProfile> {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Login failed');
    }

    const { user, token } = await res.json();

    // Fetch master details to combine
    const mRes = await fetch(`${API_URL}/masters/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const masterDetails = mRes.ok ? await mRes.json() : {};

    const profile: UserProfile = {
      ...user,
      ...masterDetails,
      id: user._id || user.id,
    };

    useAuthStore.getState().login(profile, token);
    return profile;
  },

  async loadMe(): Promise<UserProfile | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!res.ok) {
        this.logout();
        return null;
      }

      const user = await res.json();

      let masterDetails = {};
      if (user.role === 'master') {
        const mRes = await fetch(`${API_URL}/masters/me`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (mRes.ok) {
          masterDetails = await mRes.json();
        }
      }

      const profile: UserProfile = {
        ...user,
        ...masterDetails,
        id: user._id || user.id,
      };

      useAuthStore.getState().login(profile, token);
      return profile;
    } catch {
      this.logout();
      return null;
    }
  },

  async updateProfile(userData: any, masterData: any): Promise<UserProfile> {
    const token = this.getToken();
    if (!token) throw new Error("Unauthorized");

    // 1. Update basic user details
    const userRes = await fetch(`${API_URL}/users/me`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });

    if (!userRes.ok) {
      throw new Error("Failed to update user profile");
    }

    const updatedUser = await userRes.json();

    // 2. Update master specific details
    let updatedMaster = {};
    if (updatedUser.role === 'master' && masterData) {
      const masterRes = await fetch(`${API_URL}/masters/me`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(masterData),
      });
      if (masterRes.ok) {
        updatedMaster = await masterRes.json();
      }
    }

    const profile: UserProfile = {
      ...updatedUser,
      ...updatedMaster,
      id: updatedUser._id || updatedUser.id,
    };

    useAuthStore.getState().login(profile, token);
    return profile;
  },

  async updateAvailability(isAvailable: boolean): Promise<UserProfile> {
    const token = this.getToken();
    if (!token) throw new Error("Unauthorized");

    const userRes = await fetch(`${API_URL}/users/me`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ isAvailable }),
    });

    if (!userRes.ok) {
      throw new Error("Failed to update availability");
    }

    const updatedUser = await userRes.json();
    const currentUser = useAuthStore.getState().currentUser;
    const profile: UserProfile = {
      ...(currentUser as any),
      ...updatedUser,
      id: updatedUser._id || updatedUser.id,
    };

    useAuthStore.getState().login(profile, token);
    return profile;
  },

  /* ── File Upload helpers ── */

  async uploadAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('avatar', file);

    const res = await fetch(`${API_URL}/uploads/avatar`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Avatar upload failed');
    }

    const data = await res.json();
    return data.url.startsWith('http') ? data.url : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${data.url}`;
  },

  async uploadPassport(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('passport', file);

    const res = await fetch(`${API_URL}/uploads/passport`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Passport photo upload failed');
    }

    const data = await res.json();
    return data.url.startsWith('http') ? data.url : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${data.url}`;
  },

  async uploadSelfie(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('selfie', file);

    const res = await fetch(`${API_URL}/uploads/selfie`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Selfie upload failed');
    }

    const data = await res.json();
    return data.url.startsWith('http') ? data.url : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${data.url}`;
  },

  logout() {
    useAuthStore.getState().logout();
    import('../store/useChatStore').then(module => {
      module.useChatStore.getState().clearStore();
    });
  }
};

