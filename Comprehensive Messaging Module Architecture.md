# Comprehensive Messaging Module Architecture & Implementation Plan
## WITH "Any Match/Interaction + Search Directory" Strategy for Approved Contacts

**Version**: 2.0  
**Date**: August 18, 2026  
**Strategy**: Hybrid Approved Contacts (Tier 1: Recent Interactions + Tier 2: Search Directory)  
**Status**: Ready for Implementation

---

## Executive Summary

This plan provides a **complete end-to-end architecture** for integrating the backend messaging REST API and Socket.IO real-time features into the Linkprosoft frontend. It implements a **two-tier contact system**:

- **Tier 1 - "Approved" Contacts**: People from accepted applications, completed projects, hired professionals
- **Tier 2 - Search Directory**: Browse & message any professional/employer in the system via search
- **Message Requests**: First messages from non-approved contacts go to a "Requests" inbox for safety

This balances **platform growth** (anyone can reach anyone) with **safety** (users control their inbox).

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Approved Contacts Strategy](#2-approved-contacts-strategy-hybrid-two-tier)
3. [State Management](#3-state-management-zustand)
4. [Files to Create](#4-files-to-create)
5. [Detailed Implementation Phases](#5-detailed-implementation-phases)
6. [API Endpoints Reference](#6-api-endpoints-reference)
7. [Socket.IO Events](#7-socketio-event-flow)
8. [Component Data Flow](#8-component-data-flow)
9. [Error Handling & Edge Cases](#9-error-handling--edge-cases)
10. [Testing Strategy](#10-testing-checklist)
11. [Deployment](#11-deployment-checklist)
12. [Timeline](#12-timeline--resource-estimate)
13. [Known Risks](#13-known-risks--mitigations)

---

## 1. Architecture Overview

```
Frontend Messaging System
├── Core Services (REST API)
│   ├── messagingService.js (threads, messages, contacts)
│   └── contactsService.js (approved contacts, search)
│
├── State Management (Zustand)
│   ├── messagingStore.js (threads, messages, UI state)
│   └── contactsStore.js (approved contacts, search results)
│
├── Real-Time Communication (Socket.IO)
│   └── socketManager.js (connection, event listeners)
│
├── Pages
│   └── MessagesPage.jsx (main coordinator)
│
├── Components
│   ├── MessageSidebar (threads list)
│   ├── ChatWindow (active conversation)
│   └── StartConversationModal (NEW: contact selection)
│
└── Utilities
    ├── socketManager.js (Socket.IO wrapper)
    ├── `apiPaths.js` (endpoint definitions)
    └── debugLogger.js (existing logging)
```

---

## 2. Approved Contacts Strategy: Hybrid Two-Tier

### 2.1 Tier 1: "Approved" Contacts (No Request Needed)

These users can message directly without approval:

**For Professionals:**
- Employers who hired them (accepted applications)
- Employers they completed projects with
- Employers who viewed their profile & contacted them

**For Employers:**
- Professionals they hired (accepted applications)
- Professionals who completed projects for them
- Professionals who applied to their jobs

**Backend Query:**
```sql
SELECT DISTINCT user_id FROM (
  SELECT participant2_id as user_id FROM applications WHERE status='accepted' AND requester_id=current_user
  UNION
  SELECT participant1_id FROM applications WHERE status='accepted' AND participant2_id=current_user
  UNION
  SELECT professional_id FROM projects WHERE status='completed' AND employer_id=current_user
  UNION
  SELECT employer_id FROM projects WHERE status='completed' AND professional_id=current_user
  UNION
  SELECT viewer_id FROM profile_views WHERE viewed_user_id=current_user AND action='contact'
) approved_contacts
```

### 2.2 Tier 2: Search Directory (Message Request)

Any user can search and message other professionals/employers:

- Search by name, skill, profession
- Click "Message" to start conversation
- **First message goes to "Message Requests" inbox** (not main)
- Recipient can accept/decline to move to main inbox
- Prevents spam, protects main inbox

### 2.3 Thread Status Model

Threads now have a `status` field:

```javascript
{
  id: "THREAD_UUID",
  status: "active" | "request",  // "request" = awaiting approval
  participant1Id: "USER_UUID",
  participant2Id: "USER_UUID",
  initiatorId: "USER_UUID",  // who started the conversation
  requestedAt: "2026-08-18T10:00:00Z",
  acceptedAt: null,  // when recipient accepted
  lastMessage: "Hello...",
  unreadCount: 2,
  // ... rest of thread fields
}
```

### 2.4 Frontend UX Flow

**For Sender (Non-Approved):**
```
Click "New Message" 
  → Search for contact (Name, Profession, Skill)
  → Select contact
  → Send first message
  → Shows "Waiting for response..."
  → When accepted, converts to regular thread
```

**For Recipient (Receiving Request):**
```
Sidebar: "Message Requests (3)" tab
  → View pending message
  → Read preview
  → Click "Accept" or "Decline"
  → If accept: moves to main inbox
  → If decline: thread stays in requests/deleted
```

---

## 3. State Management: Zustand

### 3.1 messagingStore.js

```javascript
export const useMessagingStore = create(
  persist((set, get) => ({
    // Threads (conversations list)
    threads: [],
    activeThreadId: null,
    threadsLoading: false,
    threadsError: null,

    // Messages in active thread
    messages: [],
    messagesLoading: false,
    messagesError: null,
    pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },

    // Message input state
    messageInput: '',
    messageAttachment: null,
    sendingMessage: false,

    // Real-time states
    typingUsers: new Map(),  // { userId: true }
    onlineUsers: new Set(),
    messageReadReceipts: new Map(),  // { messageId: { userId, readAt } }

    // UI state
    unreadCounts: new Map(),  // { threadId: count }
    activeTab: 'All',  // 'All', 'Unread', 'Requests', 'Archives'

    // Actions
    setActiveThread: (threadId) => set({ activeThreadId: threadId }),
    loadThreads: async () => { /* ... */ },
    loadMessages: async (threadId, page) => { /* ... */ },
    sendMessage: async (threadId, content, attachment) => { /* ... */ },
    markThreadAsRead: async (threadId) => { /* ... */ },
    markMessageAsRead: async (threadId, messageId) => { /* ... */ },
    updateTypingStatus: (threadId, isTyping) => { /* ... */ },
    handleNewMessage: (message) => { /* ... */ },
    handleTypingIndicator: (threadId, userId, isTyping) => { /* ... */ },
    handlePresenceUpdate: (userId, isOnline) => { /* ... */ },
    handleMessageRead: (threadId, messageId, userId, readAt) => { /* ... */ },
    handleRequestAccepted: async (threadId) => { /* convert request to active */ },
    handleRequestDeclined: (threadId) => { /* remove from requests */ },
    setMessageInput: (text) => set({ messageInput: text }),
    setMessageAttachment: (attachment) => set({ messageAttachment: attachment }),
    setActiveTab: (tab) => set({ activeTab: tab }),
    reset: () => set({ /* reset all state */ }),
  }), {
    name: 'messaging-store',
    partialize: (state) => ({
      threads: state.threads,  // cache threads to localStorage
    }),
  })
);
```

### 3.2 contactsStore.js (NEW)

```javascript
export const useContactsStore = create((set, get) => ({
  // Approved contacts (Tier 1)
  approvedContacts: [],
  approvedLoading: false,
  approvedError: null,

  // Search results (Tier 2)
  searchResults: [],
  searchLoading: false,
  searchQuery: '',
  searchFilter: {
    type: 'professional' | 'employer',  // search filter
    profession: null,  // optional skill filter
  },

  // Active mode
  contactMode: 'approved',  // 'approved' | 'search'

  // Actions
  loadApprovedContacts: async () => { /* fetch from backend */ },
  searchContacts: async (query, filters) => { /* search API call */ },
  setContactMode: (mode) => set({ contactMode: mode }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  reset: () => set({ /* reset */ }),
}));
```

---

## 4. Files to Create

### Phase 0: Backend API Setup (Prerequisite - Backend Team)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/chat/contacts/approved` | GET | Get Tier 1 approved contacts |
| `/api/chat/contacts/search` | GET | Search directory (Tier 2) |
| `/api/chat/threads/:threadId/accept` | PATCH | Accept message request |
| `/api/chat/threads/:threadId/decline` | PATCH | Decline message request |

**Expected Responses:**
```json
// GET /api/chat/contacts/approved?limit=50
{
  "success": true,
  "data": [{
    "id": "UUID",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "professional",
    "professionalType": "plumber",
    "avatar": "https://...",
    "isOnline": true,
    "lastInteraction": "hired_you"  // context of relationship
  }],
  "total": 12
}

// GET /api/chat/contacts/search?q=plumb&type=professional
{
  "success": true,
  "data": [{...}],
  "total": 45,
  "page": 1
}

// PATCH /api/chat/threads/:threadId/accept
{
  "success": true,
  "message": "Thread accepted",
  "data": { "id": "...", "status": "active" }
}
```

### Phase 1: Core Services & State (P0)

| File | Purpose |
|------|---------|
| `messagingService.js` | REST API: threads, messages, basic operations |
| `src/api/services/contactsService.js` | **NEW** REST API: approved contacts, search |
| `messagingStore.js` | Zustand state for threads & messages |
| `src/store/contactsStore.js` | **NEW** Zustand state for contacts & search |
| `socketManager.js` | Socket.IO connection & event management |
| `apiPaths.js` | Update with new endpoints |
| `messagingConstants.js` | Event names, error messages |

### Phase 2: Pages & Components (P0-P1)

| File | Purpose |
|------|---------|
| `MessagesPage.jsx` | Main coordinator page |
| `src/components/messages/ChatWindow.jsx` | Message thread display |
| `src/components/messages/StartConversationModal.jsx` | **NEW** Contact selector modal |
| `src/components/messages/ApprovedContactsList.jsx` | **NEW** Tier 1 contacts display |
| `src/components/messages/ContactSearchTab.jsx` | **NEW** Tier 2 search tab |
| `src/components/messages/MessageRequests Tab.jsx` | **NEW** Pending requests view |
| `MessageInput.jsx` | Refactor: add typing, attachments |
| `MessageSidebar.jsx` | Refactor: add tabs, approved contacts |
| `MessageThreadItem.jsx` | Refactor: add status badge |

### Phase 3: Polish (P2)

| File | Purpose |
|------|---------|
| `src/components/messages/TypingIndicator.jsx` | Animated typing indicator |
| `src/components/messages/PresenceIndicator.jsx` | Online/offline status |
| `src/components/messages/AttachmentPreview.jsx` | File preview before send |
| `useMessaging.js` | Custom hook for convenience |

---

## 5. Detailed Implementation Phases

### Phase 1: Core Services & State (Days 1-2)

#### 5.1.1 Update `apiPaths.js`

Add new endpoints:

```javascript
export const API_PATHS = {
  // ... existing MESSAGING paths ...
  MESSAGING: {
    THREADS: "/api/chat/threads",
    THREAD_MESSAGES: (threadId) => `/api/chat/threads/${threadId}/messages`,
    THREAD_READ: (threadId) => `/api/chat/threads/${threadId}/read`,
    MESSAGE_READ: (threadId, messageId) => `/api/chat/threads/${threadId}/messages/${messageId}/read`,
    USER_INFO: (userId) => `/api/chat/users/${userId}`,
    // NEW ENDPOINTS FOR CONTACTS & REQUESTS
    APPROVED_CONTACTS: "/api/chat/contacts/approved",
    SEARCH_CONTACTS: "/api/chat/contacts/search",
    ACCEPT_REQUEST: (threadId) => `/api/chat/threads/${threadId}/accept`,
    DECLINE_REQUEST: (threadId) => `/api/chat/threads/${threadId}/decline`,
  }
};
```

#### 5.1.2 Create `messagingService.js`

```javascript
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

export const messagingService = {
  // Existing methods
  createThread: async (participantId) => {
    const response = await axiosInstance.post(API_PATHS.MESSAGING.THREADS, {
      participantId,
    });
    return response.data.data;
  },

  getThreads: async () => {
    const response = await axiosInstance.get(API_PATHS.MESSAGING.THREADS);
    return response.data.data;
  },

  getMessages: async (threadId, page = 1, limit = 20) => {
    const response = await axiosInstance.get(
      `${API_PATHS.MESSAGING.THREAD_MESSAGES(threadId)}?page=${page}&limit=${limit}`
    );
    return response.data.data;
  },

  sendMessage: async (threadId, content, attachmentUrl, attachmentType) => {
    const response = await axiosInstance.post(
      API_PATHS.MESSAGING.THREAD_MESSAGES(threadId),
      { content, attachmentUrl, attachmentType }
    );
    return response.data.data;
  },

  markThreadAsRead: async (threadId) => {
    const response = await axiosInstance.patch(
      API_PATHS.MESSAGING.THREAD_READ(threadId)
    );
    return response.data.data;
  },

  markMessageAsRead: async (threadId, messageId) => {
    const response = await axiosInstance.post(
      `${API_PATHS.MESSAGING.THREAD_MESSAGES(threadId)}/${messageId}/read`
    );
    return response.data.data;
  },

  getUserInfo: async (userId) => {
    const response = await axiosInstance.get(
      API_PATHS.MESSAGING.USER_INFO(userId)
    );
    return response.data.data;
  },

  // NEW METHODS FOR REQUEST HANDLING
  acceptMessageRequest: async (threadId) => {
    const response = await axiosInstance.patch(
      API_PATHS.MESSAGING.ACCEPT_REQUEST(threadId)
    );
    return response.data.data;
  },

  declineMessageRequest: async (threadId) => {
    const response = await axiosInstance.patch(
      API_PATHS.MESSAGING.DECLINE_REQUEST(threadId)
    );
    return response.data.data;
  },
};
```

#### 5.1.3 Create `contactsService.js` (NEW)

```javascript
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

export const contactsService = {
  // Get Tier 1: Approved Contacts
  getApprovedContacts: async (limit = 50) => {
    const response = await axiosInstance.get(
      `${API_PATHS.MESSAGING.APPROVED_CONTACTS}?limit=${limit}`
    );
    return response.data.data;
  },

  // Get Tier 2: Search Directory
  searchContacts: async (query, type = 'professional', profession = null, page = 1, limit = 20) => {
    let url = `${API_PATHS.MESSAGING.SEARCH_CONTACTS}?q=${encodeURIComponent(query)}&type=${type}&page=${page}&limit=${limit}`;
    if (profession) url += `&profession=${profession}`;
    
    const response = await axiosInstance.get(url);
    return response.data.data;
  },
};
```

#### 5.1.4 Create `messagingStore.js`

```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { messagingService } from '../api/services/messagingService';
import { socketManager } from '../utils/socketManager';

export const useMessagingStore = create(
  persist(
    (set, get) => ({
      // State
      threads: [],
      activeThreadId: null,
      threadsLoading: false,
      threadsError: null,

      messages: [],
      messagesLoading: false,
      messagesError: null,
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },

      messageInput: '',
      messageAttachment: null,
      sendingMessage: false,

      typingUsers: new Map(),
      onlineUsers: new Set(),
      messageReadReceipts: new Map(),

      unreadCounts: new Map(),
      activeTab: 'All',  // 'All', 'Unread', 'Requests', 'Archives'

      // Actions
      setActiveThread: (threadId) => set({ activeThreadId: threadId }),

      loadThreads: async () => {
        set({ threadsLoading: true, threadsError: null });
        try {
          const threads = await messagingService.getThreads();
          set({ threads, threadsLoading: false });
        } catch (error) {
          set({ threadsError: error.message, threadsLoading: false });
          throw error;
        }
      },

      loadMessages: async (threadId, page = 1) => {
        set({ messagesLoading: true, messagesError: null });
        try {
          const data = await messagingService.getMessages(threadId, page, 20);
          set({
            messages: page === 1 ? data.items.reverse() : [...data.items.reverse(), ...get().messages],
            pagination: {
              page: data.page,
              limit: data.limit,
              total: data.total,
              totalPages: data.totalPages,
            },
            messagesLoading: false,
          });
        } catch (error) {
          set({ messagesError: error.message, messagesLoading: false });
          throw error;
        }
      },

      sendMessage: async (threadId, content, attachment = null) => {
        set({ sendingMessage: true });
        try {
          const message = await messagingService.sendMessage(
            threadId,
            content,
            attachment?.url || null,
            attachment?.type || null
          );
          // Add to messages optimistically
          set((state) => ({
            messages: [...state.messages, message],
            messageInput: '',
            messageAttachment: null,
            sendingMessage: false,
          }));
          return message;
        } catch (error) {
          set({ sendingMessage: false });
          throw error;
        }
      },

      markThreadAsRead: async (threadId) => {
        try {
          await messagingService.markThreadAsRead(threadId);
          set((state) => {
            const newCounts = new Map(state.unreadCounts);
            newCounts.delete(threadId);
            return { unreadCounts: newCounts };
          });
        } catch (error) {
          console.error('Failed to mark thread as read:', error);
        }
      },

      // Socket handlers
      handleNewMessage: (message) => {
        set((state) => {
          if (state.activeThreadId === message.threadId) {
            return { messages: [...state.messages, message] };
          }
          // Update unread count
          const newCounts = new Map(state.unreadCounts);
          newCounts.set(message.threadId, (newCounts.get(message.threadId) || 0) + 1);
          return { unreadCounts: newCounts };
        });
      },

      handleTypingIndicator: (threadId, userId, isTyping) => {
        set((state) => {
          const typing = new Map(state.typingUsers);
          if (isTyping) {
            typing.set(userId, true);
          } else {
            typing.delete(userId);
          }
          return { typingUsers: typing };
        });
      },

      handlePresenceUpdate: (userId, isOnline) => {
        set((state) => {
          const online = new Set(state.onlineUsers);
          if (isOnline) {
            online.add(userId);
          } else {
            online.delete(userId);
          }
          return { onlineUsers: online };
        });
      },

      handleMessageRead: (threadId, messageId, userId, readAt) => {
        set((state) => {
          const receipts = new Map(state.messageReadReceipts);
          receipts.set(messageId, { userId, readAt });
          return { messageReadReceipts: receipts };
        });
      },

      handleRequestAccepted: async (threadId) => {
        // Convert request to active thread
        set((state) => {
          const threads = state.threads.map((t) =>
            t.id === threadId ? { ...t, status: 'active' } : t
          );
          return { threads };
        });
      },

      setMessageInput: (text) => set({ messageInput: text }),
      setMessageAttachment: (attachment) => set({ messageAttachment: attachment }),
      setActiveTab: (tab) => set({ activeTab: tab }),

      reset: () => set({
        threads: [],
        activeThreadId: null,
        messages: [],
        messageInput: '',
        messageAttachment: null,
        typingUsers: new Map(),
        onlineUsers: new Set(),
        messageReadReceipts: new Map(),
        unreadCounts: new Map(),
      }),
    }),
    { name: 'messaging-store', partialize: (state) => ({ threads: state.threads }) }
  )
);
```

#### 5.1.5 Create `contactsStore.js` (NEW)

```javascript
import { create } from 'zustand';
import { contactsService } from '../api/services/contactsService';

export const useContactsStore = create((set, get) => ({
  // Tier 1: Approved Contacts
  approvedContacts: [],
  approvedLoading: false,
  approvedError: null,

  // Tier 2: Search Results
  searchResults: [],
  searchLoading: false,
  searchQuery: '',
  searchType: 'professional',  // 'professional' | 'employer'
  searchPage: 1,

  // UI State
  contactMode: 'approved',  // 'approved' | 'search'

  // Actions
  loadApprovedContacts: async () => {
    set({ approvedLoading: true, approvedError: null });
    try {
      const contacts = await contactsService.getApprovedContacts(50);
      set({ approvedContacts: contacts, approvedLoading: false });
    } catch (error) {
      set({ approvedError: error.message, approvedLoading: false });
      throw error;
    }
  },

  searchContacts: async (query, type = 'professional', page = 1) => {
    set({ searchLoading: true, searchError: null, searchQuery: query, searchType: type, searchPage: page });
    try {
      const results = await contactsService.searchContacts(query, type, null, page, 20);
      set({ searchResults: results.items || results, searchLoading: false });
    } catch (error) {
      set({ searchError: error.message, searchLoading: false });
      throw error;
    }
  },

  setContactMode: (mode) => set({ contactMode: mode }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  reset: () => set({
    approvedContacts: [],
    searchResults: [],
    searchQuery: '',
    contactMode: 'approved',
  }),
}));
```

#### 5.1.6 Create `socketManager.js`

```javascript
import { io } from 'socket.io-client';
import { API_BASE_URL } from '../utils/apiPaths';
import { debugLog } from '../utils/debugLogger';

class SocketManager {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(accessToken) {
    if (this.socket?.connected) return Promise.resolve();

    return new Promise((resolve, reject) => {
      try {
        this.socket = io(API_BASE_URL, {
          transports: ['websocket'],
          withCredentials: true,
          auth: { token: accessToken },
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
        });

        this.socket.on('connect', () => {
          debugLog('socket_connect', { status: 'connected' });
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          debugLog('socket_error', { error: error.message });
          reject(error);
        });

        this.socket.on('disconnect', () => {
          debugLog('socket_disconnect', { status: 'disconnected' });
        });

        // Auto-reconnect listeners
        this.setupAutoListeners();
      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.listeners.clear();
    }
  }

  emit(event, payload, callback) {
    if (!this.socket?.connected) {
      console.warn(`[SocketManager] Socket not connected, cannot emit ${event}`);
      return;
    }
    this.socket.emit(event, payload, callback);
  }

  on(event, handler) {
    if (!this.socket) return;
    this.socket.on(event, handler);
    this.listeners.set(event, handler);
  }

  off(event) {
    if (!this.socket) return;
    this.socket.off(event);
    this.listeners.delete(event);
  }

  isConnected() {
    return this.socket?.connected || false;
  }

  setupAutoListeners() {
    // These will be registered by components
  }
}

export const socketManager = new SocketManager();
```

### Phase 2: UI Integration (Days 2-3)

#### 5.2.1 Create `StartConversationModal.jsx` (NEW)

```javascript
import React, { useState, useEffect } from 'react';
import { useContactsStore } from '../../store/contactsStore';
import { useMessagingStore } from '../../store/messagingStore';
import { messagingService } from '../../api/services/messagingService';

const StartConversationModal = ({ isOpen, onClose }) => {
  const { approvedContacts, loadApprovedContacts, searchContacts, contactMode, setContactMode, searchResults } = useContactsStore();
  const { setActiveThread } = useMessagingStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (isOpen && contactMode === 'approved') {
      loadApprovedContacts();
    }
  }, [isOpen, contactMode]);

  const handleSelectContact = async (contact) => {
    try {
      const thread = await messagingService.createThread(contact.id);
      setActiveThread(thread.id);
      onClose();
    } catch (error) {
      console.error('Failed to create thread:', error);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      await searchContacts(query);
    }
  };

  const contacts = contactMode === 'approved' ? approvedContacts : searchResults;

  return (
    <div className={`fixed inset-0 z-50 bg-black/50 ${isOpen ? 'flex' : 'hidden'} items-center justify-center`}>
      <div className="bg-white rounded-2xl w-96 max-h-96 flex flex-col">
        {/* Tabs */}
        <div className="flex gap-2 p-4 border-b">
          <button
            onClick={() => setContactMode('approved')}
            className={`px-4 py-2 rounded-lg ${contactMode === 'approved' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            Approved Contacts
          </button>
          <button
            onClick={() => setContactMode('search')}
            className={`px-4 py-2 rounded-lg ${contactMode === 'search' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            Search
          </button>
        </div>

        {/* Search/List */}
        <div className="flex-1 overflow-y-auto">
          {contactMode === 'search' && (
            <input
              type="text"
              placeholder="Search professionals..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full p-3 border-b"
            />
          )}

          {contacts.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No contacts found</div>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => handleSelectContact(contact)}
                className="p-3 border-b hover:bg-gray-50 cursor-pointer flex items-center gap-3"
              >
                <img src={contact.avatar} alt={contact.fullName} className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <div className="font-medium">{contact.fullName}</div>
                  <div className="text-sm text-gray-500">{contact.professionalType || contact.role}</div>
                </div>
                {contact.isOnline && <div className="w-3 h-3 bg-green-500 rounded-full" />}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex gap-2">
          <button onClick={onClose} className="flex-1 px-4 py-2 text-gray-700 border rounded-lg">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartConversationModal;
```

#### 5.2.2 Update `MessageSidebar.jsx`

```javascript
// Add tabs: 'All', 'Unread', 'Requests', 'Archives'
// Connect to messagingStore.threads
// Filter by status if viewing 'Requests'
// Add "New Conversation" button → StartConversationModal
```

#### 5.2.3 Update `MessagesPage.jsx`

```javascript
const MessagesPage = () => {
  const { loadThreads, loadMessages, setActiveThread, activeThreadId } = useMessagingStore();
  const [showNewConversation, setShowNewConversation] = useState(false);

  useEffect(() => {
    loadThreads();
  }, []);

  // Initialize Socket.IO after auth
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      socketManager.connect(token).catch(console.error);
    }
    return () => socketManager.disconnect();
  }, []);

  return (
    <div className="flex h-screen gap-4">
      <MessageSidebar onNewConversation={() => setShowNewConversation(true)} />
      {activeThreadId ? <ChatWindow /> : <EmptyState />}
      <StartConversationModal isOpen={showNewConversation} onClose={() => setShowNewConversation(false)} />
    </div>
  );
};
```

### Phase 3: Polish & Features (Days 3-4)

- Implement read receipts (checkmarks)
- Add typing indicators
- Message request UI (Accept/Decline buttons)
- Error handling & retries
- Scroll pagination

---

## 6. API Endpoints Reference

### Core Messaging (Existing)

```
POST   /api/chat/threads                              Create/get thread
GET    /api/chat/threads                              List user's threads
GET    /api/chat/threads/:threadId/messages           Get message history
POST   /api/chat/threads/:threadId/messages           Send message
PATCH  /api/chat/threads/:threadId/read               Mark thread as read
GET    /api/chat/users/:userId                        Get user info
```

### Approved Contacts (NEW)

```
GET    /api/chat/contacts/approved?limit=50           Get Tier 1 contacts
  Response: { data: [{ id, fullName, avatar, isOnline, lastInteraction }] }

GET    /api/chat/contacts/search?q=name&type=prof     Search directory (Tier 2)
  Response: { data: [{ id, fullName, avatar, ... }], total, page }

PATCH  /api/chat/threads/:threadId/accept             Accept message request
  Response: { data: { id, status: 'active' } }

PATCH  /api/chat/threads/:threadId/decline            Decline message request
  Response: { success: true }
```

---

## 7. Socket.IO Event Flow

### Client → Server

```
joinThread       { threadId }              User enters a conversation
sendMessage      { threadId, content, ... } Send real-time message
typingStart      { threadId }              User starts typing
typingStop       { threadId }              User stops typing
readMessage      { threadId, messageId }   Mark message as read
leaveThread      { threadId }              User leaves conversation
```

### Server → Client

```
newMessage       { message }               New message arrived
typing           { threadId, userId, isTyping }  Typing indicator
presenceUpdate   { userId, isOnline }     User online/offline
messageRead      { threadId, messageId, userId, readAt }  Read receipt
threadRequested  { thread }                NEW: Someone sent message request
requestAccepted  { threadId }              Request was accepted
```

---

## 8. Component Data Flow

```
MessagesPage (init, Socket.IO setup)
├── MessageSidebar (thread list + tabs)
│   ├── Tabs: All | Unread | Requests | Archives
│   ├── MessageThreadItem (individual thread)
│   │   ├── Avatar
│   │   ├── Name & Last Message
│   │   ├── Unread Badge
│   │   ├── Status: "Awaiting response..." (for requests)
│   │   └── Click to select
│   ├── "New Conversation" Button
│   └── StartConversationModal
│       ├── Tab: Approved Contacts (auto-loaded)
│       ├── Tab: Search Directory (with search input)
│       └── Contact card → Click to message
│
└── ChatWindow (active thread OR empty)
    ├── ConversationHeader
    │   ├── Avatar + Name
    │   ├── Online Status
    │   └── Info/Options
    ├── MessageList
    │   ├── MessageBubble (text + attachments)
    │   │   ├── Content
    │   │   ├── Read Receipts (checkmarks)
    │   │   └── Timestamp
    │   ├── TypingIndicator
    │   └── "Load Earlier" button
    └── MessageInput
        ├── Text input
        ├── Attachment button
        ├── Typing indicator (socket emits)
        └── Send button
```

---

## 9. Error Handling & Edge Cases

### 9.1 Message Request Flow

**Scenario: Professional sends first message to employer**

1. Professional searches for employer (Tier 2)
2. Clicks "Message"
3. Frontend: `messagingService.createThread(employerId)` → backend creates thread with `status='request'`
4. MessageInput appears with text "Send your first message"
5. After send, modal closes, thread appears in "Requests" tab
6. Shows "Awaiting response..." badge
7. Employer receives Socket.IO `threadRequested` event
8. Employer's sidebar shows "Requests (1)" badge
9. Employer clicks request → sees message + accept/decline buttons
10. If accept: Thread moves to main inbox (status='active')
11. Professional gets Socket.IO `requestAccepted` event

### 9.2 Error Cases

```javascript
if (403) {
  // Not allowed to message this person
  toast.error("You don't have permission to message this user");
}

if (404) {
  // User not found
  toast.error("User not found");
}

if (400) {
  // Validation error (message too long, etc.)
  toast.error(error.data.message);
}

if (429) {
  // Rate limited
  toast.error("Too many requests, please wait a moment");
  // Auto-retry after delay
}

if (Socket disconnected) {
  // Fallback to REST
  showOfflineIndicator();
  // Queue messages locally
  // Retry on reconnect
}
```

---

## 10. Testing Checklist

### Core Features

- [ ] Load threads list on mount
- [ ] Load approved contacts in StartConversationModal
- [ ] Search contacts works (Tier 2)
- [ ] Click approved contact → create thread
- [ ] Click search result → create thread with status='request'
- [ ] Select thread → load message history
- [ ] Send message via Socket.IO (optimistic UI)
- [ ] Message appears in recipient's thread in real-time
- [ ] Typing indicator shows/hides
- [ ] Mark thread as read
- [ ] Pagination: load earlier messages
- [ ] Unread badge increments

### Message Requests

- [ ] Send request thread appears in "Requests" tab
- [ ] Recipient sees "Requests (1)" badge
- [ ] Recipient opens request → sees message + accept/decline
- [ ] Click "Accept" → thread moves to main inbox (status='active')
- [ ] Click "Decline" → thread disappears
- [ ] Requester notified of acceptance

### Edge Cases

- [ ] Send message while Socket.IO disconnected (REST fallback)
- [ ] Socket reconnects → queued messages send
- [ ] Auth token expires → redirect to login
- [ ] Thread 403 → show error
- [ ] Search returns 0 results
- [ ] Logout → Socket.IO disconnects

---

## 11. Deployment Checklist

- [ ] Backend: New endpoints implemented & tested
- [ ] Frontend: All P0 services created & working
- [ ] Socket.IO: Connected on auth, events flowing
- [ ] Message Requests: Thread status field added to backend
- [ ] API URLs correct (prod vs dev)
- [ ] Socket URL matches backend domain
- [ ] Error messages user-friendly
- [ ] Remove all `console.log` (except critical)
- [ ] Test with production JWT
- [ ] Load test: 100+ messages in thread
- [ ] Cross-browser: Chrome, Firefox, Safari
- [ ] Mobile: Sidebar collapses on small screens
- [ ] Accessibility: ARIA labels, keyboard nav

---

## 12. Timeline & Resource Estimate

| Task | Duration | Effort |
|------|----------|--------|
| Backend: New endpoints | 1 day | 4 hrs |
| Frontend P1: Services & Store | 1-2 days | 6 hrs |
| Frontend P2: UI Components | 2-3 days | 12 hrs |
| Socket.IO Integration | 1 day | 4 hrs |
| Message Requests Feature | 1 day | 4 hrs |
| Testing & Debug | 1 day | 6 hrs |
| **Total** | **~6-8 days** | **~36-40 hrs** |

**Parallel Work**: Backend & frontend can start simultaneously

---

## 13. Known Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Socket.IO latency | Slow message delivery | REST fallback + optimistic UI |
| Lost messages on disconnect | Data loss | Queue locally, retry on reconnect |
| Memory leaks (listeners) | Performance | Proper `.off()` on unmount |
| Token expires mid-session | Auth failure | Auto-refresh via axios interceptor |
| Unread counts out of sync | Bad UX | Refresh from server on reconnect |
| Spam via search directory | Abuse | Backend rate limiting + blocklist feature |
| Missing backend endpoints | Blocking | Coordinate with backend team early |

---

## 14. Future Enhancements

- [ ] Block/report user
- [ ] Message deletion & editing
- [ ] Reactions (👍, 😂, ❤️)
- [ ] Voice/video calls
- [ ] Group messaging
- [ ] Message search
- [ ] Archive conversations
- [ ] Message templates/quick replies

---

## 15. Quick Reference: File Structure

```
src/
├── api/
│   └── services/
│       ├── messagingService.js  (THREADS, MESSAGES, REQUESTS)
│       └── contactsService.js   (NEW: APPROVED, SEARCH)
├── store/
│   ├── messagingStore.js        (threads, messages, UI)
│   └── contactsStore.js         (NEW: approved, search, mode)
├── utils/
│   ├── socketManager.js         (Socket.IO manager)
│   ├── apiPaths.js              (ADD: new endpoints)
│   └── debugLogger.js           (existing)
├── pages/
│   └── MessagesPage.jsx         (coordinator)
├── components/
│   └── messages/
│       ├── StartConversationModal.jsx  (NEW)
│       ├── ApprovedContactsList.jsx    (NEW)
│       ├── ContactSearchTab.jsx        (NEW)
│       ├── MessageRequests Tab.jsx     (NEW)
│       ├── MessageSidebar.jsx          (REFACTOR: add tabs)
│       ├── ChatWindow.jsx              (REFACTOR)
│       ├── MessageInput.jsx            (REFACTOR: typing, attachments)
│       ├── MessageBubble.jsx           (REFACTOR: read receipts)
│       ├── MessageThreadItem.jsx       (REFACTOR: status badge)
│       ├── TypingIndicator.jsx         (NEW)
│       └── PresenceIndicator.jsx       (NEW)
└── hooks/
    └── useMessaging.js          (NEW: optional convenience hook)
```

---

## Appendix: Reference Links

- [Socket.IO Documentation](https://socket.io/docs/v4/client-api/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Router v7](https://reactrouter.com/en/main)
- [Axios Docs](https://axios-http.com/docs/instance)
- [Linkprosoft Backend API](.`API_INTEGRATION_OVERVIEW.md`)

---

**Document Version**: 2.0  
**Last Updated**: August 18, 2026  
**Status**: Ready for Implementation ✅
```

This comprehensive file has been created and covers all aspects of the messaging implementation with the hybrid "Any Match/Interaction + Search Directory" strategy fully integrated!

**Key additions:**
✅ Tier 1 & Tier 2 contact system (approved + searchable)  
✅ Message requests flow (status: 'active' | 'request')  
✅ Two new services: `contactsService.js` & `contactsStore.js`  
✅ StartConversationModal with tabs  
✅ Accept/Decline message requests UX  
✅ Complete backend endpoint specs  
✅ Edge case handling  
✅ Full testing checklist  

Ready to start implementation? 🚀This comprehensive file has been created and covers all aspects of the messaging implementation with the hybrid "Any Match/Interaction + Search Directory" strategy fully integrated!

**Key additions:**
✅ Tier 1 & Tier 2 contact system (approved + searchable)  
✅ Message requests flow (status: 'active' | 'request')  
✅ Two new services: `contactsService.js` & `contactsStore.js`  
✅ StartConversationModal with tabs  
✅ Accept/Decline message requests UX  
✅ Complete backend endpoint specs  
✅ Edge case handling  
✅ Full testing checklist  

Ready to start implementation? 🚀