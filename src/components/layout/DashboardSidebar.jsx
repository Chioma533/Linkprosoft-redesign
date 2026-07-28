import {
  Home,
  Search,
  Briefcase,
  FileText,
  Calendar,
  Wallet,
  CheckSquare,
  X,
  Users,
  Bell
} from "lucide-react";
import Logo from "../../assets/images/logo2.jpg";
import { useAuthStore } from "../../store/authStore";
import { useDashboardStore } from "../../store/dashboardStore";

const DashboardSidebar = ({ activeTab, onTabChange, isOpen, onClose }) => {
  const { user } = useAuthStore();
  const { notifications } = useDashboardStore();
  const role = user?.role || "professional";
  const unreadNotificationsCount = notifications?.filter(n => n.unread).length || 0;

  const getMenuItems = () => {
    if (role === "employer") {
      return [
        { id: "overview", name: "Overview", icon: Home },
        { id: "manage-jobs", name: "Manage jobs", icon: Briefcase },
        { id: "browse-professionals", name: "Browse Professionals", icon: Users },
        { id: "wallet", name: "Wallet", icon: Wallet },
      ];
    }
    return [
      { id: "overview", name: "Overview", icon: Home },
      { id: "browse-jobs", name: "Browse jobs", icon: Search },
      { id: "my-jobs", name: "My jobs", icon: Briefcase },
      { id: "applications", name: "Applications", icon: FileText },
      { id: "schedule", name: "Schedule", icon: Calendar },
      { id: "wallet", name: "Wallet", icon: Wallet },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Sidebar Container */}
      <div 
        className={`bg-white border-r border-gray-100 flex flex-col h-screen transition-all duration-300 ease-in-out z-50
          ${isOpen 
            ? "fixed inset-y-0 left-0 w-64 shadow-2xl md:shadow-none md:sticky md:top-0 flex" 
            : "hidden md:flex sticky top-0 w-16"
          }
        `}
      >
        {/* Top Logo */}
        <div className={`py-6 flex items-center border-b border-gray-50 transition-all duration-300
          ${isOpen ? "px-6 justify-between" : "px-3 justify-center"}
        `}>
          <div className="flex items-center gap-3">
            <img src={Logo} className="w-10 h-10 rounded-xl object-contain shrink-0" alt="Logo" />
            <span className={`font-bold text-xl tracking-tight text-gray-900 transition-all duration-300 whitespace-nowrap overflow-hidden
              ${isOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0 pointer-events-none"}
            `}>
              Linkprosoft
            </span>
          </div>
          {isOpen && (
            <button 
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 md:hidden cursor-pointer shrink-0"
              title="Collapse menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Mobile Search & Notification Row */}
        {isOpen && (
          <div className="md:hidden px-4 py-3 space-y-3 border-b border-gray-50 pb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search anything"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-[#016EA6] focus:bg-white transition-all"
              />
            </div>
            
            {/* Notifications Link */}
            <button 
              onClick={() => {
                onTabChange("overview");
                setTimeout(() => {
                  const notificationsEl = document.getElementById("notifications-section");
                  if (notificationsEl) {
                    notificationsEl.scrollIntoView({ behavior: "smooth" });
                  }
                }, 100);
                onClose();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 shrink-0" />
                <span>Notifications</span>
              </div>
              {unreadNotificationsCount > 0 && (
                <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          </div>
        )}

        {/* Navigation Links */}
        <nav className={`flex-1 py-6 space-y-1.5 overflow-y-auto transition-all duration-300
          ${isOpen ? "px-4" : "px-2"}
        `}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center rounded-xl text-sm font-medium transition-all duration-200 group relative cursor-pointer
                  ${isOpen ? "px-4 py-3.5 justify-between" : "p-3 justify-center"}
                  ${
                    isActive
                      ? "bg-[#016EA6] text-white shadow-md shadow-[#016EA6]/10"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                title={!isOpen ? item.name : undefined}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
                  />
                  <span className={`transition-all duration-300 whitespace-nowrap overflow-hidden
                    ${isOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0 pointer-events-none"}
                  `}>
                    {item.name}
                  </span>
                </div>
                {isActive && isOpen && <div className="w-1.5 h-5 bg-white rounded-full shrink-0" />}
              </button>
            );
          })}
        </nav>

        {/* Bottom CTA Banner */}
        <div className={`border-t border-gray-50 transition-all duration-300 flex
          ${isOpen ? "p-4" : "py-4 px-2 justify-center"}
        `}>
          <button
            onClick={() => onTabChange("premium")}
            className={`bg-[#016EA6] hover:bg-[#061EA6] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all duration-300 hover:shadow-md active:scale-[0.98] cursor-pointer
              ${isOpen ? "w-full py-3 px-4" : "p-3"}
            `}
            title={!isOpen ? "Linkprosoft Premium" : undefined}
          >
            <CheckSquare className="w-4 h-4 shrink-0" />
            <span className={`transition-all duration-300 whitespace-nowrap overflow-hidden
              ${isOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0 pointer-events-none"}
            `}>
              Linkprosoft Premium
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;
