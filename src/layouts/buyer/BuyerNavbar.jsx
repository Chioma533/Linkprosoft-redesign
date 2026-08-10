import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMessageSquare, FiBell, FiUser, FiChevronDown, FiLogOut, FiMenu, FiX, FiGrid } from "react-icons/fi";
import Logo from "../../assets/images/logo2.jpg";
import { useAuthStore } from "../../store/authStore";
import PostJobWizard from "../../pages/employer/PostJobWizard";

const BuyerNavbar = ({ activePage = "browse" }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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
    { id: "browse", label: "Browse Professionals", path: "/home" },
    { id: "dashboard", label: "My Dashboard", path: "/employer/dashboard" },
    { id: "community", label: "Community", path: "/community" },
    { id: "trending", label: "Trending Professionals", path: "/trending" },
  ];

  const userName = user?.fullName || user?.full_name || "Employer User";
  const userRole = user?.role || "Employer";

  return (
    <>
      <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <Link to="/home" className="flex items-center shrink-0 hover:opacity-90 transition-opacity gap-2">
              <img src={Logo} alt="Linkprosoft" className="w-9 h-9 rounded-lg object-cover" />
            </Link>

            {/* Center: Desktop Navigation links */}
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

            {/* Right: Action buttons */}
            <div className="hidden md:flex items-center gap-3">
              {/* Messages */}
              <button
                id="nav-messages-btn"
                onClick={() => navigate("/employer/dashboard")}
                className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all cursor-pointer"
                title="Messages"
              >
                <FiMessageSquare className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <button
                id="nav-notifications-btn"
                onClick={() => navigate("/employer/dashboard")}
                className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all cursor-pointer"
                title="Notifications"
              >
                <FiBell className="w-5 h-5" />
              </button>

              {/* Post a Job CTA */}
              <button
                id="nav-post-job-btn"
                onClick={() => setShowPostJobModal(true)}
                className="bg-[#016EA6] hover:bg-[#015a8a] text-white font-semibold text-sm px-4 py-2.5 rounded-full transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
              >
                Post a Job
              </button>

              {/* Avatar */}
              <div className="relative" ref={dropdownRef}>
                <button
                  id="nav-avatar-btn"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-gray-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-[#016EA6]/10 flex items-center justify-center text-[#016EA6] overflow-hidden border-2 border-[#016EA6]/20 shadow-sm">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={userName} className="w-full h-full object-cover" />
                    ) : (
                      <FiUser className="w-5 h-5" />
                    )}
                  </div>
                  <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${profileDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
                    <div className="px-4 py-2.5 border-b border-gray-50">
                      <p className="text-sm font-semibold text-gray-900 leading-none truncate">
                        {userName}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 capitalize truncate">
                        {userRole}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate("/employer/dashboard");
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

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium hover:text-[#016EA6] transition-colors ${
                  activePage === link.id ? "text-[#016EA6]" : "text-gray-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-gray-100 my-1" />
            <button
              id="mobile-post-job-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                setShowPostJobModal(true);
              }}
              className="bg-[#016EA6] hover:bg-[#015a8a] text-white font-semibold text-sm px-5 py-3 rounded-full transition-all duration-200 cursor-pointer text-center"
            >
              Post a Job
            </button>
          </div>
        )}
      </nav>

      {/* Post Job Wizard Modal */}
      {showPostJobModal && (
        <PostJobWizard
          onClose={() => setShowPostJobModal(false)}
          onSuccess={() => setShowPostJobModal(false)}
        />
      )}
    </>
  );
};

export default BuyerNavbar;
