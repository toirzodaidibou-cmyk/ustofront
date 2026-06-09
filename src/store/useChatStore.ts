import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { chatApi, ChatContact, MessageData } from '@/services/chat.service';
import { io, Socket } from 'socket.io-client';

interface ChatState {
  contacts: ChatContact[];
  messages: Record<string, MessageData[]>; // key: userId, value: messages
  activeUserId: string | null;
  searchQuery: string;
  socket: Socket | null;
  isSocketConnected: boolean;
  typingUsers: Record<string, boolean>;

  // Actions
  setSearchQuery: (query: string) => void;
  setActiveUser: (userId: string | null) => void;
  initSocket: (currentUserId: string) => void;
  disconnectSocket: () => void;
  loadContacts: (currentUserId: string) => Promise<void>;
  loadHistory: (currentUserId: string, targetUserId: string) => Promise<void>;
  sendMessage: (currentUserId: string, targetUserId: string, text: string, imageUrl?: string, type?: string, invoiceAmount?: number) => void;
  toggleReaction: (messageId: string, currentUserId: string, targetUserId: string, emoji: string) => void;
  setTyping: (currentUserId: string, targetUserId: string, isTyping: boolean) => void;
  addLocalContact: (contact: ChatContact) => void;
  
  // Local/Mock Fallbacks
  clearStore: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      contacts: [],
      messages: {},
      activeUserId: null,
      searchQuery: '',
      socket: null,
      isSocketConnected: false,
      typingUsers: {},

      setSearchQuery: (query) => set({ searchQuery: query }),
      
      setActiveUser: (userId) => set({ activeUserId: userId }),

      addLocalContact: (contact) => {
        const { contacts } = get();
        if (!contacts.find(c => c.userId === contact.userId)) {
          set({ contacts: [contact, ...contacts] });
        }
      },

