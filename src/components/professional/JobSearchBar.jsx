import React, { useState, useRef, useEffect } from "react";
import { FiSearch, FiMapPin, FiCalendar, FiDollarSign, FiChevronDown } from "react-icons/fi";

/**
 * JobSearchBar — search bar for DefaultProfessionalScreen.
 * Matches Figma: search input + Location | Date posted | Budget pill dropdowns + Apply button in one row.
 */
const JobSearchBar = ({ onApply }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [datePosted, setDatePosted] = useState("");
  const [budget, setBudget] = useState("");

  const [openDropdown, setOpenDropdown] = useState(null);

  const barRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (barRef.current && !barRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const locations = [
    "All Locations",
    "Lagos",
    "Abuja",
    "Port Harcourt",
    "Ibadan",
    "Kano",
    "Enugu",
    "Remote",
  ];

  const dateOptions = [
    "Any time",
    "Today",
    "This week",
    "This month",
    "Last 3 months",
  ];

  const budgets = [
    "Any Budget",
    "Under ₦5,000",
    "₦5,000 – ₦20,000",
    "₦20,000 – ₦50,000",
    "₦50,000+",
  ];

  const toggle = (name) =>
    setOpenDropdown(openDropdown === name ? null : name);

  const FilterDropdown = ({
    id,
    icon: Icon,
    label,
    value,
    options,
    name,
    onSelect,
  }) => (
    <div className="relative shrink-0">
      <button
        id={id}
        onClick={() => toggle(name)}
        className="flex items-center gap-1 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-full text-xs sm:text-sm text-gray-600 hover:border-gray-300 transition-all duration-150 whitespace-nowrap cursor-pointer min-h-[36px] sm:min-h-[42px]"
      >
        {Icon && <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 shrink-0" />}
        <span className="font-medium">{value || label}</span>
        <FiChevronDown
          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 transition-transform duration-150 ${
            openDropdown === name ? "rotate-180" : ""
          }`}
        />
      </button>
      {openDropdown === name && (
        <div className="absolute top-full left-0 mt-1.5 min-w-[160px] bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-40">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onSelect(opt === options[0] ? "" : opt);
                setOpenDropdown(null);
              }}
              className={`w-full px-4 py-2 text-sm text-left transition-colors ${
                (value || options[0]) === opt
                  ? "bg-[#016EA6]/5 text-[#016EA6] font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div
      ref={barRef}
      className="flex items-center gap-2 overflow-x-auto flex-nowrap w-full py-1 sm:py-2 hide-scrollbar"
    >
      {/* Search input — pill shaped in single row */}
      <div className="relative flex-1 min-w-[140px] sm:min-w-[200px] shrink-0 sm:shrink">
        <FiSearch className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4 pointer-events-none" />
        <input
          id="search-jobs-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Jobs"
          className="w-full pl-9 sm:pl-11 pr-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-full text-xs sm:text-sm outline-none focus:border-[#016EA6] transition-all duration-200 text-gray-700 placeholder-gray-400 min-h-[36px] sm:min-h-[42px]"
        />
      </div>

      {/* Filter pills */}
      <FilterDropdown
        id="filter-job-location-btn"
        icon={FiMapPin}
        label="Location"
        value={location}
        options={locations}
        name="location"
        onSelect={setLocation}
      />

      <FilterDropdown
        id="filter-date-posted-btn"
        icon={FiCalendar}
        label="Date posted"
        value={datePosted}
        options={dateOptions}
        name="datePosted"
        onSelect={setDatePosted}
      />

      <FilterDropdown
        id="filter-job-budget-btn"
        icon={FiDollarSign}
        label="Budget"
        value={budget}
        options={budgets}
        name="budget"
        onSelect={setBudget}
      />

      {/* Apply button */}
      <button
        id="job-filter-apply-btn"
        onClick={() => {
          onApply?.({ searchQuery, location, datePosted, budget });
          setOpenDropdown(null);
        }}
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs sm:text-sm rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 min-h-[36px] sm:min-h-[42px]"
      >
        Apply
      </button>
    </div>
  );
};

export default JobSearchBar;
