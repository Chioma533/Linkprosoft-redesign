import React, { useState } from "react";
import { Check, X } from "lucide-react";
import ChatAvatar from "./ChatAvatar";

const MessageThreadItem = ({ thread, isActive, onClick, currentUserId, onAccept, onDecline }) => {
  const [isDeciding, setIsDeciding] = useState(false);
  const isIncomingRequest = thread.status === "request" && thread.initiatorId !== currentUserId;
  const decide = async (event, action) => {
    event.stopPropagation();
    setIsDeciding(true);
    try { await action(); } finally { setIsDeciding(false); }
  };

  return (
  <div
    className={`w-full flex items-center gap-3 px-3 py-3.5 rounded-2xl text-left transition-all duration-200 cursor-pointer ${
      isActive ? "bg-[#EBF3FA]" : "hover:bg-gray-50"
    }`}
  >
    <button onClick={onClick} className="flex min-w-0 flex-1 items-center gap-3 text-left">
      <ChatAvatar initials={thread.initials} colorIdx={thread.colorIdx} online={thread.online} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className={`text-xs font-bold truncate ${isActive ? "text-[#016EA6]" : "text-gray-800"}`}>{thread.sender}</h4>
          <span className="text-[10px] text-gray-400 shrink-0 ml-2">{thread.time}</span>
        </div>
        <p className="text-[10px] text-gray-400 truncate mt-0.5">{thread.preview}</p>
      </div>
    </button>

    {isIncomingRequest ? (
      <div className="flex shrink-0 items-center gap-1" aria-label="Message request actions">
        <button disabled={isDeciding} onClick={(event) => decide(event, onAccept)} title="Accept message request" className="rounded-full bg-emerald-50 p-1.5 text-emerald-600 hover:bg-emerald-100 disabled:opacity-50"><Check className="h-3.5 w-3.5" /></button>
        <button disabled={isDeciding} onClick={(event) => decide(event, onDecline)} title="Decline message request" className="rounded-full bg-rose-50 p-1.5 text-rose-600 hover:bg-rose-100 disabled:opacity-50"><X className="h-3.5 w-3.5" /></button>
      </div>
    ) : <div className="shrink-0">
      {thread.unread > 0 ? (
        <span className="w-5 h-5 rounded-full bg-[#016EA6] text-white text-[9px] font-bold flex items-center justify-center">
          {thread.unread}
        </span>
      ) : (
        <span className="w-5 h-5" />
      )}
    </div>}
  </div>
);};

export default MessageThreadItem;
