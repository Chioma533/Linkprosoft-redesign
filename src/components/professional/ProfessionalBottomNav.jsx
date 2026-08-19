import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiSearch,
  FiBriefcase,
  FiFileText,
  FiCreditCard,
} from "react-icons/fi";

/**
 * ProfessionalBottomNav — mobile sticky bottom navigation bar.
 * Appears only on mobile screens (< 768px).
 * Displays 5 main navigation items matching the Figma Mobile design:
 * 1. Overview
 * 2. Browse jobs (Active by default on home/search)
 * 3. My Jobs
 * 4. Applications
 * 5. Wallet
 */
const ProfessionalBottomNav = ({ activeTab = "browse-jobs" }) => {
  const location = useLocation();

  const navItems = [
    {
      id: "overview",
      label: "Overview",
      icon: FiHome,
      path: "/professional/dashboard",
    },
    {
      id: "browse-jobs",
      label: "Browse jobs",
      icon: FiSearch,
      path: "/professional/home",
    },
    {
      id: "my-jobs",
      label: "My Jobs",
      icon: FiBriefcase,
      path: "/professional/dashboard",
    },
    {
      id: "applications",
      label: "Applications",
      icon: FiFileText,
      path: "/professional/dashboard",
    },
    {
      id: "wallet",
      label: "Wallet",
      icon: FiCreditCard,
      path: "/professional/dashboard",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg md:hidden">
      <nav className="flex items-center justify-around py-2 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id || location.pathname === item.path;

          return (
            <Link
              key={item.id}
              to={item.path}
              id={`mobile-bottom-nav-${item.id}`}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all duration-150 cursor-pointer ${
                isActive
                  ? "text-[#016EA6] font-semibold"
                  : "text-gray-400 hover:text-gray-600 font-normal"
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-150 ${
                  isActive ? "scale-110 text-[#016EA6]" : "text-gray-400"
                }`}
              />
              <span className="text-[10px] mt-1 tracking-tight truncate max-w-full">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* iOS Home Indicator Bar */}
      <div className="pb-1 pt-0.5 flex justify-center">
        <div className="w-32 h-1 bg-gray-900/80 rounded-full" />
      </div>
    </div>
  );
};

export default ProfessionalBottomNav;
