# Messaging Module Frontend Implementation Plan

## Overview
This plan outlines the integration of the backend messaging REST API and Socket.IO real-time features into the existing React + Zustand frontend architecture.

**Current Status**: UI components exist (MessageBub bble, MessageSidebar, etc.). Backend API is production-ready.  
**Goal**: Full end-to-end real-time messaging with REST fallback.

---

## 1. Architecture & State Management Strategy

### 1.1 Zustand Store Structure
Create `src/store/messagingStore.js` with the following state shape:I

```typescript
{
  // Threads (conversations list)
  threads: Thread[],
  activeThreadId: string | null,
  threadsLoading: boolean,
  threadsError: null | string,

  // Messages in active thread
  messages: Message[],
  messagesLoading: boolean,
  messagesError: null | string,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  },

  // Message input state
  messageInput: string,
  messageAttachment: null | { url: string, type: string },
  sendingMessage: boolean,

  // Real-time states
  typingUsers: Map<userId, true>, // { userId: true }
  onlineUsers: Set<userId>,
  messageReadReceipts: Map<messageId, { userId, readAt }>,

  // UI state
  unreadCounts: Map<threadId, number>,
  selectedUser: User | null, // for starting new conversation

  // Actions
  setActiveThread: (threadId) => void,
  loadThreads: () => Promise,
  loadMessages: (threadId, page) => Promise,
  sendMessage: (threadId, content, attachment?) => Promise,
  markThreadAsRead: (threadId) => Promise,
  markMessageAsRead: (threadId, messageId) => Promise,
  updateTypingStatus: (threadId, isTyping) => void,
  handleNewMessage: (message) => void,
  handleTypingIndicator: (threadId, userId, isTyping) => void,
  handlePresenceUpdate: (userId, isOnline) => void,
  handleMessageRead: (threadId, messageId, userId, readAt) => void,
  setMessageInput: (text) => void,
  setMessageAttachment: (attachment) => void,
  reset: () => void,
}
```

### 1.2 Socket.IO Manager
Create `src/utils/socketManager.js` - centralized Socket.IO connection handler:
- Single instance shared across app
- Auto-reconnect with exponential backoff
- Event listener registration/cleanup
- Callback system for store updates

---

## 2. Files to Create

### Phase 1: Core Services & State (Required before UI integration)

| File | Purpose | Priority |
|------|---------|----------|
| `src/api/services/messagingService.js` | REST API calls (create threads, send messages, load history) | **P0** |
| `src/store/messagingStore.js` | Zustand state management for messaging | **P0** |
| `src/utils/socketManager.js` | Socket.IO connection & event management | **P0** |
| `src/hooks/useMessaging.js` | Custom hook for UI component convenience | P1 |
| `src/constants/messagingConstants.js` | Event names, error messages, defaults | P1 |

### Phase 2: Pages & Page-Level Components (After services ready)

| File | Purpose | Priority |
|------|---------|----------|
| `src/pages/MessagesPage.jsx` | Main messaging page (routes to this from navbar) | **P0** |
| `src/components/messages/ChatWindow.jsx` | Refactored message thread display | P1 |
| `src/components/messages/StartConversationModal.jsx` | Modal to initiate new conversation | P1 |
| `src/components/messages/AttachmentPreview.jsx` | File attachment preview before send | P2 |
| `src/components/messages/TypingIndicator.jsx` | Visual "X is typing" animation | P2 |
| `src/components/messages/PresenceIndicator.jsx` | Online/offline status badge | P2 |

### Phase 3: Existing Component Updates

| File | Changes |
|------|---------|
| `src/components/messages/MessageBubble.jsx` | Add read receipts, attachments display, reactions (future) |
| `src/components/messages/MessageInput.jsx` | Add attachment button, typing indicator, keyboard shortcuts |
| `src/components/messages/MessageSidebar.jsx` | Connect to store, add search, filter by unread |
| `src/components/messages/MessageThreadItem.jsx` | Show unread count, last message preview, online status |
| `src/components/messages/ConversationHeader.jsx` | Show user info, online status, call buttons (future) |

---

## 3. Detailed Implementation Phases

### Phase 1: Foundation (Days 1-2)
**Deliverable**: Messages can be sent/received, basic state management works

