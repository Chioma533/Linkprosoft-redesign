import LandingPage from './pages/LandingPage';
import DefaultBuyerScreen from './pages/buyer/DefaultBuyerScreen';
import DefaultProfessionalScreen from './pages/professional/DefaultProfessionalScreen';
import SignupPage from './pages/auth/SignupPage';
import LoginPage from "./pages/auth/LoginPage";
import ProfessionalDashboardPage from './pages/professionals/ProfessionalDashboardPage';
import PrivateRoutes from './routes/PrivateRoutes';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import EmployerDashboardPage from './pages/employer/EmployerDashboardPage';
import AdminDahboardPage from './pages/admin/AdminDahboardPage';
import GoogleCallbackPage from './pages/auth/GoogleCallbackPage';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white text-gray-900 font-sans">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />

            <Route element={<PrivateRoutes allowedRoles={['employer']} />}>
              <Route path="/home" element={<DefaultBuyerScreen />} />
              <Route path="/employer/dashboard" element={<EmployerDashboardPage />} />
            </Route>

            <Route element={<PrivateRoutes allowedRoles={['professional']} />}>
              <Route path="/professional/home" element={<DefaultProfessionalScreen />} />
              <Route path="/professional/dashboard" element={<ProfessionalDashboardPage />} />
            </Route>

            <Route element={<PrivateRoutes allowedRoles={['admin']} />}>
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