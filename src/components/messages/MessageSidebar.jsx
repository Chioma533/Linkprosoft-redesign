import React from "react";
import { Search, Circle } from "lucide-react";
import MessageThreadItem from "./MessageThreadItem";
import { TAB_OPTIONS } from "../../constants/messagesData";

const MessageSidebar = ({
  showConversation,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  filteredThreads,
  activeThreadId,
  onSelectThread,
  archiveCount,
}) => {
  return (
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
              onClick={() => onTabChange(tab)}
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

      {/* Search bar */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search message"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
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
            <MessageThreadItem
              key={thread.id}
              thread={thread}
              isActive={thread.id === activeThreadId}
              onClick={() => onSelectThread(thread)}
            />
          ))
        )}
      </div>
    </aside>
  );
};

export default MessageSidebar;