#### 3.1.1 Create `messagingService.js`
```javascript
// Exports:
export const messagingService = {
  // REST Endpoints
  createThread(participantId),
  getThreads(),
  getMessages(threadId, page, limit),
  sendMessage(threadId, content, attachmentUrl, attachmentType),
  markThreadAsRead(threadId),
  markMessageAsRead(threadId, messageId),
  getUserInfo(userId),
}
```

**Key Details**:
- Use existing `axiosInstance` (already has JWT interception)
- Mock data fallback for testing
- Error handling: throw custom errors with codes for UI

#### 3.1.2 Create `messagingStore.js`
```javascript
// Zustand store with persist plugin (save threads to localStorage)
// Actions reference messagingService for API calls
// Separate actions for server events (handleNewMessage, etc.)
```

**Key Details**:
- Use Zustand's `persist` middleware to cache threads
- Clear messages on logout (action in authStore)
- Optimize re-renders: split thread list / message list state

#### 3.1.3 Create `socketManager.js`
```javascript
// Initialize Socket.IO connection after auth
// Auto-attach Bearer token from localStorage
// Provide registry for event listeners:
export const socketManager = {
  connect(accessToken),
  disconnect(),
  emit(event, payload, callback),
  on(event, handler),
  off(event, handler),
  isConnected(),
}
```

**Key Details**:
- Connect only after JWT is available (in `useEffect` on AuthContext change)
- Handle connection failures gracefully (fallback to REST)
- Reconnect on auth token refresh

#### 3.1.4 Add API paths
Update `src/utils/apiPaths.js`:
```javascript
export const API_PATHS = {
  // ...existing...
  MESSAGING: {
    THREADS: "/api/chat/threads",
    THREAD_MESSAGES: (threadId) => `/api/chat/threads/${threadId}/messages`,
    THREAD_READ: (threadId) => `/api/chat/threads/${threadId}/read`,
    MESSAGE_READ: (threadId, messageId) => `/api/chat/threads/${threadId}/messages/${messageId}/read`,
    USER_INFO: (userId) => `/api/chat/users/${userId}`,
  }
}
```

---

### Phase 2: UI Integration (Days 2-3)
**Deliverable**: Messages page fully functional with real-time updates

#### 3.2.1 Create `MessagesPage.jsx`
```javascript
// Layout: MessageSidebar (left) + ChatWindow (right)
// Responsibilities:
// - Load initial threads on mount
// - Pass store state & actions to child components
// - Handle thread selection
// - Initialize Socket.IO on first render
// - Cleanup on unmount
```

#### 3.2.2 Create `ChatWindow.jsx`
```javascript
// Show:
// - ConversationHeader (user info, online status)
// - MessageList (auto-scroll to bottom)
// - TypingIndicator (if user is typing)
// - MessageInput (compose new message)
//
// Handlers:
// - Load messages on threadId change
// - Listen for newMessage event
// - Auto-mark as read on scroll into view
```

#### 3.2.3 Refactor `MessageInput.jsx`
```javascript
// Current: Text input only
// Add:
// - Attachment button
// - Typing start/stop handlers (debounce)
// - Keyboard: Enter to send, Shift+Enter for newline
// - Disable while sending
// - Character counter for 2000 char limit
```

#### 3.2.4 Refactor `MessageSidebar.jsx`
```javascript
// Current: Static mock threads
// Connect to:
// - messagingStore.threads
// - messagingStore.activeThreadId
// - messagingStore.unreadCounts
//
// Add:
// - Search threads (filter by participant name)
// - Sort by last message date (auto via backend)
// - Tab filtering (All, Unread, Archives)
// - "New Conversation" button → StartConversationModal
```

#### 3.2.5 Refactor `MessageThreadItem.jsx`
```javascript
// Add:
// - PresenceIndicator (green dot if online)
// - Unread badge (red circle with count)
// - Last message preview (truncated)
// - Timestamp of last message
// - Click to select thread
```

---

### Phase 3: Polish & Features (Days 3-4)
**Deliverable**: Production-ready with all bells & whistles

#### 3.3.1 Create `StartConversationModal.jsx`
```javascript
// Modal that:
// - Lists recent professional contacts (from projects/applications)
// - Search by name
// - Click to start new thread
// - Auto-load existing thread if already chatting
```

#### 3.3.2 Create `TypingIndicator.jsx`
```javascript
// Animated 3-dot indicator: "User is typing..."
// Triggered by typing event from Socket.IO
// Auto-hide after 3 seconds idle
```

