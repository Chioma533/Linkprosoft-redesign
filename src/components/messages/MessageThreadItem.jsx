import React from "react";
import ChatAvatar from "./ChatAvatar";

const MessageThreadItem = ({ thread, isActive, onClick }) => (
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

export default MessageThreadItem;
