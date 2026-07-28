import MessageCard from "./MessageCard";

const MessageList = ({
  messages,
  limit = 4,
  filter = "unread",
  onMessageClick,
}) => {
  const filtered =
    filter === "unread" ? messages.filter((m) => m.unread) : messages;

  return (
    <div className="space-y-4">
      {filtered.slice(0, limit).map((message) => (
        <MessageCard
          key={message.id}
          message={message}
          onClick={onMessageClick}
        />
      ))}
    </div>
  );
};

export default MessageList;
