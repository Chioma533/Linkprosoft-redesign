import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboardStore } from "../../store/dashboardStore";
import EmployerProfileSubpage from "./EmployerProfileSubpage";

const EmployerPublicProfilePage = () => {
  const { employerId } = useParams();
  const navigate = useNavigate();
  const { activeTab, setActiveTab } = useDashboardStore();
  const previousTab = useRef(activeTab);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      setActiveTab("profile");
      return;
    }

    if (activeTab !== "profile") {
      previousTab.current = activeTab;
      navigate("/professional/dashboard", { replace: true });
    }
  }, [activeTab, navigate, setActiveTab]);

  useEffect(() => {
    return () => setActiveTab(previousTab.current);
  }, [setActiveTab]);

  return (
    <DashboardLayout>
      <EmployerProfileSubpage employerId={employerId} />
    </DashboardLayout>
  );
};

export default EmployerPublicProfilePage;
