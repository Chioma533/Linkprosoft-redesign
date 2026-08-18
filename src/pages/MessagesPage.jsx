import { useEffect, useMemo, useRef, useState } from "react";
import MessageSidebar from "../components/messages/MessageSidebar";
import ConversationHeader from "../components/messages/ConversationHeader";
import MessageBubble from "../components/messages/MessageBubble";
import MessageInput from "../components/messages/MessageInput";
import EmptyConversationState from "../components/messages/EmptyConversationState";
import StartConversationModal from "../components/messages/StartConversationModal";
import { SOCKET_EVENTS } from "../constants/messagingConstants";
import { useMessaging } from "../hooks/useMessaging";
import { socketManager } from "../utils/socketManager";

const initials = (name = "Conversation") => name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
const colorIndex = (id = "") => [...id].reduce((total, char) => total + char.charCodeAt(0), 0) % 5;
const displayTime = (value) => value ? new Date(value).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "";

const MessagesPage = () => {
  const {
    threads, activeThreadId, messages, pagination, messageInput, sendingMessage, messagesLoading,
    onlineUsers, typingUsers, currentUser, loadThreads, setActiveThread, loadMessages,
    markThreadAsRead, sendMessage, setMessageInput, approvedContacts, approvedContactsLoading,
    loadApprovedContacts, startConversation, respondToMessageRequest,
  } = useMessaging();
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showConversation, setShowConversation] = useState(false);
  const [showStartConversation, setShowStartConversation] = useState(false);
  const typingTimeout = useRef(null);
  const typingActive = useRef(false);
  const endRef = useRef(null);

  useEffect(() => { if (currentUser?.id) { loadThreads(currentUser.id); loadApprovedContacts(); } }, [currentUser?.id]);

  const uiThreads = useMemo(() => threads.map((thread) => {
    const participant = thread.participant ?? {};
    const name = participant.fullName || "Conversation";
    return {
      ...thread, sender: name, initials: initials(name), colorIdx: colorIndex(participant.id),
      preview: thread.lastMessage || "No messages yet", time: displayTime(thread.lastMessageAt || thread.updatedAt),
      unread: Number(thread.unreadCount || 0), online: Boolean(onlineUsers[participant.id]),
    };
  }), [threads, onlineUsers]);
  const activeThread = uiThreads.find((thread) => thread.id === activeThreadId);
  const filteredThreads = useMemo(() => uiThreads.filter((thread) => {
    const matchesSearch = `${thread.sender} ${thread.preview}`.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "Unread") return matchesSearch && thread.unread > 0;
    if (activeTab === "Requests") return matchesSearch && thread.status === "request" && thread.initiatorId !== currentUser?.id;
    return matchesSearch;
  }), [uiThreads, activeTab, searchQuery]);

  useEffect(() => {
    if (!activeThreadId) return undefined;
    loadMessages(activeThreadId, 1);
    socketManager.emit(SOCKET_EVENTS.JOIN_THREAD, { threadId: activeThreadId });
    markThreadAsRead(activeThreadId).catch(() => {});
    return () => socketManager.emit(SOCKET_EVENTS.LEAVE_THREAD, { threadId: activeThreadId });
  }, [activeThreadId]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [activeThreadId, messages.length]);
  useEffect(() => () => clearTimeout(typingTimeout.current), []);

  const selectThread = (thread) => { setActiveThread(thread.id); setShowConversation(true); };
  const selectApprovedContact = async (contact) => {
    await startConversation(contact);
    setShowStartConversation(false);
    setShowConversation(true);
  };
  const stopTyping = () => {
    if (typingActive.current && activeThreadId) socketManager.emit(SOCKET_EVENTS.TYPING_STOP, { threadId: activeThreadId });
    typingActive.current = false;
  };
  const updateInput = (value) => {
    setMessageInput(value.slice(0, 2000));
    if (!activeThreadId || !socketManager.isConnected()) return;
    if (value.trim() && !typingActive.current) {
      socketManager.emit(SOCKET_EVENTS.TYPING_START, { threadId: activeThreadId });
      typingActive.current = true;
    }
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(stopTyping, 2000);
  };
  const submitMessage = async () => {
    if (!activeThreadId || !messageInput.trim()) return;
    stopTyping();
    await sendMessage(activeThreadId, messageInput);
  };
  const isOtherTyping = activeThread && Object.entries(typingUsers).some(([key, isTyping]) => isTyping && key.startsWith(`${activeThread.id}:`));

  return (
    <div className="-m-4 sm:-m-6 py-5 md:-m-8 flex" style={{ height: "calc(100vh - 5rem)" }}>
      <MessageSidebar showConversation={showConversation} activeTab={activeTab} onTabChange={setActiveTab}
        searchQuery={searchQuery} onSearchChange={setSearchQuery} filteredThreads={filteredThreads}
        activeThreadId={activeThreadId} onSelectThread={selectThread}
        archiveCount={uiThreads.filter((thread) => thread.status === "request" && thread.initiatorId !== currentUser?.id).length}
        currentUserId={currentUser?.id} onAcceptRequest={(threadId) => respondToMessageRequest(threadId, "accept")}
        onDeclineRequest={(threadId) => respondToMessageRequest(threadId, "decline")}
        onStartConversation={() => setShowStartConversation(true)} />
      <section className={`${showConversation ? "flex" : "hidden"} md:flex flex-col flex-1 bg-[#F7FAFC] min-w-0`}>
        {activeThread ? <>
          <ConversationHeader thread={activeThread} onBackMobile={() => setShowConversation(false)} />
          <div className="flex-1 overflow-y-auto px-5 py-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
            {pagination.page < pagination.totalPages && <button onClick={() => loadMessages(activeThreadId, pagination.page + 1)} className="block mx-auto mb-5 text-xs font-semibold text-[#016EA6]">Load earlier messages</button>}
            {messagesLoading && <p className="text-center text-xs text-gray-400">Loading messages…</p>}
            {messages.map((message) => <MessageBubble key={message.id} msg={message} currentUserId={currentUser?.id} />)}
            {isOtherTyping && <p className="text-xs text-gray-400 italic mt-2">{activeThread.sender} is typing…</p>}
            <div ref={endRef} />
          </div>
          <MessageInput inputText={messageInput} onInputChange={updateInput} onSend={submitMessage}
            onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); submitMessage(); } }}
            sending={sendingMessage} inputRef={null} />
        </> : <EmptyConversationState />}
      </section>
      {showStartConversation && <StartConversationModal contacts={approvedContacts} loading={approvedContactsLoading}
        onClose={() => setShowStartConversation(false)} onSelect={selectApprovedContact} />}
    </div>
  );
};

export default MessagesPage;
