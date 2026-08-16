import React from "react";
import { ChevronLeft, Phone, Ban, MoreVertical } from "lucide-react";
import ChatAvatar from "./ChatAvatar";

const ConversationHeader = ({ thread, onBackMobile }) => {
  if (!thread) return null;

  return (
    <header className="flex items-center justify-between px-5 py-4 rounded-tr-2xl bg-white border-b border-gray-100 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onBackMobile}
          className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <ChatAvatar
          initials={thread.initials}
          colorIdx={thread.colorIdx}
          online={thread.online}
          size="lg"
        />
        <div>
          <h3 className="text-sm font-bold text-gray-900">{thread.sender}</h3>
          <p
            className={`text-[11px] font-medium ${
              thread.online ? "text-emerald-500" : "text-gray-400"
            }`}
          >
            {thread.online ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          title="Voice call"
          className="p-2 rounded-full text-gray-400 hover:text-[#016EA6] hover:bg-[#EBF3FA] transition-all duration-200 cursor-pointer"
        >
          <Phone className="w-4 h-4" />
        </button>
        <button
          title="Block user"
          className="p-2 rounded-full text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all duration-200 cursor-pointer"
        >
          <Ban className="w-4 h-4" />
        </button>
        <button
          title="More options"
          className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default ConversationHeader;
