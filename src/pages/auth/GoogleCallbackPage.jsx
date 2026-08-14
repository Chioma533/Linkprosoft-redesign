import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import { getDashboardRoute } from "../../utils/getDashboardRoute";
import { API_BASE_URL } from "../../utils/apiPaths";
import debugLog from "../../utils/debugLogger.js";
import Preloader from "../../components/common/preloader/PreLoader";

const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const verifyGoogleSignIn = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to verify user');
        }

        const responseBody = await response.json();
        const userData = responseBody.data?.user || responseBody.user || responseBody.data || responseBody;
        const token = responseBody.token || responseBody.accessToken || localStorage.getItem("token");

        setAuth({ token: token, user: userData });
        debugLog("Google sign-in verified successfully", { user: userData, token });

        toast.success('Signed in successfully');
        const dashboardRoute = getDashboardRoute(userData?.role ?? 'professional');
        debugLog("Redirecting to dashboard route:", dashboardRoute);
        window.location.href = dashboardRoute; // Use window.location.href to ensure a full page reload
      } catch (error) {
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