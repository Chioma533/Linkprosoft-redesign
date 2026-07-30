import React, { useState, useRef, useEffect } from "react";
import { FiSearch, FiMessageSquare, FiBell, FiChevronDown, FiLogOut, FiUser, FiMenu, FiChevronLeft } from "react-icons/fi";
import { useAuthStore } from "../../store/authStore";
import { useDashboardStore } from "../../store/dashboardStore";

const DashboardNavbar = ({ title, onMenuClick }) => {
  const { user, logout } = useAuthStore();
  const { messages, notifications, setActiveTab, selectedJob, previousTab } = useDashboardStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const unreadMessagesCount = messages.filter(m => m.unread).length;
  const unreadNotificationsCount = notifications.filter(n => n.unread).length;

  return (
    <header className="h-20 bg-white border-b-2 border-[#016EA6] md:border-b md:border-gray-100 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
      {/* Title */}
      <div className="flex items-center gap-2 sm:gap-4">
        {title === "profile" ? (
          <>
            {/* Mobile Back Button */}
            <button
              onClick={() => setActiveTab("overview")}
              className="p-2 text-gray-500 hover:text-gray-900 bg-sky-50 hover:bg-sky-100 rounded-xl transition-all cursor-pointer flex md:hidden items-center justify-center shrink-0"
              title="Back to Overview"
            >
              <FiChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            {/* Desktop Menu Button */}
            <button
              onClick={onMenuClick}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all cursor-pointer hidden md:flex items-center justify-center"
              title="Toggle Sidebar"
            >
              <FiMenu className="w-5 h-5" />
            </button>
          </>
        ) : title === "project-details" ? (
          <button
            onClick={() => setActiveTab(previousTab || "my-jobs")}
            className="p-2 text-gray-500 hover:text-gray-900 bg-sky-50 hover:bg-sky-100 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0"
            title="Back"
          >
            <FiChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        ) : (
          <button
            onClick={onMenuClick}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all cursor-pointer flex items-center justify-center"
            title="Toggle Sidebar"
          >
            <FiMenu className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-lg md:text-xl font-bold text-gray-900 capitalize truncate">
          {title === "project-details" ? (selectedJob?.title || "Wardrobe Installation") : title.replace("-", " ")}
        </h1>
      </div>

      {/* Center Search */}
      <div className="flex-1 max-w-lg mx-8 relative hidden md:block">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search anything"
          className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-[#016EA6] focus:bg-white transition-all duration-200"
        />
      </div>

      {/* Right Side Options */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Messages Alert */}
        <button
          onClick={() => setActiveTab("chat")}
          className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all cursor-pointer"
        >
          <FiMessageSquare className="w-5 h-5" />
          {unreadMessagesCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#016EA6] rounded-full ring-2 ring-white animate-pulse" />
          )}
        </button>

        {/* Notifications Alert */}
        <button className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all cursor-pointer hidden md:block">
          <FiBell className="w-5 h-5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
          )}
        </button>

        {/* Vertical Divider */}
        <div className="w-px h-6 bg-gray-100 hidden sm:block" />

        {/* Profile Avatar Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1 rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#016EA6]/10 flex items-center justify-center text-[#016EA6] overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <FiUser className="w-5 h-5" />
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-gray-900 leading-tight">
                {user?.fullName || user?.full_name || "Samuel Owoniyi"}
              </p>
              <p className="text-[10px] text-gray-400 capitalize">
                {user?.role || "Professional"}
              </p>
            </div>
            <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 hidden md:block ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-slide-up">
              <div className="px-4 py-2 border-b border-gray-50">
                <p className="text-sm font-semibold text-gray-900 leading-none">
                  {user?.fullName || user?.full_name || "Samuel Owoniyi"}
                </p>
                <p className="text-xs text-gray-400 mt-1 truncate">
                  {user?.email || "samuel@example.com"}
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveTab("profile");
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
              >
                <FiUser className="w-4 h-4" />
                <span>View Profile</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50/50 transition-colors text-left border-t border-gray-50"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
