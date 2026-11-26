import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiGrid,
  FiMenu,
  FiX,
} from "react-icons/fi";
import MessageIcon from "../../components/icons/Message02Icon";
import NotificationIcon from "../../components/icons/NotificationIcon";
import Logo from "/temp_figma_mockups/linkprosoft-logo.png";
import { useAuthStore } from "../../store/authStore";
import VerificationBadge from "../../components/common/VerificationBadge";
import Avatar from "../../components/common/Avatar";
import { useDashboardStore } from "../../store/dashboardStore";
import { getUnreadMessagesCount, getUnreadNotificationsCount, getUserDisplayName, getUserRole, isUserVerified } from "../../utils/dashboardNavbar";

/**
 * ProfessionalNavbar — top nav for the DefaultProfessionalScreen.
 * Shows: Logo | Browse Jobs (active) | My Dashboard | Community | msg | bell | avatar
 * No "Post a Job" button — professionals don't post jobs.
 */
const ProfessionalNavbar = ({ activePage = "browse-jobs" }) => {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();

const {
  messages = [],
  notifications = [],
  setActiveTab,
  setPreviousTab,
} = useDashboardStore()
  const navLinks = [
    { id: "browse-jobs", label: "Browse Jobs", path: "/professional/home" },
    { id: "dashboard", label: "My Dashboard", path: "/professional/dashboard" },
    { id: "community", label: "Community", path: "/community" },
  ];

  const role = getUserRole(user);
  const isVerified = isUserVerified(user);

  const userName = user?.fullName || user?.full_name || "Professional";

  const unreadMessagesCount = getUnreadMessagesCount(messages);
  const unreadNotificationsCount = getUnreadNotificationsCount(notifications);

  return (
    <nav className="relative w-full bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Desktop Logo */}
          <Link
            to="/professional/home"
            className="hidden md:flex items-center shrink-0 hover:opacity-90 transition-opacity"
          >
            <img
              src={Logo}
              alt="Linkprosoft"
              className="w-9 h-9 rounded-lg object-cover"
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                to={link.path}
                id={`nav-${link.id}`}
                className={`text-sm font-semibold tracking-wide transition-colors whitespace-nowrap pb-1 ${
                  activePage === link.id
                    ? "text-[#016EA6] border-b-2 border-[#016EA6]"
                    : "text-gray-600 hover:text-[#016EA6]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right actions */}
          {}
          <div className="hidden md:flex items-center gap-3">
            <button
              id="nav-messages-btn"
              onClick={() => setActiveTab(role === "employer" ? "messages" : "chat")}
              className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all cursor-pointer"
              title="Messages"
            >
              <MessageIcon className="w-5 h-5" />
                {unreadMessagesCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#016EA6] rounded-full ring-2 ring-white animate-pulse" />
                )}
            </button>

           {/* Notifications Alert */}
        <div
          className="dashboard-notifications-action relative p-2 md:items-center md:justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all cursor-pointer hidden md:flex"
          title="Notifications"
        >
          <NotificationIcon size={20} />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
          )}
        </div>

            {/* Profile avatar */}
              <button
                id="nav-avatar-btn"
                type="button"
                aria-label="Go to profile"
                onClick={() => {
                  setActiveTab("profile");
                  navigate("/professional/dashboard");
                }}
                className="relative bg-white rounded-full p-0.6 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#016EA6]"
              >
                <div className="flex items-center gap-3 p-1 rounded-full hover:bg-white transition-all">
                  <div className="w-9 h-9 rounded-full bg-[#016EA6]/10 flex items-center justify-center text-[#016EA6] overflow-hidden border-2 border-[#016EA6]/20 shadow-sm">
                    <Avatar
                      name="Avatar"
                      avatar={user?.avatar}
                      imageClassName="w-full h-full object-cover"
                      fallback={<FiUser className="w-5 h-5" />}
                    />
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-semibold text-gray-900 leading-tight">
                        {getUserDisplayName(user, role)}
                      </p>
                      <VerificationBadge user={user} />
                    </div>
                    <p className="text-[10px] text-gray-400 capitalize">
                      {role}
                    </p>
                  </div>
                </div>
              </button>
          </div>

          {/* Mobile Navigation Header (Figma Mobile Design: Menu Icon | Browse Jobs | Messages | Avatar) */}
          <div className="flex md:hidden items-center justify-between w-full h-full">
            <div className="flex items-center gap-3 min-w-0">
              <button
                id="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? (
                  <FiX className="w-6 h-6 text-gray-700" />
                ) : (
                  <FiMenu className="w-6 h-6 text-gray-700" />
                )}
              </button>
              <h1 className="text-base font-bold text-gray-900 tracking-tight truncate">
                Browse Jobs
              </h1>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                id="mobile-messages-btn"
                onClick={() => setActiveTab(role === "employer" ? "messages" : "chat")}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-50"
                title="Messages"
              >
                <MessageIcon className="w-5 h-5" />
                  {unreadMessagesCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#016EA6] rounded-full ring-2 ring-white animate-pulse" />
                  )}           
              </button>

              <button
                id="mobile-avatar-btn"
                type="button"
                aria-label="Go to profile"
                onClick={() => {
                  setActiveTab("profile");
                  navigate("/professional/dashboard");
                }}
                className="relative bg-white rounded-full p-0.6 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#016EA6]"
              >
                <div className="flex items-center p-1 rounded-full hover:bg-white transition-all">
                <div className="w-9 h-9 rounded-full bg-[#016EA6]/10 flex items-center justify-center text-[#016EA6] overflow-hidden border-2 border-[#016EA6]/20 shadow-sm">
              <Avatar
                name="Avatar"
                avatar={user?.avatar}
                imageClassName="w-full h-full object-cover"
                fallback={<FiUser className="w-5 h-5" />}
              />
            </div>
            </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute left-0 right-0 top-full z-50 bg-white border-t border-gray-100 shadow-lg flex flex-col p-6 gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-base font-medium hover:text-[#016EA6] transition-colors ${activePage === link.id ? "text-[#016EA6]" : "text-gray-700"
                }`}
            >
              {link.label}
            </Link>
          ))}         
        </div>
      )}
    </nav>
  );
};

export default ProfessionalNavbar;
