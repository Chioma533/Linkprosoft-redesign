import React, { useEffect, useState } from "react";
import DashboardSidebar from "../components/layout/DashboardSidebar";
import DashboardNavbar from "../components/layout/DashboardNavbar";
import { useDashboardStore } from "../store/dashboardStore";
import { useAuthStore } from "../store/authStore";
import { Home, Search, Briefcase, FileText, Wallet } from "lucide-react";
import { DashboardContentSkeleton } from "../components/common/preloader/DashboardLoadingScreen";

const DashboardLayout = ({ children }) => {
  const { activeTab, setActiveTab, fetchDashboardData, isLoading, error } = useDashboardStore();
  const { user } = useAuthStore();
  const role = user?.role || "professional";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // The tab timer is retained only for employers; professionals follow request state.
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  /* Fires on mount (initial tab) AND on every subsequent tab switch */
  useEffect(() => {
    if (role === "professional") {
      setShowSkeleton(false);
      return undefined;
    }

    setShowSkeleton(true);
    const timer = setTimeout(() => setShowSkeleton(false), 2500);
    return () => clearTimeout(timer);   // cancel if tab changes before 2.5 s
  }, [activeTab, role]);

  const shouldShowSkeleton = isLoading || (role !== "professional" && showSkeleton);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex bg-[#EBF3FA]/30 h-screen text-gray-800 font-sans relative overflow-hidden">
      {/* Backdrop overlay for mobile when sidebar is expanded */}
      <div 
        className={`fixed inset-0 bg-black/45 backdrop-blur-xs z-40 md:hidden transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar Component - stays mounted and intact across tab switches */}
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

        {/* Viewport Content - renders subpage skeleton or real content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto pb-24 md:pb-8">
          {shouldShowSkeleton ? (
            <DashboardContentSkeleton subpage={activeTab} />
          ) : error && role === "professional" ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
              <p className="text-sm font-semibold text-gray-800">We couldn’t load your dashboard.</p>
              <p className="mt-1 text-xs text-gray-500">{error}</p>
              <button
                type="button"
                onClick={fetchDashboardData}
                className="mt-4 rounded-full bg-[#016EA6] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#061EA6]"
              >
                Try again
              </button>
            </div>
          ) : (
            children
          )}
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
