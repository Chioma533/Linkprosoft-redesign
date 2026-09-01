import React, { useState } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Scale, 
  Wallet, 
  Menu, 
  X, 
  LogOut, 
  Bell, 
  Search,
  ChevronLeft,
  ChevronDown,
  MessageSquare,
  BriefcaseBusiness
} from "lucide-react";
import Logo from "../../../public/temp_figma_mockups/linkprosoft-logo.png";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

// Subpages
import AdminOverviewSubpage from "./AdminOverviewSubpage";
import AdminUsersSubpage from "./AdminUsersSubpage";
import AdminVerificationSubpage from "./AdminVerificationSubpage";
import AdminJobsSubpage from "./AdminJobsSubpage";
import AdminDisputesSubpage from "./AdminDisputesSubpage";
import AdminPaymentsSubpage from "./AdminPaymentsSubpage";
import AdminSettingsSubpage from "./AdminSettingsSubpage";

const AdminDahboardPage = () => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("jobs"); // default view tab
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // System admin notifications
  const [notifications, setNotifications] = useState([
    { id: 1, text: "David Kim submitted Engineering Diploma verification.", time: "10m ago", read: false },
    { id: 2, text: "New Dispute Raised: DISP-801 on contract JOB-703.", time: "1h ago", read: false },
    { id: 3, text: "Escrow release pending for JOB-701 milestones.", time: "2h ago", read: true },
  ]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (e) {
      navigate("/login");
    }
  };

  // Nav Items matching exact sidebar list in the uploaded UI design
  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "User Management", icon: Users },
    { id: "jobs", label: "Jobs Management", icon: BriefcaseBusiness },
    { id: "disputes", label: "Dispute", icon: Scale },
    { id: "finance", label: "Finance", icon: Wallet },
  ];

  const getSubpageTitle = () => {
    switch (activeTab) {
      case "overview":
        return "Overview";
      case "users":
        return "User Management";
      case "verifications":
        return "Verification Requests";
      case "jobs":
        return "Jobs Management";
      case "disputes":
        return "Disputes & Reviews";
      case "payments":
      case "wallet":
      case "finance":
        return "Finance";
      case "settings":
        return "System Settings";
      default:
        return "Jobs Management";
    }
  };

  const renderActiveSubpage = () => {
    switch (activeTab) {
      case "overview":
        return <AdminOverviewSubpage onNavigate={(tab) => setActiveTab(tab)} />;
      case "users":
        return <AdminUsersSubpage onNavigate={(tab) => setActiveTab(tab)} />;
      case "verifications":
        return <AdminVerificationSubpage />;
      case "jobs":
        return <AdminJobsSubpage onNavigate={(tab) => setActiveTab(tab)} />;
      case "disputes":
        return <AdminDisputesSubpage onNavigate={(tab) => setActiveTab(tab)} />;
      case "payments":
      case "wallet":
      case "finance":
        return <AdminPaymentsSubpage onNavigate={(tab) => setActiveTab(tab)} />;
      case "settings":
        return <AdminSettingsSubpage />;
      default:
        return <AdminJobsSubpage onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsSidebarOpen(false);
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-gray-800 font-sans relative overflow-hidden">
      {/* Mobile Backdrop overlay for drawer sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation (No right border) */}
      <aside 
        className={`bg-[#F8FAFC] border-none flex flex-col h-screen z-50 transition-all duration-300 ease-in-out
          fixed inset-y-0 left-0 w-64
          md:sticky md:top-0 md:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Sidebar Logo */}
        <div className="py-7 px-8 flex items-center justify-between border-none">
          <div className="flex items-center gap-3">
            <img src={Logo} className="w-10 h-10 object-contain shrink-0" alt="Linkprosoft" />
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 md:hidden cursor-pointer shrink-0 border-none"
            title="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items list matching exact UI screenshot */}
        <nav className="flex-1 py-4 px-5 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === "finance" && (activeTab === "payments" || activeTab === "wallet"));
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border-none select-none relative ${
                  isActive 
                    ? "bg-[#016EA6] text-white shadow-xs" 
                    : "text-gray-500 hover:bg-gray-100/70 hover:text-gray-900"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isActive ? "scale-110" : ""}`} />
                <span className="whitespace-nowrap">{item.label}</span>
                {/* Active white vertical bar indicator on right edge */}
                {isActive && (
                  <span className="w-1 h-5 bg-white rounded-full shrink-0 ml-auto" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User profile / Logout bottom row */}
        <div className="p-5 border-none space-y-3">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-full bg-blue-50 text-[#016EA6] flex items-center justify-center font-extrabold text-xs shrink-0 select-none">
              A
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-gray-800 truncate">{user?.name || "System Admin"}</h4>
              <p className="text-[9px] text-gray-400 mt-0.5 truncate">{user?.email || "admin@linkprosoft.com"}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-white hover:bg-rose-50 hover:text-rose-600 rounded-xl text-xs font-bold text-gray-500 transition-all cursor-pointer border-none shadow-xs"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar matching exact UI screenshot (No bottom border!) */}
        <header className="bg-[#F8FAFC] border-none h-16 px-4 sm:px-6 md:px-8 flex items-center justify-between shrink-0 relative">
          <div className="flex items-center gap-3">
            {/* Hamburger for mobile */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 md:hidden cursor-pointer shrink-0 border-none"
              title="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Circular/rounded Back button */}
            <button
              onClick={() => setActiveTab("overview")}
              className="w-8 h-8 rounded-xl bg-gray-200/60 hover:bg-gray-200 text-gray-600 flex items-center justify-center cursor-pointer transition-colors border-none"
              title="Back to Overview"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Subpage Title */}
            <h2 className="text-base sm:text-lg font-bold text-gray-800 tracking-tight capitalize select-none ml-1">
              {getSubpageTitle()}
            </h2>
          </div>

          {/* Center Search Pill Bar */}
          <div className="relative hidden md:flex items-center">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search anything" 
              className="pl-10 pr-4 py-2 bg-white border-none shadow-xs rounded-full text-xs font-medium text-gray-700 outline-none w-72 lg:w-96 transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-[#016EA6]/20"
            />
          </div>

          {/* Right Header Controls: Messages, Notifications, Profile Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Chat Icon */}
            <button className="p-2 text-gray-500 hover:text-gray-800 rounded-xl hover:bg-gray-100/60 transition-colors cursor-pointer border-none">
              <MessageSquare className="w-4.5 h-4.5 stroke-[1.8]" />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 text-gray-500 hover:text-gray-800 rounded-xl hover:bg-gray-100/60 relative cursor-pointer border-none"
                title="Notifications"
              >
                <Bell className="w-4.5 h-4.5 stroke-[1.8]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
                )}
              </button>

              {/* Notification Drawer popup */}
              {isNotificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white border-none rounded-2xl p-4 shadow-xl z-50 space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <h4 className="text-xs font-extrabold text-gray-800">Notifications</h4>
                      <button 
                        onClick={markAllRead}
                        className="text-[10px] font-bold text-[#016EA6] hover:underline"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className="text-xs font-semibold leading-relaxed border-b border-gray-50 pb-2 last:border-0">
                          <p className={n.read ? "text-gray-500 font-medium" : "text-gray-800"}>{n.text}</p>
                          <span className="text-[9px] text-gray-400 block mt-1">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Dropdown: Avatar + Name + Dropdown Arrow */}
            <div className="flex items-center gap-2.5 ml-2 cursor-pointer group select-none">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                alt="Elvis Chimannda" 
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
              <span className="text-xs font-bold text-gray-800 hidden sm:inline group-hover:text-[#016EA6] transition-colors">
                Elvis Chimannda
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            </div>
          </div>
        </header>

        {/* Scrollable Viewport Page */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-[1400px] w-full mx-auto pb-24 md:pb-8">
          {renderActiveSubpage()}
        </main>
      </div>
    </div>
  );
};

export default AdminDahboardPage;