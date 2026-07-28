import MessageAvatar from "../common/Avatar";

const MessageCard = ({ message, onClick }) => {
  return (
    <div
      onClick={() => onClick?.(message)}
      className="flex items-center justify-between p-2 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <MessageAvatar name={message.sender} avatar={message.avatar} />

        <div className="min-w-0">
          <h4 className="text-xs font-bold text-gray-800 leading-snug">
            {message.sender}
          </h4>

          <p className="text-[10px] text-gray-400 truncate mt-0.5">
            {message.text}
          </p>
        </div>
      </div>

      {message.unread && (
        <span className="w-2.5 h-2.5 bg-[#016EA6] rounded-full ring-2 ring-white shrink-0" />
      )}
    </div>
  );
};

export default MessageCard;
