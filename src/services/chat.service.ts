const API_BASE = "http://localhost:5000";

export interface MessageData {
  _id: string;
  senderId: string;
  receiverId: string;
  messageText: string;
  imageUrl?: string; // newly added
  read: boolean;
  createdAt: string;
  updatedAt: string;
  reactions?: { emoji: string; userId: string }[];
  type?: string;
  invoiceAmount?: number;
  invoiceStatus?: string;
}

export interface ChatContact {
  userId: string;
  fullName: string;
  avatar: string;
  role: 'client' | 'master' | 'admin';
  city: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

export const chatApi = {
  async getChatList(userId: string): Promise<ChatContact[]> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/chat/list/${userId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("[ChatAPI] Failed to fetch chat list:", err);
      return [];
    }
  },

  async getHistory(userId1: string, userId2: string): Promise<MessageData[]> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/chat/history/${userId1}/${userId2}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("[ChatAPI] Failed to fetch conversation history:", err);
      return [];
    }
  },

  async markAsRead(senderId: string, receiverId: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/chat/read/${senderId}/${receiverId}`, {
        method: 'POST',
      });
      return res.ok;
    } catch (err) {
      console.error("[ChatAPI] Failed to mark messages as read:", err);
      return false;
    }
  },

  async uploadChatImage(file: File): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`${API_BASE}/api/v1/uploads/chat-image`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.url;
    } catch (err) {
      console.error("[ChatAPI] Failed to upload chat image:", err);
      return null;
    }
  }
};
