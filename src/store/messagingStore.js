import { create } from "zustand";
import { messagingService } from "../api/services/messagingService";
import { MESSAGE_PAGE_SIZE, SOCKET_EVENTS } from "../constants/messagingConstants";
import { socketManager } from "../utils/socketManager";

const sortMessages = (messages) => [...messages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
const updateThread = (threads, threadId, patch) => threads.map((thread) => thread.id === threadId ? { ...thread, ...patch } : thread);

export const useMessagingStore = create((set, get) => ({
  threads: [], activeThreadId: null, threadsLoading: false, threadsError: null,
  messages: [], messagesLoading: false, messagesError: null,
  pagination: { page: 1, limit: MESSAGE_PAGE_SIZE, total: 0, totalPages: 0 },
  messageInput: "", sendingMessage: false,
  typingUsers: {}, onlineUsers: {}, messageReadReceipts: {},
  approvedContacts: [], approvedContactsLoading: false, approvedContactsError: null,

  loadThreads: async (currentUserId) => {
    set({ threadsLoading: true, threadsError: null });
    try {
      const threads = await messagingService.getThreads();
      const enriched = await Promise.all(threads.map(async (thread) => {
        const participantId = thread.participant1Id === currentUserId ? thread.participant2Id : thread.participant1Id;
        try { return { ...thread, participant: await messagingService.getUserInfo(participantId) }; }
        catch { return { ...thread, participant: { id: participantId, fullName: "Conversation" } }; }
      }));
      set({ threads: enriched, threadsLoading: false });
    } catch (error) {
      set({ threadsLoading: false, threadsError: error.response?.data?.message ?? "Unable to load conversations" });
    }
  },
  setActiveThread: (threadId) => set({ activeThreadId: threadId, messages: [], pagination: { page: 1, limit: MESSAGE_PAGE_SIZE, total: 0, totalPages: 0 } }),
  loadApprovedContacts: async () => {
    set({ approvedContactsLoading: true, approvedContactsError: null });
    try {
      set({ approvedContacts: await messagingService.getApprovedContacts(), approvedContactsLoading: false });
    } catch (error) {
      set({ approvedContactsLoading: false, approvedContactsError: error.response?.data?.message ?? "Unable to load approved contacts" });
    }
  },
  startConversation: async (contact) => {
    const thread = await messagingService.createThread(contact.id);
    set((state) => {
      const existing = state.threads.find((item) => item.id === thread.id);
      return {
        threads: existing ? state.threads.map((item) => item.id === thread.id ? { ...item, ...thread, participant: contact } : item) : [{ ...thread, participant: contact }, ...state.threads],
        activeThreadId: thread.id,
        messages: [],
        pagination: { page: 1, limit: MESSAGE_PAGE_SIZE, total: 0, totalPages: 0 },
      };
    });
    return thread;
  },
  loadMessages: async (threadId, page = 1) => {
    set({ messagesLoading: true, messagesError: null });
    try {
      const result = await messagingService.getMessages(threadId, page, MESSAGE_PAGE_SIZE);
      set((state) => ({
        messages: page === 1 ? sortMessages(result.messages) : sortMessages([...result.messages, ...state.messages]),
        pagination: { page: result.page, limit: result.limit, total: result.total, totalPages: result.totalPages },
        messagesLoading: false,
      }));
    } catch (error) {
      set({ messagesLoading: false, messagesError: error.response?.data?.message ?? "Unable to load messages" });
    }
  },
  sendMessage: async (threadId, content) => {
    if (!content.trim()) return;
    set({ sendingMessage: true });
    try {
      if (socketManager.isConnected()) {
        await new Promise((resolve, reject) => socketManager.emit(SOCKET_EVENTS.SEND_MESSAGE, { threadId, content: content.trim() }, (result) => result?.success ? resolve(result) : reject(new Error("Message could not be sent"))));
      } else {
        const message = await messagingService.sendMessage(threadId, content.trim());
        get().handleNewMessage(message);
      }
      set({ messageInput: "", sendingMessage: false });
    } catch (error) {
      set({ sendingMessage: false, messagesError: error.message ?? "Message could not be sent" });
      throw error;
    }
  },
  markThreadAsRead: async (threadId) => {
    await messagingService.markThreadAsRead(threadId);
    set((state) => ({ threads: updateThread(state.threads, threadId, { unreadCount: 0 }) }));
  },
  respondToMessageRequest: async (threadId, decision) => {
    const thread = decision === "accept"
      ? await messagingService.acceptMessageRequest(threadId)
      : await messagingService.declineMessageRequest(threadId);
    set((state) => ({
      threads: decision === "accept"
        ? updateThread(state.threads, threadId, { ...thread, status: "active" })
        : state.threads.filter((item) => item.id !== threadId),
      activeThreadId: decision === "decline" && state.activeThreadId === threadId ? null : state.activeThreadId,
      messages: decision === "decline" && state.activeThreadId === threadId ? [] : state.messages,
    }));
  },
  handleNewMessage: (message, currentUserId) => set((state) => {
    const exists = state.messages.some((item) => item.id === message.id);
    const isActive = state.activeThreadId === message.threadId;
    const unreadCount = message.senderId !== currentUserId && !isActive
      ? Number(state.threads.find((thread) => thread.id === message.threadId)?.unreadCount ?? 0) + 1 : 0;
    return {
      messages: isActive && !exists ? sortMessages([...state.messages, message]) : state.messages,
      threads: updateThread(state.threads, message.threadId, { lastMessage: message.content, lastMessageAt: message.createdAt, lastMessageSenderId: message.senderId, unreadCount }),
    };
  }),
  handleTypingIndicator: (threadId, userId, isTyping) => set((state) => ({ typingUsers: { ...state.typingUsers, [`${threadId}:${userId}`]: isTyping } })),
  handlePresenceUpdate: (userId, isOnline) => set((state) => ({ onlineUsers: { ...state.onlineUsers, [userId]: isOnline } })),
  handleMessageRead: (_threadId, messageId, userId, readAt) => set((state) => ({
    messageReadReceipts: { ...state.messageReadReceipts, [messageId]: { userId, readAt } },
    messages: state.messages.map((message) => message.id === messageId ? { ...message, isRead: true, readAt } : message),
  })),
  handleRequestAccepted: (threadId) => set((state) => ({ threads: updateThread(state.threads, threadId, { status: "active" }) })),
  handleRequestDeclined: (threadId) => set((state) => ({ threads: state.threads.filter((item) => item.id !== threadId) })),
  setMessageInput: (messageInput) => set({ messageInput }),
  reset: () => set({ threads: [], activeThreadId: null, messages: [], typingUsers: {}, onlineUsers: {}, messageReadReceipts: {}, approvedContacts: [] }),
}));