#### 3.3.3 Implement Read Receipts
```javascript
// MessageBubble shows:
// - Single checkmark (sent)
// - Double checkmark gray (delivered)
// - Double checkmark blue (read + timestamp)
// - Click timestamp to see read time
```

#### 3.3.4 Error Handling & Retry
```javascript
// Failed message:
// - Red border, show "Retry" button
// - Store failed message locally
// - Auto-retry on reconnect
// - Toast notification on error
```

#### 3.3.5 Scroll to Bottom & Pagination
```javascript
// MessageList:
// - Auto-scroll to latest message
// - "Load earlier" button appears on scroll up
// - Fetch page-2, page-3 when clicked
```

---

## 4. Socket.IO Event Flow

### Client-to-Server (What frontend emits)
```
emit('joinThread', { threadId })
  → Response: { success: true }
  
emit('sendMessage', { threadId, content, attachmentUrl, attachmentType }, callback)
  → Callback: { success: true, messageId }
  
emit('typingStart', { threadId })
emit('typingStop', { threadId })
  → Response: { success: true }
  
emit('readMessage', { threadId, messageId }, callback)
  → Callback: { success: true }
  
emit('leaveThread', { threadId })
  → Response: { success: true }
```

### Server-to-Client (What frontend listens for)
```
on('newMessage', ({ message }) => {
  messagingStore.handleNewMessage(message)
})

on('typing', ({ threadId, userId, isTyping }) => {
  messagingStore.handleTypingIndicator(threadId, userId, isTyping)
})

on('presenceUpdate', ({ userId, isOnline }) => {
  messagingStore.handlePresenceUpdate(userId, isOnline)
})

on('messageRead', ({ threadId, messageId, userId, readAt }) => {
  messagingStore.handleMessageRead(threadId, messageId, userId, readAt)
})
```

---

## 5. Component Data Flow

```
MessagesPage (coordinator)
├── MessageSidebar (thread list)
│   ├── MessageThreadItem (individual thread)
│   │   ├── Avatar (user's profile pic)
│   │   ├── PresenceIndicator (online status)
│   │   └── Unread badge
│   └── StartConversationModal
│
└── ChatWindow (active thread)
    ├── ConversationHeader
    │   ├── Avatar + name
    │   ├── PresenceIndicator
    │   └── Info/actions button
    │
    ├── MessageList
    │   ├── MessageBubble (individual message)
    │   │   ├── Content
    │   │   ├── Read receipts
    │   │   └── Timestamp
    │   ├── TypingIndicator (conditional)
    │   └── "Load earlier" (pagination)
    │
    └── MessageInput
        ├── Text input + send button
        ├── Attachment input
        └── Character counter
```

**Store Integration**:
- All components read from `messagingStore` (no prop drilling)
- Child components dispatch actions: `messagingStore.sendMessage()`, etc.
- Parent (MessagesPage) handles lifecycle: `useEffect` for loading, Socket.IO setup

---

## 6. Authentication & Security

### JWT Token Flow
1. User logs in → `authStore` saves token to localStorage
2. `axiosInstance` interceptor automatically adds `Authorization: Bearer <token>`
3. Socket.IO connects with same token via `auth` prop
4. Backend validates token on handshake
5. If token expires → `axiosInstance` handles refresh, Socket.IO reconnects

### Error Handling
- 401 Unauthorized → `authStore` clears auth, redirect to login
- 403 Forbidden → Show toast "Not allowed to access this conversation"
- 400 Bad Request → Show validation error to user
- 500 Server Error → Show "Server error, try again" + retry option

---

## 7. Key Implementation Details

### 7.1 Message Ordering
- Backend returns messages newest-first (use `.reverse()` or sort on frontend)
- Append new messages to end for natural scroll behavior
- When loading earlier (pagination), prepend to top

### 7.2 Unread Count Management
- `threads[i].unreadCount` from backend
- Increment on `newMessage` (if from other user)
- Reset on `markThreadAsRead` or `markMessageAsRead`
- Show in tab title: `Messages (5)` if 5 unread threads

### 7.3 Typing Indicator Debounce
```javascript
// Don't spam typing events
const typingTimeout = useRef(null);

const handleInputChange = (text) => {
  messagingStore.setMessageInput(text);
  
  // Clear old timeout
  clearTimeout(typingTimeout.current);
  
  // Emit typing start
  if (text.length === 1) socketManager.emit('typingStart', { threadId });
  
  // Emit typing stop after 2 seconds idle
  typingTimeout.current = setTimeout(() => {
    socketManager.emit('typingStop', { threadId });
  }, 2000);
};
```

