export const getUserRole = (user) => user?.role || "professional";

export const isUserVerified = (user) =>
  Boolean(
    user?.isVerified ||
    user?.is_verified ||
    user?.verificationStatus === "verified" ||
    user?.verification_status === "verified"
  );

export const getUserDisplayName = (user, role, professionalFallback = "Queen Michael") =>
  user?.fullName || user?.full_name || (role === "employer" ? "Employer User" : professionalFallback);

export const getUnreadMessagesCount = (messages) => (messages || []).filter((message) => message.unread).length;

export const getUnreadNotificationsCount = (notifications) =>
  (notifications || []).filter((notification) => notification.unread || !notification.is_read).length;