      initSocket: (currentUserId: string) => {
        const existingSocket = get().socket;
        if (existingSocket) return;

        const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');
        
        socket.on('connect', () => {
          set({ isSocketConnected: true });
          socket.emit('join', currentUserId);
          
          // Request browser notification permission if not already granted/denied
          if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'default') {
              Notification.requestPermission();
            }
          }
        });

        socket.on('disconnect', () => {
          set({ isSocketConnected: false });
        });

        socket.on('newMessage', (message: MessageData) => {
          const { activeUserId, messages, contacts } = get();
          
          // Determine the other user in the conversation
          const otherUserId = message.senderId === currentUserId ? message.receiverId : message.senderId;
          
          // Add message to state
          const conversationHistory = messages[otherUserId] || [];
          
          // Remove temporary optimistic messages with the same text to avoid duplication
          const filteredHistory = conversationHistory.filter(m => !(m.messageText === message.messageText && String(m._id).length < 20));
          
          set({
            messages: {
              ...messages,
              [otherUserId]: [...filteredHistory, message]
            }
          });

          // Mark as read if it's the active chat
          if (activeUserId === otherUserId && message.senderId === otherUserId) {
            chatApi.markAsRead(otherUserId, currentUserId);
          } else if (message.senderId !== currentUserId) {
            // Play sound and show push notification if it's a new incoming message
            try {
              // Play a soft notification sound (using a public URL for demo, can be replaced with local file)
              const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
              audio.volume = 0.5;
              audio.play().catch(e => console.log('Audio play failed:', e));
              
              if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
                const text = message.messageText.startsWith('[INVOICE') ? '🧾 Инвойси нав омад' : message.messageText;
                new Notification('UstoTJ: Паёми нав', {
                  body: text.length > 50 ? text.substring(0, 50) + '...' : text,
                  icon: '/favicon.ico'
                });
              }
            } catch (e) {
              console.error('Notification error:', e);
            }
          }

          // Refresh contacts to update last message & unread counts
          get().loadContacts(currentUserId);
        });

        socket.on('userTyping', (data: { senderId: string; isTyping: boolean }) => {
          const { typingUsers } = get();
          set({
            typingUsers: { ...typingUsers, [data.senderId]: data.isTyping }
          });
        });

        socket.on('reactionUpdated', (updatedMessage: MessageData) => {
          const { messages, activeUserId } = get();
          const otherUserId = updatedMessage.senderId === currentUserId ? updatedMessage.receiverId : updatedMessage.senderId;
          const conversationHistory = messages[otherUserId] || [];
          
          const updatedHistory = conversationHistory.map(msg => 
            msg._id === updatedMessage._id ? updatedMessage : msg
          );
          
          set({
            messages: {
              ...messages,
              [otherUserId]: updatedHistory
            }
          });
        });

        set({ socket });
      },

      disconnectSocket: () => {
        const { socket } = get();
        if (socket) {
          socket.disconnect();
          set({ socket: null, isSocketConnected: false });
        }
      },

      loadContacts: async (currentUserId: string) => {
        try {
          const list = await chatApi.getChatList(currentUserId);
          set({ contacts: list });
        } catch (error) {
          console.error("Error loading contacts:", error);
        }
      },

      loadHistory: async (currentUserId: string, targetUserId: string) => {
        try {
          const history = await chatApi.getHistory(currentUserId, targetUserId);
          const { messages } = get();
          set({
            messages: {
              ...messages,
              [targetUserId]: history
            }
          });
          await chatApi.markAsRead(targetUserId, currentUserId);
          get().loadContacts(currentUserId);
        } catch (error) {
          console.error("Error loading history:", error);
        }
      },

      sendMessage: (currentUserId: string, targetUserId: string, text: string, imageUrl?: string, type: string = 'text', invoiceAmount?: number) => {
        const { socket, messages } = get();
        
        // Optimistic local update
        const tempMsg: MessageData = {
          _id: Date.now().toString(),
          senderId: currentUserId,
          receiverId: targetUserId,
          messageText: text,
          imageUrl: imageUrl,
          type: type,
          invoiceAmount: invoiceAmount,
          invoiceStatus: type === 'invoice' ? 'unpaid' : undefined,
          read: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const currentHistory = messages[targetUserId] || [];
        set({
          messages: {
            ...messages,
            [targetUserId]: [...currentHistory, tempMsg]
          }
        });

        // Send to backend via socket
        if (socket) {
          socket.emit('sendMessage', {
            senderId: currentUserId,
            receiverId: targetUserId,
            messageText: text,
            imageUrl: imageUrl,
            type: type,
            invoiceAmount: invoiceAmount
          });
        }
      },

      toggleReaction: (messageId: string, currentUserId: string, targetUserId: string, emoji: string) => {
        const { socket, messages } = get();
        
        // Optimistic local update
        const currentHistory = messages[targetUserId] || [];
        const msgIndex = currentHistory.findIndex(m => m._id === messageId);
        if (msgIndex >= 0) {
          const msg = { ...currentHistory[msgIndex] };
          const reactions = msg.reactions ? [...msg.reactions] : [];
          const existingIdx = reactions.findIndex(r => r.userId === currentUserId && r.emoji === emoji);
          
          if (existingIdx >= 0) {
            reactions.splice(existingIdx, 1);
          } else {
            reactions.push({ userId: currentUserId, emoji });
          }
          
          msg.reactions = reactions;
          const updatedHistory = [...currentHistory];
          updatedHistory[msgIndex] = msg;
          
          set({
            messages: {
              ...messages,
              [targetUserId]: updatedHistory
            }
          });
        }

        if (socket) {
          socket.emit('toggleReaction', {
            messageId,
            userId: currentUserId,
            emoji,
            receiverId: targetUserId
          });
        }
      },

      setTyping: (currentUserId: string, targetUserId: string, isTyping: boolean) => {
        const { socket } = get();
        if (socket) {
          socket.emit('typing', {
            senderId: currentUserId,
            receiverId: targetUserId,
            isTyping
          });
        }
      },

      clearStore: () => {
        const { socket } = get();
        if (socket) socket.disconnect();
        set({ contacts: [], messages: {}, activeUserId: null, socket: null, isSocketConnected: false });
      }
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({ contacts: state.contacts, messages: state.messages }), // only persist contacts and messages
    }
  )
);
