import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, MessageSquareText, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NotificationIcon from "../components/icons/NotificationIcon";
import { notificationService } from "../api/services/notificationService";
import { useAuthStore } from "../store/authStore";

const tabLabels = [
  { key: "all", label: "All Notifications" },
  { key: "job", label: "Job Notifications" },
  { key: "unread", label: "Unread" },
];

const avatarPalette = [
  "from-[#c7d4de] to-[#8aa3bb]",
  "from-[#d8c2a7] to-[#c38d60]",
  "from-[#8fb0d9] to-[#4a7ec7]",
  "from-[#d0d7dc] to-[#9eaab7]",
];

const formatRelativeTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  const minutes = Math.max(1, Math.floor((Date.now() - date.getTime()) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / 1440)}d ago`;
};

const normalizeNotification = (item, index) => ({
  id: item.id || item.notificationId || `notification-${index}`,
  person: item.sender?.fullName || item.sender?.name || item.actor?.fullName || item.actor?.name || item.title || "Linkprosoft",
  message: item.message || item.body || item.description || item.title || "You have a new notification.",
  time: formatRelativeTime(item.createdAt || item.created_at || item.timestamp || item.time),
  unread: Boolean(item.unread ?? (item.is_read === false || item.isRead === false)),
  avatar: item.sender?.avatar || item.actor?.avatar || item.avatar || item.user?.avatar,
  avatarTone: avatarPalette[index % avatarPalette.length],
  accent: "bg-[#016EA6]",
  category: item.type === "job" || item.category === "job" ? "job" : "all",
});

const normalizeMessage = (item, index) => ({
  id: item.id || item.messageId || `message-${index}`,
  sender: item.sender?.fullName || item.sender?.name || item.senderName || item.sender || "Conversation",
  preview: item.lastMessage || item.message || item.content || item.text || "No message preview available.",
  time: formatRelativeTime(item.lastMessageAt || item.createdAt || item.updatedAt || item.time),
  avatar: item.sender?.avatar || item.avatar || item.user?.avatar,
});

const NotificationRow = ({ item, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`group flex w-full items-center gap-4 border-b border-[#e7eaee] px-5 py-4 text-left transition-colors hover:bg-white ${
      selected ? "bg-white" : "bg-[#f8f8f9]"
    }`}
  >
    <div className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br ${item.avatarTone} text-[10px] font-bold text-white`}>
      {item.avatar ? <img src={item.avatar} alt="" className="h-full w-full object-cover" /> : item.person.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}
    </div>

    <div className="min-w-0 flex-1">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-medium text-[#1f2430]">
            {item.person}
          </p>
          <p className="mt-1 text-[15px] text-[#3b3e45]">{item.message}</p>
        </div>

        <div className={`mt-1 h-3.5 w-3.5 shrink-0 rounded-full ${item.accent}`} />
      </div>

      <p className="mt-2 text-[12px] text-[#6d7681]">{item.time}</p>
    </div>
  </button>
);

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      notificationService.getNotifications("all", 50),
      notificationService.getMessages(),
    ]).then(([notificationData, messageData]) => {
      if (!isMounted) return;
      const liveNotifications = notificationData.map(normalizeNotification);
      setNotifications(liveNotifications);
      setMessages(messageData.map(normalizeMessage));
      setSelectedNotificationId(liveNotifications[0]?.id || null);
    }).finally(() => {
      if (isMounted) setIsLoading(false);
    });
    return () => { isMounted = false; };
  }, []);

  const filteredNotifications = useMemo(() => {
    switch (activeTab) {
      case "job":
        return notifications.filter((item) => item.category === "job");
      case "unread":
        return notifications.filter((item) => item.unread);
      default:
        return notifications;
    }
  }, [activeTab, notifications]);

  const selectedNotification =
    filteredNotifications.find((item) => item.id === selectedNotificationId) ||
    filteredNotifications[0] ||
    notifications[0];

  const userName = user?.fullName || user?.full_name || user?.name || "User";
  const userAvatar = user?.avatar || user?.profileImage || user?.profile_image;

  return (
    <div className="min-h-screen bg-[#f3f4f7] text-[#1e232b]">
      <header className="border-b border-[#e8ebee] bg-[#f8f8f9] px-5 py-4 md:px-8">
        <div className="mx-auto flex max-w-[1360px] items-center gap-4">
          <button
            type="button"
            aria-label="Back"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#dfe4ea] bg-white text-[#303843] transition hover:bg-[#f3f8ff]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <h1 className="flex-1 text-[22px] font-semibold tracking-[-0.02em] text-[#1d252d]">
            Notifications
          </h1>

          <div className="hidden min-w-[450px] items-center rounded-full border border-[#e4e7eb] bg-white px-4 py-2.5 md:flex">
            <Search className="h-4 w-4 text-[#7a818b]" />
            <input
              type="text"
              value=""
              readOnly
              placeholder="Search notifications"
              className="ml-3 w-full border-0 bg-transparent text-[14px] text-[#495260] placeholder:text-[#8b919b] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Messages"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e4e7eb] bg-white text-[#3b4450] transition hover:bg-[#f4f9ff]"
            >
              <MessageSquareText className="h-4 w-4" />
            </button>
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e4e7eb] bg-white text-[#3b4450] transition hover:bg-[#f4f9ff]"
            >
              <NotificationIcon size={18} />
            </div>
            <div className="flex items-center gap-3 rounded-full border border-[#e4e7eb] bg-white px-2 py-1.5">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#f2d4ce] via-[#d7b7a0] to-[#7d8dae] text-[10px] font-bold text-white">
                {userAvatar ? <img src={userAvatar} alt={userName} className="h-full w-full object-cover" /> : userName.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase()}
              </div>
              <span className="mr-1 text-[15px] font-medium text-[#2c3138]">
                {userName}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1360px] px-5 py-8 md:px-8">
        <div className="mb-6 flex items-center gap-3">
          {tabLabels.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-xl border px-5 py-3 text-[16px] font-semibold transition ${
                activeTab === tab.key
                  ? "border-[#016EA6] bg-[#016EA6] text-white"
                  : "border-[#e3e5e8] bg-transparent text-[#5b6670] hover:bg-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-[28px] border border-[#e6e8eb] bg-[#f7f7f8]">
          <div className="grid min-h-[780px] grid-cols-1 xl:grid-cols-[1.58fr_0.92fr]">
            <section className="border-r border-[#edf0f3] bg-[#f8f8f9]">
              <div className="space-y-0">
                {isLoading ? (
                  <div className="flex h-60 items-center justify-center text-[#6b7280]">Loading notifications...</div>
                ) : filteredNotifications.length > 0 ? (
                  filteredNotifications.map((item) => (
                    <NotificationRow
                      key={item.id}
                      item={item}
                      selected={selectedNotification?.id === item.id}
                      onClick={() => setSelectedNotificationId(item.id)}
                    />
                  ))
                ) : (
                  <div className="flex h-60 items-center justify-center text-[#6b7280]">
                    No notifications available.
                  </div>
                )}
              </div>
            </section>

            <aside className="bg-[#f4f5f6] p-4">
              <div className="rounded-[26px] border border-[#e7eaee] bg-[#f8f8f8] p-4">
                <div className="flex items-center justify-between gap-2 rounded-full bg-[#eef1f4] p-1">
                  <button
                    type="button"
                    className="flex-1 rounded-full bg-[#016EA6] px-4 py-2 text-[13px] font-semibold text-white"
                  >
                    Unread
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-full px-4 py-2 text-[13px] font-medium text-[#5f6975]"
                  >
                    Archives
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-full px-4 py-2 text-[13px] font-medium text-[#5f6975]"
                  >
                    Blocked
                  </button>
                </div>

                <div className="mt-5 rounded-full border border-[#e3e6eb] bg-[#f1f3f5] px-4 py-3 text-[#6d7681]">
                  <div className="flex items-center gap-3">
                    <Search className="h-4 w-4 text-[#6d7681]" />
                    <input
                      type="text"
                      value=""
                      readOnly
                      placeholder="Search message"
                      className="w-full border-0 bg-transparent text-[14px] text-[#495260] placeholder:text-[#8a929b] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-5 space-y-0">
                  {messages.length > 0 ? messages.map((chat, index) => (
                    <div
                      key={chat.id}
                      className={`flex items-center gap-3 border-b border-[#edf0f2] px-2 py-4 ${
                        index === 0 ? "pt-2" : ""
                      }`}
                    >
                      <div className={`flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br ${avatarPalette[index % avatarPalette.length]} text-[10px] font-bold text-white`}>
                        {chat.avatar ? <img src={chat.avatar} alt="" className="h-full w-full object-cover" /> : chat.sender.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-[15px] font-medium text-[#2a3038]">
                            {chat.sender}
                          </p>
                          <span className="text-[11px] text-[#818892]">{chat.time}</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between gap-3">
                          <p className="line-clamp-2 text-[13px] leading-5 text-[#4e5865]">
                            {chat.preview}
                          </p>
                          <span className="h-3.5 w-3.5 shrink-0 rounded-full bg-[#016EA6]" />
                        </div>
                      </div>
                    </div>
                  )) : <div className="py-10 text-center text-[13px] text-[#6d7681]">No messages available.</div>}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;
