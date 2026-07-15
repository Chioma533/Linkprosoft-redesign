import React, { useEffect } from "react";
import DashboardSidebar from "../components/layout/DashboardSidebar";
import DashboardNavbar from "../components/layout/DashboardNavbar";
import { useDashboardStore } from "../store/dashboardStore";

const DashboardLayout = ({ children }) => {
  const { activeTab, setActiveTab, fetchDashboardData } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="flex bg-[#EBF3FA]/30 min-h-screen text-gray-800 font-sans">
      {/* Sidebar Component */}
      <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar Component */}
        <DashboardNavbar title={activeTab} />

        {/* Viewport Content */}
        <main className="flex-1 p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
