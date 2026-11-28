import LandingPage from "./pages/LandingPage";
import Waitlist from "./pages/Waitlist";
import DefaultBuyerScreen from "./pages/buyer/DefaultBuyerScreen";
import DefaultProfessionalScreen from "./pages/professional/DefaultProfessionalScreen";
import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import ProfessionalDashboardPage from "./pages/professionals/ProfessionalDashboardPage";
import PrivateRoutes from "./routes/PrivateRoutes";
import { Route, BrowserRouter as Router, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAuthStore } from "./store/authStore";
import { toast, Toaster } from "react-hot-toast";
import EmployerDashboardPage from "./pages/employer/EmployerDashboardPage";
import EmployerPublicProfilePage from "./pages/employer/EmployerPublicProfilePage";
import AdminDahboardPage from "./pages/admin/AdminDahboardPage";
import GoogleCallbackPage from "./pages/auth/GoogleCallbackPage";
import TestPreloaderPage from "./pages/TestPreloaderPage";
import PublicBuyerScreen from "./pages/buyer/PublicBuyerScreen";
import PublicProfessionalScreen from "./pages/professional/PublicProfessionalScreen";
import CommunityPage from "./pages/CommunityPage";
import ManageJobsPage from "./pages/buyer/ManageJobsPage";
import PaymentScreen from "./pages/buyer/PaymentScreen";
import VerificationPage from "./pages/verification/VerificationPage";
import BadgeVerificationPage from "./pages/verification/BadgeVerificationPage";
import NotificationsPage from "./pages/NotificationsPage";
import PublicProfessionalProfile from "./pages/professional/PublicProfessionalProfile";
import EmployerTrendingProfessionalsPage from "./pages/employer/EmployerTrendingProfessionalsPage";
import LegalPage from "./pages/LegalPage";
import NotFoundPage from "./pages/NotFoundPage";
import { SESSION_EXPIRED_EVENT } from "./utils/sessionExpiry";

const SessionExpiryHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const handlingExpiry = useRef(false);

  useEffect(() => {
    if (isAuthenticated) handlingExpiry.current = false;
  }, [isAuthenticated]);

  useEffect(() => {
    const handleSessionExpired = () => {
      if (handlingExpiry.current) return;
      handlingExpiry.current = true;
      useAuthStore.getState().expireSession();
      toast.error("Your session has expired. Please log in again.", {
        id: "session-expired",
      });
      navigate("/login", {
        replace: true,
        state: {
          from: `${location.pathname}${location.search}${location.hash}`,
        },
      });
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
  }, [location, navigate]);

  return null;
};
const HomeRouteResolver = () => {
  const { user } = useAuthStore();
  if (user?.role === "professional") {
    return <DefaultProfessionalScreen />;
  }
  return <DefaultBuyerScreen />;
};

const App = () => {
  const { refreshCurrentUser } = useAuthStore();

  useEffect(() => {
    // Restore from the HttpOnly cookie after a reload; there is no bearer token
    // in localStorage to use as an authentication source.
    refreshCurrentUser();
  }, [refreshCurrentUser]);

  return (
    <Router>
        <SessionExpiryHandler />
        <div className="app-shell min-h-screen bg-white text-gray-900 font-sans">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/waitlist" element={<Waitlist />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/privacy" element={<LegalPage type="privacy" />} />
            <Route path="/terms" element={<LegalPage type="terms" />} />

            <Route
              path="/auth/google/callback"
              element={<GoogleCallbackPage />}
            />
            <Route path="/test-preloader" element={<TestPreloaderPage />} />
            <Route
              path="/browse-professionals"
              element={<PublicBuyerScreen />}
            />
            <Route
              path="/professionals"
              element={<PublicProfessionalScreen />}
            />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/payment-screen" element={<PaymentScreen />} />

            <Route path="/verification" element={<VerificationPage />} />
            <Route path="/badge-verification" element={<BadgeVerificationPage />} />

            <Route element={<PrivateRoutes />}>
              <Route path="/notifications" element={<NotificationsPage />} />
            </Route>

            <Route element={<PrivateRoutes allowedRoles={["employer", "professional"]} />}>
              <Route path="/home" element={<HomeRouteResolver />} />
            </Route>

            <Route element={<PrivateRoutes allowedRoles={["employer"]} />}>
              <Route
                path="/trending"
                element={<EmployerTrendingProfessionalsPage />}
              />
              <Route
                path="/employer/dashboard"
                element={<EmployerDashboardPage />}
              />
              <Route
                path="/employer/verification"
                element={<VerificationPage />}
              />
              <Route path="/manage-jobs" element={<ManageJobsPage />} />
            </Route>

            {/* professional routes */}

            <Route element={<PrivateRoutes allowedRoles={["professional"]} />}>
              <Route
                path="/employers/:employerId"
                element={<EmployerPublicProfilePage />}
              />
              <Route
                path="/professional/home"
                element={<DefaultProfessionalScreen />}
              />
              <Route
                path="/professional/dashboard"
                element={<ProfessionalDashboardPage />}
              />
              <Route
                path="/professional/verification"
                element={<VerificationPage />}
              />
            </Route>

            <Route element={<PrivateRoutes allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<AdminDahboardPage />} />
            </Route>

            {/* Keep this after every fixed route: a public profile owns one path segment. */}
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/:slug" element={<PublicProfessionalProfile />} />
          </Routes>
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              // Apply to all toasts
              className: "my-global-toast",
              style: {
                background: "var(--app-surface)",
                color: "var(--app-text-secondary)",
                borderRadius: "18px",
                padding: "20px",
              },

              success: {
                duration: 5000,
              },
            }}
          />
        </div>
    </Router>
  );
};

export default App;
