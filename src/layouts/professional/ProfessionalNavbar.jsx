import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMessageSquare,
  FiBell,
  FiUser,
  FiChevronDown,
  FiLogOut,
  FiGrid,
  FiMenu,
  FiX,
} from "react-icons/fi";
import Logo from "/temp_figma_mockups/linkprosoft-logo.png";
import { useAuthStore } from "../../store/authStore";

/**
 * ProfessionalNavbar — top nav for the DefaultProfessionalScreen.
 * Shows: Logo | Browse Jobs (active) | My Dashboard | Community | msg | bell | avatar
 * No "Post a Job" button — professionals don't post jobs.
 */
const ProfessionalNavbar = ({ activePage = "browse-jobs" }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setProfileDropdownOpen(false);
    await logout();
    navigate("/login");
  };

  const navLinks = [
    { id: "browse-jobs", label: "Browse Jobs", path: "/professional/home" },
    { id: "dashboard", label: "My Dashboard", path: "/professional/dashboard" },
    { id: "community", label: "Community", path: "/community" },
  ];

  const userName = user?.fullName || user?.full_name || "Professional";

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
          <div className="hidden md:flex items-center gap-3">
            <button
              id="nav-messages-btn"
              onClick={() => navigate("/professional/dashboard")}
              className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all cursor-pointer"
              title="Messages"
            >
              <FiMessageSquare className="w-5 h-5" />
            </button>

            <button
              id="nav-notifications-btn"
              onClick={() => navigate("/professional/dashboard")}
              className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all cursor-pointer"
              title="Notifications"
            >
              <FiBell className="w-5 h-5" />
            </button>

            {/* Avatar + dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                id="nav-avatar-btn"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-gray-50 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-[#016EA6]/10 flex items-center justify-center text-[#016EA6] overflow-hidden border-2 border-[#016EA6]/20 shadow-sm">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={userName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiUser className="w-5 h-5" />
                  )}
                </div>
                <FiChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    profileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
                  <div className="px-4 py-2.5 border-b border-gray-50">
                    <p className="text-sm font-semibold text-gray-900 leading-none truncate">
                      {userName}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 capitalize truncate">
                      Professional
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      navigate("/professional/dashboard");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                  >
                    <FiGrid className="w-4 h-4 text-gray-500" />
                    <span>My Dashboard</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/50 transition-colors text-left border-t border-gray-50"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation Header (Figma Mobile Design: Menu Icon | Browse Jobs | Messages | Avatar) */}
          <div className="flex md:hidden items-center justify-between w-full h-full">
            <div className="flex items-center gap-3">
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
              <h1 className="text-base font-bold text-gray-900 tracking-tight">
                Browse Jobs
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="mobile-messages-btn"
                onClick={() => navigate("/professional/dashboard")}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-50"
                title="Messages"
              >
                <FiMessageSquare className="w-5 h-5 text-gray-600" />
              </button>

              <button
                id="mobile-avatar-btn"
                onClick={() => navigate("/professional/dashboard")}
                className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 shrink-0 cursor-pointer"
              >
                <img
                  src={user?.avatar || "/professional_avatar.png"}
                  alt={userName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    if (e.target.parentElement) {
                      e.target.parentElement.className =
                        "w-8 h-8 rounded-full bg-[#016EA6] text-white flex items-center justify-center text-xs font-bold";
                      e.target.parentElement.innerHTML = userName.charAt(0);
                    }
                  }}
                />
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
          <div className="h-px bg-gray-100 my-1" />
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 font-medium text-left"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default ProfessionalNavbar;
