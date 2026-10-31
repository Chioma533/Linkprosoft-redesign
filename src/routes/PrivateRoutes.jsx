import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const PrivateRoutes = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user, isSessionLoading } = useAuthStore();

  // Wait for cookie-backed /me restoration before deciding this is a guest.
  if (isSessionLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If no roles are specified, only authentication is required.
  if (allowedRoles.length === 0) {
    return <Outlet />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
    // or navigate to the correct dashboard instead
  }

  return <Outlet />;
};

export default PrivateRoutes;
