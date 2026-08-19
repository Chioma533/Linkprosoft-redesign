import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
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
  const {
    notifications = [],
    jobs = [],
    myJobs = [],
    setSelectedJob,
    setGlobalSearchQuery,
  } = useDashboardStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);

  const role = user?.role || "professional";
  const unreadNotificationsCount = notifications?.filter((n) => n.unread || !n.is_read).length || 0;

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigationItems = useMemo(() => {
    if (role === "employer") {
      return [
        { id: "overview", label: "Overview", keywords: ["home", "dashboard", "overview"] },
        { id: "manage-jobs", label: "Manage Jobs", keywords: ["manage", "my jobs", "contracts"] },
        { id: "browse-professionals", label: "Browse Professionals", keywords: ["browse", "talent", "hire"] },
        { id: "messages", label: "Messages", keywords: ["messages", "chat", "inbox"] },
        { id: "wallet", label: "Wallet & Escrow", keywords: ["wallet", "funds", "balance"] },
      ];
    }
    return [
      { id: "overview", label: "Overview", keywords: ["home", "dashboard", "overview"] },
      { id: "browse-jobs", label: "Browse Jobs", keywords: ["browse", "find jobs", "explore"] },
      { id: "my-jobs", label: "My Jobs", keywords: ["my jobs", "contracts", "orders"] },
      { id: "applications", label: "Applications", keywords: ["applications", "proposals"] },
      { id: "schedule", label: "Schedule", keywords: ["schedule", "calendar"] },
      { id: "wallet", label: "Wallet", keywords: ["wallet", "earnings", "withdraw"] },
    ];
  }, [role]);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { navMatches: [], jobMatches: [] };

    const navMatches = navigationItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.includes(q))
    );

    const combinedJobs = [...(myJobs || []), ...(jobs || [])];
    const seenJobIds = new Set();
    const jobMatches = [];

    for (const job of combinedJobs) {
      const id = String(job.id || job.orderId || "");
      if (seenJobIds.has(id)) continue;

      const title = (job.title || job.jobTitle || "").toLowerCase();
      const client = (job.client?.fullName || job.client?.name || job.client || job.employerName || "").toLowerCase();
      const category = (job.category?.name || job.category || "").toLowerCase();

      if (title.includes(q) || client.includes(q) || category.includes(q)) {
        seenJobIds.add(id);
        jobMatches.push(job);
        if (jobMatches.length >= 3) break;
      }
    }

    return { navMatches, jobMatches };
  }, [searchQuery, navigationItems, myJobs, jobs]);

  const hasResults = searchResults.navMatches.length > 0 || searchResults.jobMatches.length > 0;

  const handleSelectNav = (tabId) => {
    onTabChange(tabId);
    setIsSearchFocused(false);
    onClose?.();
  };

  const handleSelectJob = (job) => {
    setSelectedJob?.(job);
    setIsSearchFocused(false);
    onClose?.();
    if (role === "employer") {
      onTabChange("manage-jobs");
    } else {
      onTabChange("project-details");
    }
  };

  const handleFullSearch = (targetTab) => {
    if (searchQuery.trim()) {
      setGlobalSearchQuery?.(searchQuery.trim());
    }
    onTabChange(targetTab);
    setIsSearchFocused(false);
    onClose?.();
  };

  const handleKeyDownInput = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchResults.navMatches.length > 0) {
        handleSelectNav(searchResults.navMatches[0].id);
      } else if (searchResults.jobMatches.length > 0) {
        handleSelectJob(searchResults.jobMatches[0]);
      } else {
        handleFullSearch(role === "employer" ? "browse-professionals" : "browse-jobs");
      }
    } else if (e.key === "Escape") {
      setIsSearchFocused(false);
    }
  };

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
          <Link
            to={role === "employer" ? "/home" : "/professional/home"}
            className="flex items-center gap-3"
            aria-label="Go to home"
          >
            <img src={Logo} className="w-10 h-10 rounded-full object-contain shrink-0" alt="Linkprosoft" />
            <span className={`font-bold text-xl tracking-tight text-gray-900 transition-all duration-300 whitespace-nowrap overflow-hidden
              ${isOpen ? "opacity-100 max-w-50" : "opacity-0 max-w-0 pointer-events-none"}
            `}>
              Linkprosoft
            </span>
          </Link>
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
        <div className={`md:hidden px-4 py-3 space-y-3 border-b border-gray-100 pb-4 transition-all duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 max-h-0 py-0 border-none overflow-hidden pointer-events-none"
        }`}>
          {/* Search Input Container with Dropdown */}
          <div ref={searchContainerRef} className="relative">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onKeyDown={handleKeyDownInput}
                placeholder="Search anything..."
                className="w-full pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-full text-xs outline-none focus:border-[#016EA6] focus:ring-2 focus:ring-[#016EA6]/10 transition-all font-medium text-gray-800"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sidebar Live Search Suggestions Dropdown */}
            {isSearchFocused && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-2.5 z-50 max-h-[320px] overflow-y-auto space-y-2.5 text-xs">
                {searchQuery.trim() ? (
                  hasResults ? (
                    <>
                      {/* Navigation Pages */}
                      {searchResults.navMatches.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-1 mb-1">
                            Pages
                          </p>
                          {searchResults.navMatches.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handleSelectNav(item.id)}
                              className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-sky-50 transition-colors"
                            >
                              <span className="font-semibold text-gray-800">{item.label}</span>
                              <span className="text-[10px] text-[#016EA6] font-medium">Jump to</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Jobs & Contracts */}
                      {searchResults.jobMatches.length > 0 && (
                        <div className="border-t border-gray-100 pt-1.5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-1 mb-1">
                            Jobs
                          </p>
                          {searchResults.jobMatches.map((job, idx) => (
                            <button
                              key={job.id || idx}
                              onClick={() => handleSelectJob(job)}
                              className="w-full p-2 rounded-xl bg-gray-50/70 hover:bg-sky-50 text-left mb-1 flex items-center justify-between transition-colors"
                            >
                              <div className="min-w-0 pr-2">
                                <p className="font-bold text-gray-800 truncate text-[11px]">{job.title || "Job Item"}</p>
                                <p className="text-[10px] text-gray-400 truncate">{job.category?.name || job.category || "General"}</p>
                              </div>
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 shrink-0">
                                {job.status || "Active"}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Marketplace Action */}
                      <button
                        onClick={() => handleFullSearch(role === "employer" ? "browse-professionals" : "browse-jobs")}
                        className="w-full py-2 px-2.5 bg-[#016EA6] text-white rounded-xl text-[11px] font-bold text-center mt-1 transition-colors hover:bg-[#061EA6]"
                      >
                        Search for "{searchQuery}" in Marketplace
                      </button>
                    </>
                  ) : (
                    <div className="py-4 text-center">
                      <p className="text-xs font-semibold text-gray-700">No matches found</p>
                      <button
                        onClick={() => handleFullSearch(role === "employer" ? "browse-professionals" : "browse-jobs")}
                        className="mt-2 px-3 py-1.5 bg-[#016EA6] text-white rounded-full text-[10px] font-bold"
                      >
                        Search in Market
                      </button>
                    </div>
                  )
                ) : (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-1 mb-1.5">
                      Quick Links
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {navigationItems.slice(0, 4).map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleSelectNav(item.id)}
                          className="p-1.5 rounded-lg text-left bg-gray-50 hover:bg-sky-50 text-[11px] font-medium text-gray-700 hover:text-[#016EA6] transition-colors"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Notifications Link */}
          <button 
            onClick={() => {
              onTabChange("overview");
              setTimeout(() => {
                const notificationsEl = document.getElementById("notifications-section") || document.getElementById("employer-notifications-mobile");
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
