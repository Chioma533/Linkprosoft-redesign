import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  FiSearch,
  FiMessageSquare,
  FiBell,
  FiChevronDown,
  FiLogOut,
  FiUser,
  FiMenu,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiBriefcase,
  FiCompass,
  FiCreditCard,
  FiCalendar,
  FiArrowRight,
  FiFileText,
  FiAward,
} from "react-icons/fi";
import MessageIcon from "../icons/Message02Icon";
import { useAuthStore } from "../../store/authStore";
import { useDashboardStore } from "../../store/dashboardStore";

const DashboardNavbar = ({ title, isOpen, onMenuClick }) => {
  const { user, logout } = useAuthStore();
  const {
    messages = [],
    notifications = [],
    jobs = [],
    myJobs = [],
    setActiveTab,
    selectedJob,
    previousTab,
    setSelectedJob,
    setGlobalSearchQuery,
  } = useDashboardStore();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const dropdownRef = useRef(null);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  const role = user?.role || "professional";

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Global Keyboard shortcuts: Ctrl+K or / to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchFocused(true);
      } else if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchFocused(true);
      } else if (e.key === "Escape") {
        setIsSearchFocused(false);
        setMobileSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (mobileSearchOpen) {
      setTimeout(() => mobileSearchInputRef.current?.focus(), 50);
    }
  }, [mobileSearchOpen]);

  const handleLogout = async () => {
    await logout();
  };

  const unreadMessagesCount = (messages || []).filter((m) => m.unread).length;
  const unreadNotificationsCount = (notifications || []).filter((n) => n.unread || !n.is_read).length;

  // Platform subpages definitions for quick navigation
  const navigationItems = useMemo(() => {
    if (role === "employer") {
      return [
        { id: "overview", label: "Overview", icon: FiCompass, keywords: ["home", "dashboard", "overview", "stats"] },
        { id: "browse-professionals", label: "Browse Professionals", icon: FiSearch, keywords: ["browse", "find", "professionals", "talent", "hire"] },
        { id: "manage-jobs", label: "My Jobs", icon: FiBriefcase, keywords: ["my jobs", "manage", "contracts", "orders", "active"] },
        { id: "messages", label: "Messages & Chats", icon: FiMessageSquare, keywords: ["messages", "chat", "inbox", "conversations"] },
        { id: "wallet", label: "Wallet & Escrow", icon: FiCreditCard, keywords: ["wallet", "escrow", "funds", "balance", "payments", "money"] },
        { id: "open-dispute", label: "Dispute Center", icon: FiFileText, keywords: ["dispute", "resolution", "help", "claim"] },
      ];
    }
    return [
      { id: "overview", label: "Overview", icon: FiCompass, keywords: ["home", "dashboard", "overview", "stats", "performance"] },
      { id: "browse-jobs", label: "Browse Jobs", icon: FiSearch, keywords: ["browse", "find jobs", "explore", "open jobs", "market"] },
      { id: "my-jobs", label: "My Jobs", icon: FiBriefcase, keywords: ["my jobs", "contracts", "orders", "active", "in progress"] },
      { id: "applications", label: "Applications", icon: FiFileText, keywords: ["applications", "proposals", "applied", "bids"] },
      { id: "schedule", label: "Schedule", icon: FiCalendar, keywords: ["schedule", "calendar", "calendar view", "upcoming"] },
      { id: "wallet", label: "Wallet & Payouts", icon: FiCreditCard, keywords: ["wallet", "earnings", "withdraw", "balance", "bank"] },
      { id: "chat", label: "Messages & Chat", icon: FiMessageSquare, keywords: ["messages", "chat", "inbox", "clients"] },
      { id: "profile", label: "Profile", icon: FiUser, keywords: ["profile", "bio", "skills", "account", "settings"] },
      { id: "premium", label: "Premium Membership", icon: FiAward, keywords: ["premium", "subscription", "upgrade", "pro"] },
    ];
  }, [role]);

  // Compute live search suggestions
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { navMatches: [], jobMatches: [], messageMatches: [], notifMatches: [] };

    // 1. Navigation items
    const navMatches = navigationItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.includes(q))
    );

    // 2. Jobs and Contracts
    const combinedJobs = [...(myJobs || []), ...(jobs || [])];
    const seenJobIds = new Set();
    const jobMatches = [];

    for (const job of combinedJobs) {
      const id = String(job.id || job.orderId || "");
      if (seenJobIds.has(id)) continue;

      const title = (job.title || job.jobTitle || "").toLowerCase();
      const client = (job.client?.fullName || job.client?.name || job.client || job.employerName || "").toLowerCase();
      const category = (job.category?.name || job.category || "").toLowerCase();
      const orderId = String(job.orderId || job.order_id || "").toLowerCase();

      if (title.includes(q) || client.includes(q) || category.includes(q) || orderId.includes(q)) {
        seenJobIds.add(id);
        jobMatches.push(job);
        if (jobMatches.length >= 4) break;
      }
    }

    // 3. Messages
    const messageMatches = (messages || [])
      .filter((msg) => {
        const sender = (msg.senderName || msg.sender || "").toLowerCase();
        const text = (msg.lastMessage || msg.content || msg.text || "").toLowerCase();
        return sender.includes(q) || text.includes(q);
      })
      .slice(0, 2);

    // 4. Notifications
    const notifMatches = (notifications || [])
      .filter((n) => {
        const t = (n.title || n.subject || "").toLowerCase();
        const msg = (n.message || n.body || "").toLowerCase();
        return t.includes(q) || msg.includes(q);
      })
      .slice(0, 2);

    return { navMatches, jobMatches, messageMatches, notifMatches };
  }, [searchQuery, navigationItems, myJobs, jobs, messages, notifications]);

  const hasResults =
    searchResults.navMatches.length > 0 ||
    searchResults.jobMatches.length > 0 ||
    searchResults.messageMatches.length > 0 ||
    searchResults.notifMatches.length > 0;

  // Search Action Execution
  const handleSelectNav = (tabId) => {
    setActiveTab(tabId);
    setIsSearchFocused(false);
    setMobileSearchOpen(false);
  };

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    setIsSearchFocused(false);
    setMobileSearchOpen(false);
    if (role === "employer") {
      setActiveTab("manage-jobs");
    } else {
      setActiveTab("project-details");
    }
  };

  const handleFullSearch = (targetTab) => {
    if (searchQuery.trim()) {
      setGlobalSearchQuery(searchQuery.trim());
    }
    setActiveTab(targetTab);
    setIsSearchFocused(false);
    setMobileSearchOpen(false);
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
    }
  };

  return (
    <header className="h-20 bg-[#f9f9f9] border-b-2 border-[#E6F1F6] md:border-b md:border-gray-100 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
      {/* Title / Left controls */}
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
              className="p-2 text-gray-600 bg-[#e6f1f6] hover:bg-[#d8e6f1] rounded-xl transition-all cursor-pointer hidden md:flex items-center justify-center"
              title="Toggle Sidebar"
            >
              {isOpen ? <FiChevronLeft className="w-5 h-5" /> : <FiChevronRight className="w-5 h-5" />}
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
            className="p-2 text-gray-600 bg-[#e6f1f6] hover:bg-[#d8e6f1] rounded-xl transition-all cursor-pointer flex items-center justify-center"
            title="Toggle Sidebar"
          >
            {isOpen ? (
              <FiChevronLeft className="w-5 h-5" />
            ) : (
              <>
                <FiMenu className="w-5 h-5 md:hidden" />
                <FiChevronRight className="w-5 h-5 hidden md:block" />
              </>
            )}
          </button>
        )}
        <h1 className="text-lg md:text-xl font-normal text-gray-900 capitalize truncate">
          {title === "project-details" ? selectedJob?.title || "Wardrobe Installation" : title.replace("-", " ")}
        </h1>
      </div>

      {/* Center Search (Desktop) */}
      <div ref={searchContainerRef} className="flex-1 max-w-lg mx-8 relative hidden md:block">
        <div className="relative flex items-center">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onKeyDown={handleKeyDownInput}
            placeholder="Search anything (jobs, messages, pages)..."
            className="w-full pl-11 pr-20 py-2.5 bg-white border border-gray-200/80 rounded-full text-sm outline-none focus:border-[#016EA6] focus:ring-2 focus:ring-[#016EA6]/10 transition-all duration-200"
          />

          <div className="absolute right-3 flex items-center gap-1.5">
            {searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery("");
                  searchInputRef.current?.focus();
                }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                title="Clear search"
              >
                <FiX className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden lg:inline-block text-[10px] text-gray-400 bg-gray-100/80 border border-gray-200 px-1.5 py-0.5 rounded font-mono">
                ⌘K
              </kbd>
            )}
          </div>
        </div>

        {/* Live Search Dropdown */}
        {isSearchFocused && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 max-h-[440px] overflow-y-auto animate-fadeIn">
            {searchQuery.trim() ? (
              hasResults ? (
                <div className="space-y-3 text-xs">
                  {/* Category: Navigation / Pages */}
                  {searchResults.navMatches.length > 0 && (
                    <div className="px-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 mb-1">
                        Navigation
                      </p>
                      {searchResults.navMatches.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleSelectNav(item.id)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-[#EBF3FA]/70 text-gray-700 hover:text-[#016EA6] transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-6 h-6 rounded-lg bg-sky-50 text-[#016EA6] flex items-center justify-center">
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <span className="font-semibold text-gray-800">{item.label}</span>
                            </div>
                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                              Jump to <FiArrowRight className="w-3 h-3" />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Category: Jobs / Contracts */}
                  {searchResults.jobMatches.length > 0 && (
                    <div className="px-3 border-t border-gray-50 pt-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 mb-1">
                        Jobs & Contracts
                      </p>
                      {searchResults.jobMatches.map((job, idx) => (
                        <button
                          key={job.id || idx}
                          onClick={() => handleSelectJob(job)}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-[#EBF3FA]/70 transition-colors cursor-pointer group"
                        >
                          <div className="min-w-0 flex-1 pr-2">
                            <p className="font-bold text-gray-800 group-hover:text-[#016EA6] truncate">
                              {job.title || job.jobTitle || "Job Opportunity"}
                            </p>
                            <p className="text-[11px] text-gray-400 truncate">
                              {job.client?.fullName || job.client || job.category?.name || job.category || "General"}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                              {job.status || "Active"}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Category: Messages */}
                  {searchResults.messageMatches.length > 0 && (
                    <div className="px-3 border-t border-gray-50 pt-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 mb-1">
                        Messages
                      </p>
                      {searchResults.messageMatches.map((msg, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectNav(role === "employer" ? "messages" : "chat")}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-[#EBF3FA]/70 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                              <FiMessageSquare className="w-3.5 h-3.5" />
                            </div>
                            <div className="truncate">
                              <p className="font-semibold text-gray-800 truncate">{msg.senderName || msg.sender || "Client"}</p>
                              <p className="text-[10px] text-gray-400 truncate">{msg.lastMessage || msg.content || "Open conversation"}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Quick Action Footer */}
                  <div className="px-3 border-t border-gray-50 pt-2">
                    <button
                      onClick={() => handleFullSearch(role === "employer" ? "browse-professionals" : "browse-jobs")}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#016EA6]/10 hover:bg-[#016EA6] text-[#016EA6] hover:text-white rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer"
                    >
                      <FiSearch className="w-3.5 h-3.5" />
                      <span>
                        Search for "{searchQuery}" in {role === "employer" ? "Browse Professionals" : "Browse Jobs"}
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-xs font-semibold text-gray-700">No exact matches found for "{searchQuery}"</p>
                  <p className="text-[11px] text-gray-400 mt-1 mb-3">
                    Explore all available listings or try a different term.
                  </p>
                  <button
                    onClick={() => handleFullSearch(role === "employer" ? "browse-professionals" : "browse-jobs")}
                    className="px-4 py-2 bg-[#016EA6] text-white text-xs font-bold rounded-full hover:bg-[#061EA6] transition-colors"
                  >
                    Search in Market
                  </button>
                </div>
              )
            ) : (
              /* Quick Suggestion when empty */
              <div className="p-3 text-xs space-y-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 mb-2">
                    Quick Navigation
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {navigationItems.slice(0, 6).map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectNav(item.id)}
                          className="flex items-center gap-2 p-2 rounded-xl text-left hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
                        >
                          <Icon className="w-3.5 h-3.5 text-[#016EA6]" />
                          <span className="font-medium text-xs text-gray-800">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-gray-50 pt-2 px-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Popular searches
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Carpentry", "Plumbing", "Electrical", "Painting", "Escrow"].map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setSearchQuery(term);
                          handleFullSearch(role === "employer" ? "browse-professionals" : "browse-jobs");
                        }}
                        className="text-[11px] px-2.5 py-1 bg-gray-50 hover:bg-sky-50 text-gray-600 hover:text-[#016EA6] rounded-lg transition-colors cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Side Options */}
      <div className="flex items-center gap-2 sm:gap-6">
        {/* Mobile Search Trigger */}
        <button
          onClick={() => setMobileSearchOpen(true)}
          className="p-2 text-gray-500 hover:text-gray-900 bg-sky-50 hover:bg-sky-100 rounded-xl transition-all cursor-pointer md:hidden flex items-center justify-center"
          title="Open Search"
        >
          <FiSearch className="w-5 h-5 text-gray-600" />
        </button>

        {/* Messages Alert */}
        <button
          onClick={() => setActiveTab(role === "employer" ? "messages" : "chat")}
          className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all cursor-pointer"
          title="Messages"
        >
          <MessageIcon className="w-5 h-5" />
          {unreadMessagesCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#016EA6] rounded-full ring-2 ring-white animate-pulse" />
          )}
        </button>

        {/* Notifications Alert */}
        <button
          onClick={() => {
            setActiveTab("overview");
            setTimeout(() => {
              const el = document.getElementById("notifications-section") || document.getElementById("employer-notifications-mobile");
              el?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
          className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all cursor-pointer hidden md:block"
          title="Notifications"
        >
          <FiBell className="w-5 h-5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
          )}
        </button>

        {/* Vertical Divider */}
        <div className="w-px h-6 bg-gray-100 hidden sm:block" />

        {/* Profile Avatar Dropdown */}
        <div className="relative bg-white rounded-full p-0.6" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1 rounded-full hover:bg-white transition-all cursor-pointer"
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
                {user?.fullName || user?.full_name || (role === "employer" ? "Employer User" : "Samuel Owoniyi")}
              </p>
              <p className="text-[10px] text-gray-400 capitalize">
                {role}
              </p>
            </div>
            <FiChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 hidden md:block ${dropdownOpen ? "rotate-180" : ""
                }`}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-slide-up">
              <div className="px-4 py-2 border-b border-gray-50">
                <p className="text-sm font-semibold text-gray-900 leading-none">
                  {user?.fullName || user?.full_name || (role === "employer" ? "Employer User" : "Samuel Owoniyi")}
                </p>
                <p className="text-xs text-gray-400 mt-1 truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveTab(role === "employer" ? "overview" : "profile");
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
              >
                <FiUser className="w-4 h-4" />
                <span>{role === "employer" ? "Account Overview" : "View Profile"}</span>
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

      {/* ── Mobile Global Search Modal ── */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex flex-col justify-start md:hidden p-4">
          <div className="bg-white rounded-3xl p-4 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  ref={mobileSearchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDownInput}
                  placeholder="Search jobs, pages, messages..."
                  className="w-full pl-10 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm outline-none focus:border-[#016EA6] focus:bg-white text-gray-900 font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setMobileSearchOpen(false)}
                className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 shrink-0"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Results Container */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {searchQuery.trim() ? (
                hasResults ? (
                  <>
                    {/* Navigation */}
                    {searchResults.navMatches.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Pages</p>
                        {searchResults.navMatches.map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleSelectNav(item.id)}
                              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-sky-50 text-left"
                            >
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4 text-[#016EA6]" />
                                <span className="font-semibold text-xs text-gray-800">{item.label}</span>
                              </div>
                              <FiArrowRight className="w-3 h-3 text-gray-400" />
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Jobs */}
                    {searchResults.jobMatches.length > 0 && (
                      <div className="border-t border-gray-100 pt-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Jobs</p>
                        {searchResults.jobMatches.map((job, idx) => (
                          <button
                            key={job.id || idx}
                            onClick={() => handleSelectJob(job)}
                            className="w-full p-2.5 rounded-xl bg-gray-50/70 hover:bg-sky-50 text-left mb-1.5 flex items-center justify-between"
                          >
                            <div>
                              <p className="font-bold text-xs text-gray-900">{job.title || "Job Item"}</p>
                              <p className="text-[10px] text-gray-400">{job.category?.name || job.category || "General"}</p>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                              {job.status || "Active"}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => handleFullSearch(role === "employer" ? "browse-professionals" : "browse-jobs")}
                      className="w-full py-2.5 bg-[#016EA6] text-white rounded-xl text-xs font-bold mt-2"
                    >
                      Search Marketplace for "{searchQuery}"
                    </button>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-xs font-semibold text-gray-700">No results found</p>
                    <button
                      onClick={() => handleFullSearch(role === "employer" ? "browse-professionals" : "browse-jobs")}
                      className="mt-3 px-4 py-2 bg-[#016EA6] text-white rounded-full text-xs font-bold"
                    >
                      Search in Market
                    </button>
                  </div>
                )
              ) : (
                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Quick Navigation</p>
                  <div className="grid grid-cols-2 gap-2">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectNav(item.id)}
                          className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl text-left"
                        >
                          <Icon className="w-3.5 h-3.5 text-[#016EA6]" />
                          <span className="text-xs font-semibold text-gray-800">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default DashboardNavbar;
