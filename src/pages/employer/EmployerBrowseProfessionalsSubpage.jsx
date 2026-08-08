import React, { useEffect, useState } from "react";
import { FiStar, FiCheckCircle, FiSearch, FiMapPin, FiMail } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { searchService } from "../../api/services/searchService";

const EmployerBrowseProfessionalsSubpage = () => {
  const [professionals, setProfessionals] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState(""); // for skill autocomplete
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedSort, setSelectedSort] = useState("Sort by: Newest");
  const [selectedSkills, setSelectedSkills] = useState([]); // array of skill IDs
  const [skillSuggestions, setSkillSuggestions] = useState([]); // for autocomplete dropdown

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
  const fetchProfessionals = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
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

      const response = await searchService.searchProfessionals(filteredParams);
      if (response && response.success && response.data) {
        const items = Array.isArray(response.data.professionals)
          ? response.data.professionals
          : Array.isArray(response.data.items)
          ? response.data.items
          : Array.isArray(response.data)
          ? response.data
          : [];
        setProfessionals(items);
        setTotal(response.data.meta?.total || response.data.total || items.length);
        setTotalPages(response.data.meta?.pages || response.data.totalPages || 1);
        setPage(response.data.meta?.page || response.data.page || 1);
      } else {
        throw new Error(response?.message || "Failed to fetch professionals");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      toast.error(err.message || "Failed to load professionals");
    } finally {
      setLoading(false);
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

  // Effect to fetch professionals when filters change
  useEffect(() => {
    resetPage();
    fetchProfessionals();
  }, [selectedLocation, selectedSort, selectedSkills, limit]);

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
    fetchProfessionals();
  };

  const locationFiltered = professionals.filter((pro) => {
    const loc = (pro.location || "").toLowerCase();
    return selectedLocation === "All Locations" || loc.includes(selectedLocation.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
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
            disabled={loading}
            className="bg-[#016EA6] hover:bg-[#061EA6] text-white px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer text-center"
          >
            {loading ? "Filtering..." : "Filter"}
          </button>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locationFiltered.map((pro, idx) => (
          <div
            key={pro.id}
            className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300"
          >
            {/* Header info */}
            <div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#016EA6]/10 text-[#016EA6] flex items-center justify-center font-extrabold text-sm relative">
                  {pro.avatarUrl ? (
                    <img
                      src={pro.avatarUrl}
                      alt={`${pro.name} avatar`}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <>
                      {pro.name
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </>
                  )}
                  <span
                    className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center"
                    title="Verified Pro"
                  >
                    <FiCheckCircle className="w-3 h-3 text-white fill-current" />
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm leading-tight">{pro.name}</h3>
                  <span className="text-[10px] text-gray-400 font-bold">{pro.profession || pro.role || "Professional"}</span>
                </div>
              </div>

              {/* Stats badges */}
              <div className="flex items-center gap-4 mt-4 text-[10px] font-bold text-gray-500">
                <span className="flex items-center gap-1 text-amber-500">
                  <FiStar className="w-3.5 h-3.5 fill-current" />
                  <span>{pro.rating} ({pro.reviewCount} reviews)</span>
                </span>
                <span>•</span>
                <span className="text-emerald-600 font-extrabold">{pro.successRate}% Success</span>
              </div>

              {/* Bio description */}
              <p className="text-xs text-gray-400 mt-4 leading-relaxed line-clamp-3 font-medium">
                {pro.bio}
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
                className="flex-1 py-2.5 border border-gray-100 hover:bg-gray-50 text-gray-500 hover:text-gray-900 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FiMail className="w-3.5 h-3.5" />
                <span>Message</span>
              </button>
              <button
                onClick={() => toast.success(`Invitation request sent to ${pro.name}!`)}
                className="flex-1 py-2.5 bg-[#016EA6] hover:bg-[#061EA6] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm text-center"
              >
                Invite to Project
              </button>
            </div>
          </div>
        ))}
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
  );
};

export default EmployerBrowseProfessionalsSubpage;