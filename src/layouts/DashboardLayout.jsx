import React, { useEffect, useState } from "react";
import DashboardSidebar from "../components/layout/DashboardSidebar";
import DashboardNavbar from "../components/layout/DashboardNavbar";
import { useDashboardStore } from "../store/dashboardStore";
import { useAuthStore } from "../store/authStore";
import { Home, Search, Briefcase, FileText, Wallet } from "lucide-react";
import { debugLog } from "../utils/debugLogger";
import DashboardLoadingScreen from "../components/common/preloader/DashboardLoadingScreen";

const DashboardLayout = ({ children }) => {
  const { activeTab, setActiveTab, fetchDashboardData, isLoading } = useDashboardStore();
  const { user } = useAuthStore();
  const role = user?.role || "professional";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /* ── Per-tab skeleton display ────────────────────────────────────────── *
   * showSkeleton starts true (skeleton on first paint) and is reset to    *
   * true every time the user switches tabs. A 2.5 s timer then clears it. *
   * This guarantees every subpage — initial load AND every tab switch —   *
   * shows its matching skeleton for at least 2.5 s before content.        */
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    // Persist token debug info so it survives redirects / page reloads
    try {
      const token = localStorage.getItem("token");
      debugLog("token_before_fetchDashboardData", token);
    } catch (e) {
      debugLog("token_before_fetchDashboardData_error", String(e));
    }

    // Also log fetch start/finish for more context
    debugLog("fetchDashboardData_start", { timestamp: new Date().toISOString() });
    fetchDashboardData()
      .then(() => debugLog("fetchDashboardData_success", { timestamp: new Date().toISOString() }))
      .catch((err) => debugLog("fetchDashboardData_failure", { timestamp: new Date().toISOString(), error: (err && err.message) || String(err) }));
  }, [fetchDashboardData]);

  /* Fires on mount (initial tab) AND on every subsequent tab switch */
  useEffect(() => {
    setShowSkeleton(true);
    const timer = setTimeout(() => setShowSkeleton(false), 2500);
    return () => clearTimeout(timer);   // cancel if tab changes before 2.5 s
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Automatically collapse sidebar after selecting a tab
    setIsSidebarOpen(false);
  };

  /* ── Skeleton gate ───────────────────────────────────────────────────── *
   * Show skeleton when the tab-switch timer is still running OR the API    *
   * fetch is still in flight. Whichever resolves last wins.                */
  if (showSkeleton || isLoading) {
    return <DashboardLoadingScreen subpage={activeTab} />;
  }

  return (
    <div className="flex bg-[#EBF3FA]/30 h-screen text-gray-800 font-sans relative overflow-hidden">
      {/* Backdrop overlay for mobile when sidebar is expanded */}
      <div 
        className={`fixed inset-0 bg-black/45 backdrop-blur-xs z-40 md:hidden transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

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
          isOpen={isSidebarOpen}
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        />

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto pb-24 md:pb-8">
          {children}
        </main>

        {/* Bottom Navigation for Mobile */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 flex items-center justify-around py-2 px-1 shadow-lg md:hidden">
          {(role === "employer"
            ? [
                { id: "overview",              name: "Overview",     icon: Home     },
                { id: "browse-professionals",  name: "Browse jobs",  icon: Search   },
                { id: "manage-jobs",            name: "My Jobs",      icon: Briefcase},
                { id: "messages",              name: "Applications", icon: FileText },
                { id: "wallet",                name: "Wallet",       icon: Wallet   },
              ]
            : [
                { id: "overview",      name: "Overview",      icon: Home     },
                { id: "browse-jobs",   name: "Browse jobs",   icon: Search   },
                { id: "my-jobs",       name: "My Jobs",       icon: Briefcase},
                { id: "applications",  name: "Applications",  icon: FileText },
                { id: "wallet",        name: "Wallet",         icon: Wallet   },
              ]
          ).map((item) => {
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
