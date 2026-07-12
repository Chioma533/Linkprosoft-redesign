import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (

    <div className="min-h-screen bg-[#EBF3FA]/30 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
        <p className="text-gray-500 mb-6">
          Welcome back, <span className="font-semibold text-[#016EA6]">{user?.fullName || "User"}</span>! You have successfully signed up and logged into Linkprosoft.
        </p>

        
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => navigate("/")}
            variant="secondary"
            className="w-full !rounded-full py-3"
          >
            Go to Home
          </Button>
          <Button
            onClick={handleLogout}
            className="w-full !rounded-full !bg-red-500 hover:!bg-red-600 text-white py-3"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
