import React from "react";
import { CheckCheck } from "lucide-react";

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

export default MessageBubble;