### 7.4 Scroll Lock Prevention
- Message list auto-scrolls to bottom on new message
- User scrolling up manually doesn't auto-scroll (let them read history)
- Only auto-scroll if already at bottom OR message is from current user

### 7.5 Attachment Handling
- Frontend: Accept image, document, video, audio
- Show file preview in MessageInput before send
- Store `attachmentUrl` + `attachmentType` in message
- In MessageBubble: render media embed based on type

---

## 8. Testing Checklist

- [ ] Load threads list on page mount
- [ ] Select thread → load message history
- [ ] Send message via REST (not Socket.IO yet)
- [ ] Socket.IO connection on auth
- [ ] Receive message in real-time (from another device/user)
- [ ] Typing indicator shows/hides correctly
- [ ] Mark thread as read
- [ ] Pagination: load earlier messages
- [ ] Unread badge increments on new message
- [ ] Online status updates
- [ ] Message fails to send → retry works
- [ ] Logout → Socket.IO disconnects, auth clears
- [ ] Login → Socket.IO reconnects

---

## 9. Integration Points with Existing Codebase

### 9.1 AuthStore Updates
```javascript
// In authStore.js logout action:
messagingStore.reset(); // Clear all messages
socketManager.disconnect(); // Close Socket.IO
```

### 9.2 Routes / Navigation
```javascript
// Add in App.jsx routes:
{
  path: "/messages",
  element: <PrivateRoutes><MessagesPage /></PrivateRoutes>
}

// Add link in navbar:
<Link to="/messages">Messages</Link>
```

### 9.3 Notification Badge
```javascript
// In navbar/layout, show unread count:
const unreadThreads = messagingStore.threads.filter(t => t.unreadCount > 0).length;
return <span className="badge">{unreadThreads}</span>
```

---

## 10. Deployment Checklist

- [ ] Update API_PATHS with correct backend URL
- [ ] Socket.IO URL matches backend (e.g., https://backend.com, not http://localhost)
- [ ] Remove all `console.log` except critical errors
- [ ] Test with production JWT token
- [ ] Test with real database (not mocks)
- [ ] Load testing: 100+ messages in thread
- [ ] Cross-device testing: send from browser A, receive in browser B
- [ ] Mobile responsive: sidebar disappears, shows full ChatWindow

---

## 11. Timeline & Resource Estimate

| Phase | Duration | Effort |
|-------|----------|--------|
| **P1: Core Services** | 1-2 days | 4-6 hrs (messagingService, messagingStore, socketManager) |
| **P2: UI Integration** | 2-3 days | 8-12 hrs (MessagesPage, ChatWindow, component refactors) |
| **P3: Polish** | 1-2 days | 4-8 hrs (modals, read receipts, error handling) |
| **Testing & Debug** | 1 day | 4-6 hrs |
| **Buffer (20%)** | 0.5 days | - |
| **Total** | ~5-6 days | ~20-32 hrs |

**Parallel Work**: UI components (P2) and Socket.IO testing can start once P1 is done.

---

## 12. Known Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Socket.IO latency on slow networks | Users see lag | REST fallback + optimistic UI updates |
| Lost messages on disconnect | Data loss | Queue messages locally, retry on reconnect |
| Memory leak from Socket.IO listeners | Performance | Proper `.off()` on component unmount |
| Token expiry during Socket.IO session | Auth failure | Re-emit stored messages after reconnect |
| Unread count out of sync | Poor UX | Refresh from server on reconnect |

---

## Next Steps

1. **Review this plan** with team (acceptance criteria, timeline OK?)
2. **Approve P0 files** (messagingService, messagingStore, socketManager)
3. **Begin Phase 1** (core services implementation)
4. **Test with Postman/Curl** before UI integration
5. **Weekly sync** on progress

---

## Appendix: Reference Links

- Backend API Docs: See `MESSAGING_BACKEND_API.md`
- Socket.IO Docs: https://socket.io/docs/v4/client-api/
- Zustand Docs: https://github.com/pmndrs/zustand
- React Router v7: https://reactrouter.com/en/main
- Axios Docs: https://axios-http.com/docs/instance
