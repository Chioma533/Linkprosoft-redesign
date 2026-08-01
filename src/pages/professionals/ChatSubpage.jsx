import React, { useState, useRef, useEffect } from "react";

import {
  Search,
  Phone,
  Ban,
  Smile,
  Mic,
  Send,
  Paperclip,
  MoreVertical,
  ChevronLeft,
  Archive,
  CheckCheck,
  Circle,
} from "lucide-react";

// ─── Static seed data ─────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
  "bg-rose-100 text-rose-700",
  "bg-amber-100 text-amber-700",
];

const INITIAL_THREADS = [
  {
    id: 1,
    sender: "Marvelous Samuel",
    initials: "MS",
    colorIdx: 0,
    preview: "How are you Chioma, Nice to connect with you.",
    time: "5min",
    unread: 3,
    online: true,
    messages: [
      {
        id: 1,
        from: "them",
        text: "Hi Daniel, I found your profile while searching for electricians nearby. Are you available to install some new light fixtures tomorrow?",
        time: "9:12 AM",
        read: true,
      },
      {
        id: 2,
        from: "me",
        text: "Hello Daniel! 👋 Thanks for reaching out. Yes, I'm available tomorrow afternoon. How many light fixtures do you need installed?",
        time: "9:12 AM",
        read: true,
      },
      {
        id: 3,
        from: "me",
        text: "Where are you located?",
        time: "9:12 AM",
        read: true,
      },
    ],
  },
  {
    id: 2,
    sender: "David Jonathan",
    initials: "DJ",
    colorIdx: 1,
    preview: "The wardrobe installation is complete, please check it out.",
    time: "12min",
    unread: 1,
    online: false,
    messages: [
      {
        id: 1,
        from: "them",
        text: "Good morning! I've finished the wardrobe installation. Please let me know when you're available to inspect it.",
        time: "8:45 AM",
        read: true,
      },
      {
        id: 2,
        from: "me",
        text: "Great work! I'll come by around noon to check.",
        time: "8:50 AM",
        read: true,
      },
      {
        id: 3,
        from: "them",
        text: "The wardrobe installation is complete, please check it out.",
        time: "9:00 AM",
        read: false,
      },
    ],
  },
  {
    id: 3,
    sender: "Bayo Alao",
    initials: "BA",
    colorIdx: 2,
    preview: "I'll be there by 3 PM for the electrical diagnostics.",
    time: "1hr",
    unread: 0,
    online: true,
    messages: [
      {
        id: 1,
        from: "me",
        text: "Hi Bayo, can you come over today for the diagnostic test?",
        time: "7:30 AM",
        read: true,
      },
      {
        id: 2,
        from: "them",
        text: "I'll be there by 3 PM for the electrical diagnostics.",
        time: "7:45 AM",
        read: true,
      },
    ],
  },
  {
    id: 4,
    sender: "Chidinma Obi",
    initials: "CO",
    colorIdx: 3,
    preview: "Payment has been sent to your wallet. Thanks!",
    time: "2hr",
    unread: 0,
    online: false,
    messages: [
      {
        id: 1,
        from: "them",
        text: "Hi, the plumbing work has been completed. Could you release the escrow?",
        time: "6:00 AM",
        read: true,
      },
      {
        id: 2,
        from: "me",
        text: "Yes, funds released. Great job on the piping!",
        time: "6:10 AM",
        read: true,
      },
      {
        id: 3,
        from: "them",
        text: "Payment has been sent to your wallet. Thanks!",
        time: "6:12 AM",
        read: true,
      },
    ],
  },
  {
    id: 5,
    sender: "Tunde Okafor",
    initials: "TO",
    colorIdx: 4,
    preview: "Can we reschedule the tiling to next Wednesday?",
    time: "Yesterday",
    unread: 2,
    online: false,
    messages: [
      {
        id: 1,
        from: "them",
        text: "Hello, I need to reschedule. Something came up on my end.",
        time: "Yesterday 4:00 PM",
        read: true,
      },
      {
        id: 2,
        from: "them",
        text: "Can we reschedule the tiling to next Wednesday?",
        time: "Yesterday 4:02 PM",
        read: false,
      },
    ],
  },
  {
    id: 6,
    sender: "Amaka Eze",
    initials: "AE",
    colorIdx: 0,
    preview: "Noted. I'll bring all the materials required.",
    time: "Yesterday",
    unread: 0,
    online: true,
    messages: [
      {
        id: 1,
        from: "me",
        text: "Please bring a ladder and the LED strips for the ceiling work.",
        time: "Yesterday 2:00 PM",
        read: true,
      },
      {
        id: 2,
        from: "them",
        text: "Noted. I'll bring all the materials required.",
        time: "Yesterday 2:05 PM",
        read: true,
      },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const ChatAvatar = ({ initials, colorIdx = 0, online = false, size = "md" }) => {
  const sizeClasses =
    size === "sm"
      ? "w-9 h-9 text-xs"
      : size === "lg"
      ? "w-12 h-12 text-sm"
      : "w-10 h-10 text-xs";
  const dotClasses = size === "sm" ? "w-2 h-2 border" : "w-2.5 h-2.5 border-2";

  return (
    <div className="relative shrink-0">
      <div
        className={`${sizeClasses} ${
          AVATAR_COLORS[colorIdx % AVATAR_COLORS.length]
        } rounded-full flex items-center justify-center font-bold`}
      >
        {initials}
      </div>
      {online && (
        <span
          className={`absolute bottom-0 right-0 ${dotClasses} bg-emerald-400 border-white rounded-full`}
        />
      )}
    </div>
  );
};

const ThreadRow = ({ thread, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-3.5 rounded-2xl text-left transition-all duration-200 cursor-pointer ${
      isActive ? "bg-[#EBF3FA]" : "hover:bg-gray-50"
    }`}
  >
    <ChatAvatar
      initials={thread.initials}
      colorIdx={thread.colorIdx}
      online={thread.online}
    />

    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <h4
          className={`text-xs font-bold truncate ${
            isActive ? "text-[#016EA6]" : "text-gray-800"
          }`}
        >
          {thread.sender}
        </h4>
        <span className="text-[10px] text-gray-400 shrink-0 ml-2">{thread.time}</span>
      </div>
      <p className="text-[10px] text-gray-400 truncate mt-0.5">{thread.preview}</p>
    </div>

    <div className="shrink-0">
      {thread.unread > 0 ? (
        <span className="w-5 h-5 rounded-full bg-[#016EA6] text-white text-[9px] font-bold flex items-center justify-center">
          {thread.unread}
        </span>
      ) : (
        <span className="w-5 h-5" />
      )}
    </div>
  </button>
);

const MessageBubble = ({ msg }) => {
  const isMe = msg.from === "me";
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[68%] flex flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
            isMe
              ? "bg-[#016EA6] text-white rounded-br-sm"
              : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
          }`}
        >
          {msg.text}
        </div>
        <div className={`flex items-center gap-1.5 px-1 ${isMe ? "flex-row-reverse" : ""}`}>
          <span className="text-[10px] text-gray-400">{msg.time}</span>
          {isMe && (
            <CheckCheck
              className={`w-3.5 h-3.5 ${
                msg.read ? "text-[#016EA6]" : "text-gray-300"
              }`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const TAB_OPTIONS = ["Unread", "Archives", "Blocked"];

const ChatSubpage = () => {
  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [activeThreadId, setActiveThreadId] = useState(1);
  const [activeTab, setActiveTab] = useState("Unread");
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [showConversation, setShowConversation] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const activeThread = threads.find((t) => t.id === activeThreadId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeThread?.messages?.length, activeThreadId]);

  const handleSelectThread = (thread) => {
    setActiveThreadId(thread.id);
    setShowConversation(true);
    setThreads((prev) =>
      prev.map((t) =>
        t.id === thread.id
          ? {
              ...t,
              unread: 0,
              messages: t.messages.map((m) => ({ ...m, read: true })),
            }
          : t
      )
    );
  };

  const handleSendMessage = () => {
    const text = inputText.trim();
    if (!text || !activeThread) return;

    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    const newMsg = { id: Date.now(), from: "me", text, time, read: false };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThreadId
          ? { ...t, preview: text, time: "now", messages: [...t.messages, newMsg] }
          : t
      )
    );
    setInputText("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredThreads = threads.filter((t) => {
    const matchesSearch =
      !searchQuery ||
      t.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.preview.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "Archives")
      return matchesSearch && t.unread === 0 && !t.online;
    if (activeTab === "Blocked") return false;
    return matchesSearch;
  });

  const archiveCount = threads.filter((t) => t.unread === 0 && !t.online).length;


  return (
    <div
      className="-m-4 sm:-m-6 md:-m-8 py-5 flex"
      style={{ height: "calc(100vh - 5rem)" }}
    >
      {/* ── LEFT PANEL ────────────────────────────────────────────────────── */}
      <aside
        className={`
          ${showConversation ? "hidden" : "flex"}
          md:flex flex-col
          w-full md:w-[34%] lg:w-[31%]
          bg-white rounded-l-2xl border-r border-gray-100
          shrink-0
        `}
      >
        {/* Tab bar */}
        <div className="flex items-center gap-1 px-4 pt-5 pb-3">
          {TAB_OPTIONS.map((tab) => {
            const isActive = activeTab === tab;
            const count = tab === "Archives" ? archiveCount : null;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#016EA6] text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab}
                {count !== null && (
                  <span
                    className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search message"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-700 placeholder-gray-400 outline-none focus:border-[#016EA6] focus:bg-white focus:ring-2 focus:ring-[#016EA6]/10 transition-all duration-200"
            />
          </div>
        </div>

        {/* Thread list */}
        <div
          className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5
            [&::-webkit-scrollbar]:w-1
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-gray-200
            [&::-webkit-scrollbar-thumb]:rounded-full"
        >
          {filteredThreads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-xs gap-2">
              <Circle className="w-8 h-8 opacity-30" />
              <span>No conversations found</span>
            </div>
          ) : (
            filteredThreads.map((thread) => (
              <ThreadRow
                key={thread.id}
                thread={thread}
                isActive={thread.id === activeThreadId}
                onClick={() => handleSelectThread(thread)}
              />
            ))
          )}
        </div>
      </aside>

      {/* ── RIGHT PANEL ───────────────────────────────────────────────────── */}
      <section
        className={`
          ${showConversation ? "flex" : "hidden"}
          md:flex flex-col flex-1 bg-[#F7FAFC] min-w-0
          
        `}
      >
        {activeThread ? (
          <>
            {/* Conversation header */}
            <header className="flex items-center justify-between px-5 py-4 bg-white rounded-tr-2xl border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowConversation(false)}
                  className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <ChatAvatar
                  initials={activeThread.initials}
                  colorIdx={activeThread.colorIdx}
                  online={activeThread.online}
                  size="lg"
                />
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    {activeThread.sender}
                  </h3>
                  <p
                    className={`text-[11px] font-medium ${
                      activeThread.online ? "text-emerald-500" : "text-gray-400"
                    }`}
                  >
                    {activeThread.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  title="Voice call"
                  className="p-2 rounded-xl text-gray-400 hover:text-[#016EA6] hover:bg-[#EBF3FA] transition-all duration-200 cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  title="Block user"
                  className="p-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all duration-200 cursor-pointer"
                >
                  <Ban className="w-4 h-4" />
                </button>
                <button
                  title="More options"
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* Messages area */}
            <div
              className="flex-1 overflow-y-auto px-5 py-6
                [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-gray-200
                [&::-webkit-scrollbar-thumb]:rounded-full"
            >
              {activeThread.messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div className="shrink-0 px-5 py-4 bg-white rounded-br-2xl border-t border-gray-100">
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 focus-within:border-[#016EA6] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#016EA6]/10 transition-all duration-200">
                <button
                  title="Emoji"
                  className="text-gray-400 hover:text-[#016EA6] transition-colors cursor-pointer shrink-0"
                >
                  <Smile className="w-5 h-5" />
                </button>

                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type Something"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none min-w-0"
                />

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    title="Voice message"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-[#016EA6] hover:bg-[#EBF3FA] transition-all cursor-pointer"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                  <button
                    title="Attach file"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-[#016EA6] hover:bg-[#EBF3FA] transition-all cursor-pointer"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim()}
                    title="Send"
                    className={`p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                      inputText.trim()
                        ? "bg-[#016EA6] text-white hover:bg-[#0158a0] shadow-sm hover:shadow-md active:scale-95"
                        : "bg-gray-100 text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
            <div className="w-16 h-16 rounded-full bg-[#EBF3FA] flex items-center justify-center">
              <Archive className="w-8 h-8 text-[#016EA6]/40" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-500">
                No conversation selected
              </p>
              <p className="text-xs mt-1">
                Pick a thread from the left to start chatting
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ChatSubpage;
