import React from "react";
import {
  Home,
  Search,
  Briefcase,
  FileText,
  Calendar,
  Wallet,
  CheckSquare,
} from "lucide-react";
import Logo from "../../assets/images/logo2.jpg";

const DashboardSidebar = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: "overview", name: "Overview", icon: Home },
    { id: "browse-jobs", name: "Browse jobs", icon: Search },
    { id: "my-jobs", name: "My jobs", icon: Briefcase },
    { id: "applications", name: "Applications", icon: FileText },
    { id: "schedule", name: "Schedule", icon: Calendar },
    { id: "wallet", name: "Wallet", icon: Wallet },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 shrink-0">
      {/* Top Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-gray-50">
        <img src={Logo} alt="Linkprosoft" className="w-10 h-10 rounded-xl object-contain" />
        <span className="font-bold text-xl tracking-tight text-gray-900">Linkprosoft</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-[#016EA6] text-white shadow-md shadow-[#016EA6]/10"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                <span>{item.name}</span>
              </div>
              {isActive && (
                <div className="w-1.5 h-5 bg-white rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom CTA Banner */}
      <div className="p-4 border-t border-gray-50">
        <button
          onClick={() => onTabChange("premium")}
          className="w-full bg-[#016EA6] hover:bg-[#061EA6] text-white py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all duration-300 hover:shadow-md active:scale-[0.98] cursor-pointer"
        >
          <CheckSquare className="w-4 h-4" />
          <span>Linkprosoft Premium</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
