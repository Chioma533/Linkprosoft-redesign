import { FiCheckCircle } from "react-icons/fi";

const NotificationCard = ({ notification }) => {
  return (
    <div className="bg-white p-3 rounded-[12px] border border-gray-100 flex items-start justify-between gap-3 transition-colors cursor-pointer group">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 bg-[#016EA6] text-white rounded-full flex items-center justify-center shrink-0 mt-0.5">
          <FiCheckCircle className="w-5 h-5" />
        </div>

        <div>
          <h4 className="text-sm font-bold text-gray-800 leading-snug">
            {notification.title}
          </h4>

          <p className="text-xs text-gray-400 mt-0.5">
            {notification.body}
          </p>
        </div>
      </div>

      {notification.unread && (
        <span className="w-3 h-3 bg-[#016EA6] rounded-full shrink-0 mt-2" />
      )}
    </div>
  );
};

export default NotificationCard;
