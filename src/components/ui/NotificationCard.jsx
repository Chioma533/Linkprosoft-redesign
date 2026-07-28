import { FiCheckCircle } from "react-icons/fi";

const NotificationCard = ({ notification }) => {
  return (
    <div className="flex items-start justify-between gap-3 p-2 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-50 text-[#016EA6] rounded-xl shrink-0 mt-0.5">
          <FiCheckCircle className="w-4 h-4" />
        </div>

        <div>
          <h4 className="text-xs font-bold text-gray-800 leading-snug">
            {notification.title}
          </h4>

          <p className="text-[10px] text-gray-400 mt-0.5">
            {notification.body}
          </p>
        </div>
      </div>

      {notification.unread && (
        <span className="w-2 h-2 bg-[#016EA6] rounded-full ring-2 ring-white shrink-0 mt-2" />
      )}
    </div>
  );
};

export default NotificationCard;
