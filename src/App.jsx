import LandingPage from "./pages/LandingPage";
import Waitlist from "./pages/Waitlist";
import DefaultBuyerScreen from "./pages/buyer/DefaultBuyerScreen";
import DefaultProfessionalScreen from "./pages/professional/DefaultProfessionalScreen";
import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import ProfessionalDashboardPage from "./pages/professionals/ProfessionalDashboardPage";
import PrivateRoutes from "./routes/PrivateRoutes";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import EmployerDashboardPage from "./pages/employer/EmployerDashboardPage";
import AdminDahboardPage from "./pages/admin/AdminDahboardPage";
import GoogleCallbackPage from "./pages/auth/GoogleCallbackPage";
import TestPreloaderPage from "./pages/TestPreloaderPage";
import PublicBuyerScreen from "./pages/buyer/PublicBuyerScreen";
import PublicProfessionalScreen from "./pages/professional/PublicProfessionalScreen";
import CommunityPage from "./pages/CommunityPage";
import VerificationPage from "./pages/verification/VerificationPage";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white text-gray-900 font-sans">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/waitlist" element={<Waitlist />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
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

            <Route path="/verification" element={<VerificationPage />} />


            <Route element={<PrivateRoutes allowedRoles={["employer"]} />}>
              <Route path="/home" element={<DefaultBuyerScreen />} />
              <Route
                path="/employer/dashboard"
                element={<EmployerDashboardPage />}
              />
              <Route path="/employer/verification" element={<VerificationPage />} />
            </Route>

            {/* professional routes */}

            <Route element={<PrivateRoutes allowedRoles={["professional"]} />}>
              <Route
                path="/professional/home"
                element={<DefaultProfessionalScreen />}
              />
              <Route
                path="/professional/dashboard"
                element={<ProfessionalDashboardPage />}
              />
              <Route path="/professional/verification" element={<VerificationPage />} />
            </Route>

            <Route element={<PrivateRoutes allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<AdminDahboardPage />} />
            </Route>
          </Routes>
          <Toaster position="top-center" reverseOrder={false} />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
