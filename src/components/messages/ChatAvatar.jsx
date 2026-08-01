import React from "react";
import { AVATAR_COLORS } from "../../constants/messagesData";

const ChatAvatar = ({ initials, colorIdx = 0, online = false, size = "md" }) => {
  const sizeClasses =
    size === "sm"
      ? "w-9 h-9 text-xs"
      : size === "lg"
      ? "w-12 h-12 text-sm"
      : "w-10 h-10 text-xs";
  const dotClasses = size === "sm" ? "w-2 h-2 border" : "w-2.5 h-2.5 border-2";

  return (
    <div className="relative shrink-0">
      <div
        className={`${sizeClasses} ${
          AVATAR_COLORS[colorIdx % AVATAR_COLORS.length]
        } rounded-full flex items-center justify-center font-bold`}
      >
        {initials}
      </div>
      {online && (
        <span
          className={`absolute bottom-0 right-0 ${dotClasses} bg-emerald-400 border-white rounded-full`}
        />
      )}
    </div>
  );
};

export default ChatAvatar;
