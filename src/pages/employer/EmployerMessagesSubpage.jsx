import React, { useState, useRef, useEffect } from "react";
import MessageSidebar from "../../components/messages/MessageSidebar";
import ConversationHeader from "../../components/messages/ConversationHeader";
import MessageBubble from "../../components/messages/MessageBubble";
import MessageInput from "../../components/messages/MessageInput";
import EmptyConversationState from "../../components/messages/EmptyConversationState";
import { INITIAL_THREADS } from "../../constants/messagesData";

const EmployerMessagesSubpage = () => {
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
    <div className="-m-4 sm:-m-6 py-5 md:-m-8 flex" style={{ height: "calc(100vh - 5rem)" }}>
      {/* Sidebar Panel */}
      <MessageSidebar
        showConversation={showConversation}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filteredThreads={filteredThreads}
        activeThreadId={activeThreadId}
        onSelectThread={handleSelectThread}
        archiveCount={archiveCount}
      />

      {/* Conversation Active Panel */}
      <section
        className={`
          ${showConversation ? "flex" : "hidden"}
          md:flex flex-col flex-1 bg-[#F7FAFC] min-w-0
        `}
      >
        {activeThread ? (
          <>
            {/* Top header bar */}
            <ConversationHeader
              thread={activeThread}
              onBackMobile={() => setShowConversation(false)}
            />

            {/* Scrollable messages container */}
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

            {/* Bottom text input composer */}
            <MessageInput
              inputText={inputText}
              onInputChange={setInputText}
              onSend={handleSendMessage}
              onKeyDown={handleKeyDown}
              inputRef={inputRef}
            />
          </>
        ) : (
          <EmptyConversationState />
        )}
      </section>
    </div>
  );
};

export default EmployerMessagesSubpage;

