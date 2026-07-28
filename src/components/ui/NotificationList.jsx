import NotificationCard from "./NotificationCard";

const NotificationList = ({
  notifications,
  limit = 3,
}) => {
  return (
    <div className="space-y-4">
      {notifications
        .slice(0, limit)
        .map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
          />
        ))}
    </div>
  );
};

export default NotificationList;