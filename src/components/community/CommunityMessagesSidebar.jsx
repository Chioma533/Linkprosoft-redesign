import React, { useMemo } from "react";

const displayName = (participant) =>
  participant?.fullName ||
  participant?.full_name ||
  participant?.name ||
  "Conversation";

const initials = (name) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

const displayTime = (value) =>
  value ? new Date(value).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "";

const CommunityMessagesSidebar = ({
  threads,
  loading,
  error,
  onlineUsers,
  currentUserId,
  onOpenThread,
  onViewMore,
}) => {
  const visibleThreads = useMemo(() => (threads || []).slice(0, 3), [threads]);

  return (
    <aside className="min-w-0 rounded-[22px] border border-[#e1e5e9] bg-[#f8f8f8] p-3 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden md:col-span-2 lg:col-span-1">
      <div className="flex items-center justify-between border-b border-[#e1e5e9] pb-3">
        <h2 className="text-lg font-medium text-[#1d1d1d]">Messages</h2>
      </div>

      {loading ? (
        <p className="py-6 text-center text-xs text-[#777]">Loading conversations…</p>
      ) : error ? (
        <p className="py-6 text-center text-xs text-red-600">{error}</p>
      ) : visibleThreads.length === 0 ? (
        <p className="py-6 text-center text-xs text-[#777]">No conversations yet</p>
      ) : (
        <div className="mt-2">
          {visibleThreads.map((thread) => {
            const participant = thread.participant || {};
            const name = displayName(participant);
            const avatar = participant.avatarUrl || participant.avatar || participant.profileImage || null;
            const online = Boolean(onlineUsers[participant.id]);
            const preview = thread.lastMessage || "No messages yet";
            const time = displayTime(thread.lastMessageAt || thread.updatedAt);

            return (
              <button
                type="button"
                key={thread.id}
                onClick={() => onOpenThread(thread.id)}
                className="flex w-full min-w-0 items-center gap-2 border-b border-[#e1e5e9] py-3 text-left last:border-0"
              >
                <div className="relative shrink-0">
                  {avatar ? (
                    <img src={avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#d1d1d1] via-[#7aa0bb] to-[#3f6d8d] text-[10px] font-bold text-white">
                      {initials(name)}
                    </div>
                  )}
                  {online ? <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#f8f8f8] bg-[#2dc36f]" /> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#1a1a1a]">{name}</p>
                  <p className="truncate text-xs text-[#6d6d6d]">{preview}</p>
                </div>
                {time ? <span className="shrink-0 text-[10px] text-[#808080]">{time}</span> : null}
              </button>
            );
          })}
        </div>
      )}

      {(threads || []).length > 3 ? (
        <button type="button" onClick={onViewMore} className="mt-3 w-full rounded-full border border-[#dfe9f2] bg-[#edf6ff] px-3 py-2 text-xs font-medium text-[#0c76c9]">
          View more
        </button>
      ) : null}
    </aside>
  );
};

export default CommunityMessagesSidebar;
