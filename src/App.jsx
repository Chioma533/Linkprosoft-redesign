import LandingPage from './pages/LandingPage';
import SignupPage from './pages/auth/SignupPage';
import LoginPage from "./pages/auth/LoginPage"
import DashboardPage from './pages/professionals/DashboardPage';
import PrivateRoutes from './routes/PrivateRoutes';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white text-gray-900 font-sans">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route element={<PrivateRoutes />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>
          </Routes>
          <Toaster position="top-right" reverseOrder={false} />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;