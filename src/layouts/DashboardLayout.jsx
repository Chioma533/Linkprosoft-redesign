import React, { useEffect, useState } from "react";
import DashboardSidebar from "../components/layout/DashboardSidebar";
import DashboardNavbar from "../components/layout/DashboardNavbar";
import { useDashboardStore } from "../store/dashboardStore";
import { Home, Search, Briefcase, FileText, Wallet } from "lucide-react";

const DashboardLayout = ({ children }) => {
  const { activeTab, setActiveTab, fetchDashboardData } = useDashboardStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Automatically collapse sidebar after selecting a tab
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex bg-[#EBF3FA]/30 h-screen text-gray-800 font-sans relative overflow-hidden">
      {/* Backdrop overlay for mobile when sidebar is expanded */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/45 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <DashboardSidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Navbar Component */}
        <DashboardNavbar 
          title={activeTab} 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        />

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto pb-24 md:pb-8">
          {children}
        </main>

        {/* Bottom Navigation for Mobile */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 flex items-center justify-around py-2 px-1 shadow-lg md:hidden">
          {[
            { id: "overview", name: "Overview", icon: Home },
            { id: "browse-jobs", name: "Browse jobs", icon: Search },
            { id: "my-jobs", name: "My Jobs", icon: Briefcase },
            { id: "applications", name: "Applications", icon: FileText },
            { id: "wallet", name: "Wallet", icon: Wallet },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 flex-1 cursor-pointer transition-colors duration-200
                  ${isActive ? "text-[#016EA6]" : "text-gray-400 hover:text-gray-600"}`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""}`} />
                <span className="text-[10px] mt-1 font-medium">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
