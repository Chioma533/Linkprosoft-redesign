import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import { getDashboardRoute } from "../../utils/getDashboardRoute";
import { API_BASE_URL } from "../../utils/apiPaths";
import debugLog from "../../utils/debugLogger.js";
import { clearPersistedAuth, getCookieSessionUser } from "../../utils/cookieSession";
import Preloader from "../../components/common/preloader/PreLoader";

const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;
    const verifyGoogleSignIn = async () => {
      try {
        const userData = await getCookieSessionUser(fetch, API_BASE_URL);
        setAuth({ user: userData });
        debugLog("Google sign-in verified successfully", { userId: userData?.id });

        toast.success('Signed in successfully');
        const dashboardRoute = getDashboardRoute(userData?.role ?? 'professional');
        debugLog("Redirecting to dashboard route:", dashboardRoute);
        window.location.href = dashboardRoute; // Use window.location.href to ensure a full page reload
      } catch (error) {
        clearPersistedAuth();
        console.error('Google sign-in verification failed:', error);
        toast.error('We could not complete Google sign-in. Please try again.');
        debugLog('Failed to verify Google sign-in');
        navigate('/login', { replace: true });
      }
    };

    verifyGoogleSignIn();
  }, [navigate, setAuth]);

  return <Preloader />;
};

export default GoogleCallbackPage;
