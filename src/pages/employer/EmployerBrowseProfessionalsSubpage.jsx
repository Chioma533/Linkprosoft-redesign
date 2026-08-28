import React, { useEffect, useState, useRef } from "react";
import { FiStar, FiCheckCircle, FiSearch, FiMapPin, FiMail, FiBookmark, FiCalendar } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { searchService } from "../../api/services/searchService";
import LoadingScreen from "../../components/common/preloader/LoadingScreen";
import { useAuthStore } from "../../store/authStore";
import { useDashboardStore } from "../../store/dashboardStore";
import StatsCard from "../../components/ui/StatsCard";
import ToggleOffIcon from "../../components/icons/ToggleOffIcon";
import InformationCircleIcon from "../../components/icons/InformationCircleIcon";
import DatabaseLockedIcon from "../../components/icons/DatabaseLockedIcon";
import BorderFullIcon from "../../components/icons/BorderFullIcon";

const EmployerBrowseProfessionalsSubpage = () => {
  const [professionals, setProfessionals] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [minTimePassed, setMinTimePassed] = useState(false);

  const { user } = useAuthStore();
  const { globalSearchQuery } = useDashboardStore();
  const userName = user?.fullName || user?.full_name || "Elvis Chimamanda";

  const getProName = (pro) => {
    return (
      pro?.name ||
      pro?.fullName ||
      pro?.full_name ||
      pro?.user?.name ||
      pro?.user?.fullName ||
      [pro?.firstName || pro?.first_name, pro?.lastName || pro?.last_name].filter(Boolean).join(" ") ||
      "Professional"
    );
  };

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "P";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "P";
    return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace("NGN", "₦");
  };

  // Filters
  const [searchQuery, setSearchQuery] = useState(globalSearchQuery || ""); // for skill autocomplete
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedSort, setSelectedSort] = useState("Sort by: Newest");
  const [selectedSkills, setSelectedSkills] = useState([]); // array of skill IDs
  const [skillSuggestions, setSkillSuggestions] = useState([]); // for autocomplete dropdown

  useEffect(() => {
    if (globalSearchQuery) {
      setSearchQuery(globalSearchQuery);
    }
  }, [globalSearchQuery]);

  // Map UI sort to API sortBy
  const getSortBy = () => {
    switch (selectedSort) {
      case "Sort by: Newest":
        return "recent_desc";
      case "Sort by: Rating High → Low":
        return "rating_desc";
      case "Sort by: Rate Low → High":
        return "rate_asc";
      case "Sort by: Rate High → Low":
        return "rate_desc";
      default:
        return "rating_desc";
    }
  };

  // Fetch professionals based on current filters
  const fetchProfessionals = async (isInitial = false) => {
    if (isInitial) {
      setIsInitialLoading(true);
    } else {
      setIsSearching(true);
    }
    setError(null);
    try {
      const params = {
        profession: searchQuery.trim() || undefined,
        skills: selectedSkills.length > 0 ? selectedSkills.join(",") : undefined,
        availabilityStatus: undefined,
        sortBy: getSortBy(),
        page,
        limit,
      };
      // Remove undefined params
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined)
      );

      const response = await searchService.searchProfessionalsByProfession(filteredParams);

      const payload = response?.data ?? response;

      const items = Array.isArray(payload?.professionals)
        ? payload.professionals
        : Array.isArray(payload?.items)
          ? payload.items
          : Array.isArray(payload)
            ? payload
            : [];

      setProfessionals(items);
      setTotal(payload?.meta?.total || payload?.total || items.length);
      setTotalPages(payload?.meta?.pages || payload?.totalPages || 1);
      setPage(payload?.meta?.page || payload?.page || page);
    } catch (err) {
      setError(err.message || "Something went wrong");
      toast.error(err.message || "Failed to load professionals");
    } finally {
      if (isInitial) {
        setIsInitialLoading(false);
      } else {
        setIsSearching(false);
      }
    }
  };

  // Fetch skill suggestions based on searchQuery
  const fetchSkillSuggestions = async () => {
    if (!searchQuery || searchQuery.length < 2) {
      setSkillSuggestions([]);
      return;
    }
    try {
      const response = await searchService.getSkillSuggestions(searchQuery, 10);
      if (response.success) {
        setSkillSuggestions(response.data.skills || []);
      }
    } catch (err) {
      console.error("Failed to fetch skill suggestions", err);
    }
  };

  const isFirstMount = useRef(true);

  // Initial page mount
  useEffect(() => {
    const minTimer = setTimeout(() => setMinTimePassed(true), 2500);
    fetchProfessionals(true);
    return () => clearTimeout(minTimer);
  }, []);

  // Effect to fetch professionals when filters or page change.
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    fetchProfessionals(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocation, selectedSort, selectedSkills, limit, page]);

  // Effect to fetch skill suggestions when searchQuery changes
  useEffect(() => {
    fetchSkillSuggestions();
  }, [searchQuery]);

  const resetPage = () => {
    setPage(1);
  };

  const handleSkillSelect = (skillId) => {
    // Add skill to selectedSkills if not already present
    if (!selectedSkills.includes(skillId)) {
      setSelectedSkills([...selectedSkills, skillId]);
    }
    // Clear search query after selecting
    setSearchQuery("");
    setSkillSuggestions([]);
  };

  const handleSkillRemove = (skillIdToRemove) => {
    setSelectedSkills(selectedSkills.filter((id) => id !== skillIdToRemove));
  };

  const handleFilterClick = () => {
    // Trigger fetch with current filters
    fetchProfessionals(false);
  };

  const locationFiltered = professionals.filter((pro) => {
    const loc = (pro.location || "").toLowerCase();
    return selectedLocation === "All Locations" || loc.includes(selectedLocation.toLowerCase());
  });

  if (isInitialLoading || !minTimePassed) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 text-center">
        <p>Error: {error}</p>
        <button
          onClick={fetchProfessionals}
          className="mt-4 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div className="md:hidden space-y-6">
        {/* Welcome Header */}
        <div>
          <h2 className="text-2xl font-normal text-gray-900">{getGreeting()} {userName}</h2>
          <p className="text-xs text-gray-400 mt-1 font-light">Manage, jobs, appointment, finance and schedules</p>
        </div>

        {/* Stats Row (2x2) */}
        <div className="grid grid-cols-2 gap-4">
          <StatsCard title="Active jobs" value={formatCurrency(500000)} icon={ToggleOffIcon} iconColor="text-blue-500" />
          <StatsCard title="Upcoming jobs" value="172" icon={InformationCircleIcon} iconColor="text-orange-500" BgColor="bg-[#fff4ea]" />
          <StatsCard title="Completed jobs" value="1292" icon={DatabaseLockedIcon} iconColor="text-green-500" />
          <StatsCard title="Performance" value="80%" icon={BorderFullIcon} iconColor="text-emerald-500" />
        </div>

        {/* Filter Row (rounded-full inputs side by side with icons) */}
        <div className="flex gap-2 items-center overflow-x-auto pb-2 scrollbar-none">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[130px] shrink-0">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3" />
            <input
              type="text"
              placeholder="Search Jobs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-white border border-[#e9e8e7] rounded-full text-[10px] font-medium outline-none focus:border-[#016EA6]"
            />
          </div>

          {/* Location Dropdown */}
          <div className="relative shrink-0">
            <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="pl-8 pr-6 py-2 bg-white border border-[#e9e8e7] rounded-full text-[10px] font-semibold text-gray-500 outline-none cursor-pointer appearance-none"
            >
              <option>Location</option>
              <option value="All Locations">All Locations</option>
              <option>Lekki</option>
              <option>Ikeja</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400">
              <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          {/* Sort / Date posted Dropdown */}
          <div className="relative shrink-0">
            <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3" />
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="pl-8 pr-6 py-2 bg-white border border-[#e9e8e7] rounded-full text-[10px] font-semibold text-gray-500 outline-none cursor-pointer appearance-none"
            >
              <option>Date posted</option>
              <option value="Sort by: Newest">Sort by: Newest</option>
              <option value="Sort by: Rating High → Low">Rating High → Low</option>
              <option value="Sort by: Rate Low → High">Rate Low → High</option>
              <option value="Sort by: Rate High → Low">Rate High → Low</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400">
              <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card List of Professionals */}
        <div className="space-y-4 min-h-[200px]">
          {isSearching ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-9 h-9 border-3 border-[#016EA6]/20 border-t-[#016EA6] rounded-full animate-spin" />
              <p className="text-xs font-semibold text-gray-500 animate-pulse">
                Searching professionals...
              </p>
            </div>
          ) : (
            locationFiltered.map((pro) => {
              const proName = getProName(pro);
              const initials = getInitials(proName);
              return (
                <div
                  key={pro.id}
                  className="bg-white p-5 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col gap-4 relative"
                >
                  {/* Header: Avatar, Info, Bookmark icon */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Round Avatar */}
                      <div className="w-12 h-12 rounded-full bg-[#016EA6]/10 text-[#016EA6] flex items-center justify-center font-extrabold text-sm relative shrink-0">
                        {pro.avatarUrl ? (
                          <img
                            src={pro.avatarUrl}
                            alt={`${proName} avatar`}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <>{initials}</>
                        )}
                        <span
                          className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center"
                          title="Verified Pro"
                        >
                          <FiCheckCircle className="w-3 h-3 text-white fill-current" />
                        </span>
                      </div>

                      {/* Name and Professional details */}
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-gray-900 text-sm leading-snug">
                          {proName}
                        </h4>
                        <div className="text-[11px] text-[#016EA6] font-semibold">
                          {pro.profession || pro.role || "Professional"}
                        </div>
                        <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1.5">
                          <span className="text-amber-500 flex items-center gap-0.5">
                            <FiStar className="w-3 h-3 fill-current" />
                            {pro.rating || "5.0"}
                          </span>
                          <span>•</span>
                          <span>{pro.successRate || 95}% Success</span>
                        </div>
                      </div>
                    </div>

                    {/* Bookmark Button */}
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer shrink-0">
                      <FiBookmark className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Bio Description */}
                  <p className="text-xs text-gray-400 leading-relaxed font-medium line-clamp-3">
                    {pro.bio || pro.description || "No bio provided"}
                  </p>

                  {/* Footer: Price and Invite button */}
                  <div className="flex items-center justify-between border-t border-gray-50/80 pt-3 mt-1">
                    <div>
                      <span className="text-[10px] text-gray-400 block font-medium">Starting rate</span>
                      <span className="text-sm font-extrabold text-gray-800">
                        {formatCurrency(pro.hourlyRate || pro.rate || 10000)}/hr
                      </span>
                    </div>
                    <button
                      onClick={() => toast.success(`Invitation request sent to ${proName}!`)}
                      className="px-5 py-2 bg-[#EBF3FA] hover:bg-[#016EA6]/10 text-[#016EA6] rounded-full text-xs font-bold transition-all cursor-pointer"
                    >
                      Invite
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Mobile Pagination */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <span className="text-[10px] text-gray-400 font-semibold">Page {page} of {totalPages || 5}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer transition-colors ${page === 1 ? "bg-[#016EA6] text-white" : "border border-gray-100 text-gray-400"
                }`}
            >
              1
            </button>
            {totalPages > 2 && (
              <button
                onClick={() => setPage(2)}
                className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer transition-colors ${page === 2 ? "bg-[#016EA6] text-white" : "border border-gray-100 text-gray-400"
                  }`}
              >
                2
              </button>
            )}
            {totalPages > 3 && (
              <button
                onClick={() => setPage(3)}
                className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer transition-colors ${page === 3 ? "bg-[#016EA6] text-white" : "border border-gray-100 text-gray-400"
                  }`}
              >
                3
              </button>
            )}
            {totalPages > 4 && <span className="text-[10px] text-gray-400 font-bold px-1">..</span>}
            {totalPages > 1 && page !== totalPages && (
              <button
                onClick={() => setPage(totalPages)}
                className={`w-6 h-6 rounded-lg border border-gray-100 text-gray-400 text-xs font-bold flex items-center justify-center cursor-pointer hover:border-[#016EA6] hover:text-[#016EA6] transition-colors`}
              >
                {totalPages}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
           DESKTOP VIEW — hidden on mobile
         ───────────────────────────────────────────────────────────────────── */}
      <div className="hidden md:block space-y-6">
        {/* Welcome Header */}
        <div>
          <h2 className="text-2xl font-normal text-gray-900">Browse Professionals</h2>
          <p className="text-sm text-gray-400 mt-1 font-light">Manage your jobs and payments effortlessly.</p>
        </div>

        {/* Search Filter Row */}
        <div className="rounded-full flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search for a skill…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-[#e9e8e7] rounded-full text-xs outline-none focus:border-[#016EA6] focus:bg-white transition-all duration-200"
            />
            {/* Skill suggestions dropdown */}
            {skillSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-full max-w-xs">
                {skillSuggestions.map((skill) => (
                  <div
                    key={skill.id}
                    onClick={() => handleSkillSelect(skill.id)}
                    className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                  >
                    {skill.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full sm:w-44 pl-4 pr-8 py-2.5 bg-gray-50 border border-[#e9e8e7] rounded-full text-xs outline-none cursor-pointer text-gray-500 font-semibold"
            >
              <option>All Locations</option>
              <option>Lekki</option>
              <option>Ikeja</option>
            </select>

            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full sm:w-44 pl-4 pr-8 py-2.5 bg-gray-50 border border-[#e9e8e7] rounded-full text-xs outline-none cursor-pointer text-gray-500 font-semibold"
            >
              <option>Sort by: Newest</option>
              <option>Sort by: Rating High → Low</option>
              <option>Sort by: Rate Low → High</option>
              <option>Sort by: Rate High → Low</option>
            </select>

            <button
              onClick={handleFilterClick}
              disabled={isSearching}
              className="bg-[#016EA6] hover:bg-[#061EA6] text-white px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer text-center"
            >
              {isSearching ? "Filtering..." : "Filter"}
            </button>
          </div>
        </div>

        {/* Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[240px]">
          {isSearching ? (
            <div className="col-span-full py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-9 h-9 border-3 border-[#016EA6]/20 border-t-[#016EA6] rounded-full animate-spin" />
              <p className="text-xs font-semibold text-gray-500 animate-pulse">
                Searching professionals...
              </p>
            </div>
          ) : locationFiltered.length === 0 ? (
            <div className="col-span-full py-16 text-center text-gray-400">
              <FiSearch className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-semibold">No professionals found</p>
              <p className="text-xs mt-1">
                Try adjusting your search or location filter
              </p>
            </div>
          ) : (
            locationFiltered.map((pro) => {
              const proName = getProName(pro);
              const initials = getInitials(proName);
              return (
                <div
                  key={pro.id}
                  className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300"
                >
                  {/* Header info */}
                  <div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#016EA6]/10 text-[#016EA6] flex items-center justify-center font-extrabold text-sm relative shrink-0">
                        {pro.avatarUrl ? (
                          <img
                            src={pro.avatarUrl}
                            alt={`${proName} avatar`}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <>{initials}</>
                        )}
                        <span
                          className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center"
                          title="Verified Pro"
                        >
                          <FiCheckCircle className="w-3 h-3 text-white fill-current" />
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm leading-tight">
                          {proName}
                        </h3>
                        <span className="text-[10px] text-gray-400 font-bold">
                          {pro.profession || pro.role || "Professional"}
                        </span>
                      </div>
                    </div>

                    {/* Stats badges */}
                    <div className="flex items-center gap-4 mt-4 text-[10px] font-bold text-gray-500">
                      <span className="flex items-center gap-1 text-amber-500">
                        <FiStar className="w-3.5 h-3.5 fill-current" />
                        <span>{pro.rating || "5.0"} ({pro.reviewCount || 0} reviews)</span>
                      </span>
                      <span>•</span>
                      <span className="text-emerald-600 font-extrabold">{pro.successRate || 95}% Success</span>
                    </div>

                    {/* Bio description */}
                    <p className="text-xs text-gray-400 mt-4 leading-relaxed line-clamp-3 font-medium">
                      {pro.bio || pro.description || "No bio provided"}
                    </p>

                    {/* Skills list */}
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {pro.skills
                        ?.map((skill) => (typeof skill === "string" ? skill : skill.name))
                        .map((skillName, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2.5 py-1 bg-slate-50 text-gray-500 rounded-lg text-[9px] font-bold"
                          >
                            {skillName}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-50">
                    <button
                      className="flex-1 py-2.5 border border-gray-100 hover:bg-gray-50 text-gray-500 hover:text-gray-900 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FiMail className="w-3.5 h-3.5" />
                      <span>Message</span>
                    </button>
                    <button
                      onClick={() => toast.success(`Invitation request sent to ${proName}!`)}
                      className="flex-1 py-2.5 bg-[#016EA6] hover:bg-[#061EA6] text-white rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm text-center"
                    >
                      Invite to Project
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of {total} professionals
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
    </div >
  );
};

export default EmployerBrowseProfessionalsSubpage;