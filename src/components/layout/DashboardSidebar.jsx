import {
  Search,
  FileText,
  Calendar,
  CheckSquare,
  X,
  Bell,
} from "lucide-react";
import HomeIcon from "../icons/HomeIcon";
import CaseIcon from "../icons/CaseIcon";
import Message02Icon from "../icons/Message02Icon";
import WalletIcon from "../icons/WalletIcon";
import TieIcon from "../icons/TieIcon";
import Logo from "../../../public/temp_figma_mockups/linkprosoft-logo.png";
import { useAuthStore } from "../../store/authStore";
import { useDashboardStore } from "../../store/dashboardStore";
import { Link } from "react-router-dom";

const DashboardSidebar = ({ activeTab, onTabChange, isOpen, onClose }) => {
  const { user } = useAuthStore();
  const { notifications } = useDashboardStore();
  const role = user?.role || "professional";
  const unreadNotificationsCount = notifications?.filter(n => n.unread).length || 0;

  const getMenuItems = () => {
    if (role === "employer") {
      return [
        { id: "overview", name: "Overview", icon: HomeIcon },
        { id: "manage-jobs", name: "Manage jobs", icon: CaseIcon },
        { id: "browse-professionals", name: "Browse Professionals", icon: TieIcon },
        { id: "messages", name: "Messages", icon: Message02Icon },
        { id: "wallet", name: "Wallet", icon: WalletIcon },
      ];
    }
    return [
      { id: "overview", name: "Overview", icon: HomeIcon },
      { id: "browse-jobs", name: "Browse jobs", icon: Search },
      { id: "my-jobs", name: "My jobs", icon: CaseIcon },
      { id: "applications", name: "Applications", icon: FileText },
      { id: "schedule", name: "Schedule", icon: Calendar },
      { id: "wallet", name: "Wallet", icon: WalletIcon },
    ];
  };

  const menuItems = getMenuItems();
  const activeIndex = Math.max(menuItems.findIndex((item) => item.id === activeTab), 0);
  const indicatorOffset = 24 + activeIndex * 54;

  return (
    <>
      {/* Sidebar Container */}
      <div 
        className={`bg-[#f9f9f9] border-r border-[#E6F1F6] flex flex-col h-screen transition-all duration-300 ease-in-out z-50
          fixed inset-y-0 left-0 w-64
          md:sticky md:top-0 md:translate-x-0
          ${isOpen 
            ? "translate-x-0 shadow-2xl md:shadow-none md:w-64" 
            : "-translate-x-full md:w-16"
          }
        `}
      >
        {/* Top Logo */}
        <div className={`py-6 flex items-center transition-all duration-300
          ${isOpen ? "px-6 justify-between" : "px-3 justify-center"}
        `}>
          <div className="flex items-center gap-3">
            <Link to ="/home">
            <img src={Logo} className="w-10 h-10 rounded-full object-contain shrink-0" alt="Logo" />
            <span className={`font-bold text-xl tracking-tight text-gray-900 transition-all duration-300 whitespace-nowrap overflow-hidden
              ${isOpen ? "opacity-100 max-w-50" : "opacity-0 max-w-0 pointer-events-none"}
            `}>
              Linkprosoft
            </span>
            </Link>
          </div>
          <button 
            onClick={onClose}
            className={`p-1 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 md:hidden cursor-pointer shrink-0 transition-opacity duration-300 ${
              isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            title="Collapse menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Search & Notification Row */}
        <div className={`md:hidden px-4 py-3 space-y-3 border-b border-gray-50 pb-4 transition-all duration-300 ${
          isOpen ? "opacity-100 max-h-50" : "opacity-0 max-h-0 py-0 border-none overflow-hidden pointer-events-none"
        }`}>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search anything"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-full text-xs outline-none focus:border-[#016EA6] focus:bg-white transition-all"
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
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-full text-xs font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all cursor-pointer"
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

        {/* Navigation Links */}
        <nav className={`relative flex-1 py-6 space-y-1.5 overflow-y-auto transition-all duration-300
          ${isOpen ? "px-4" : "px-2"}
        `}>
          <div
            className="absolute left-1 right-1 rounded-xl bg-[#016EA6] shadow-md shadow-[#016EA6]/10 transition-all duration-500 ease-out z-0"
            style={{
              top: `${indicatorOffset}px`,
              height: "48px",
            }}
          />

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`relative z-10 w-full flex items-center justify-start rounded-xl text-sm font-medium transition-all duration-300 group cursor-pointer
                  py-3.5 gap-3
                  ${isOpen ? "px-4" : "px-3.5"}
                  ${
                    isActive
                      ? "text-white"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                title={!isOpen ? item.name : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
                />
                <span className={`transition-all duration-300 whitespace-nowrap overflow-hidden
                  ${isOpen ? "opacity-100 max-w-50" : "opacity-0 max-w-0 pointer-events-none"}
                `}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Bottom CTA Banner */}
        <div className={`border-t border-gray-50 transition-all duration-300 flex w-full
          ${isOpen ? "p-4" : "py-4 px-2"}
        `}>
          <button
            onClick={() => onTabChange("premium")}
            className="bg-[#016EA6] hover:bg-[#061EA6] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-start gap-2 shadow-sm transition-all duration-300 hover:shadow-md active:scale-[0.98] cursor-pointer w-full px-4 py-3"
            title={!isOpen ? "Linkprosoft Premium" : undefined}
          >
            <CheckSquare className="w-4 h-4 shrink-0" />
            <span className={`transition-all duration-300 whitespace-nowrap overflow-hidden
              ${isOpen ? "opacity-100 max-w-50" : "opacity-0 max-w-0 pointer-events-none"}
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
