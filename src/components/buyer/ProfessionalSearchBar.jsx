import React, { useState, useRef, useEffect } from "react";
import { FiSearch, FiMapPin, FiStar, FiChevronDown } from "react-icons/fi";

const ProfessionalSearchBar = ({ onApply, initialQuery = "" }) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState("");
  const [budget, setBudget] = useState("");

  const [openDropdown, setOpenDropdown] = useState(null); // 'location' | 'rating' | 'budget' | null

  const barRef = useRef(null);

  useEffect(() => {
    if (initialQuery !== undefined) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    const handler = (e) => {
      if (barRef.current && !barRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const locations = ["All Locations", "Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano", "Enugu"];
  const ratings = ["Any Rating", "5 Stars", "4+ Stars", "3+ Stars"];
  const budgets = ["Any Budget", "Under ₦5,000", "₦5,000 – ₦20,000", "₦20,000 – ₦50,000", "₦50,000+"];

  const toggle = (name) => setOpenDropdown(openDropdown === name ? null : name);

  const handleFilterSelect = (filterName, optValue, setter) => {
    const nextVal = optValue === (filterName === "location" ? locations[0] : filterName === "rating" ? ratings[0] : budgets[0]) ? "" : optValue;
    setter(nextVal);
    setOpenDropdown(null);

    const updatedFilters = {
      searchQuery,
      location: filterName === "location" ? nextVal : location,
      rating: filterName === "rating" ? nextVal : rating,
      budget: filterName === "budget" ? nextVal : budget,
    };
    onApply?.(updatedFilters);
  };

  const FilterDropdown = ({ id, icon: Icon, label, value, options, name, setter }) => (
    <div className="relative shrink-0">
      <button
        type="button"
        id={id}
        onClick={() => toggle(name)}
        className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-full text-xs sm:text-sm text-gray-600 hover:border-gray-300 transition-all duration-150 whitespace-nowrap cursor-pointer min-h-[36px] sm:min-h-[42px]"
      >
        {Icon && <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 shrink-0" />}
        <span className="font-medium">{value || label}</span>
        <FiChevronDown
          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 transition-transform duration-150 ${openDropdown === name ? "rotate-180" : ""}`}
        />
      </button>
      {openDropdown === name && (
        <div className="absolute top-full left-0 mt-1.5 min-w-[160px] bg-white border border-gray-100 rounded-full shadow-lg py-1 z-40">
          {options.map((opt) => (
            <button
              type="button"
              key={opt}
              onClick={() => handleFilterSelect(name, opt, setter)}
              className={`w-full px-4 py-2 text-sm text-left transition-colors ${(value || options[0]) === opt
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

  const handleSubmit = (e) => {
    e?.preventDefault();
    onApply?.({ searchQuery, location, rating, budget });
    setOpenDropdown(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      ref={barRef}
      onSubmit={handleSubmit}
      className="flex items-center gap-2 overflow-x-auto flex-nowrap w-full py-1 sm:py-2 hide-scrollbar scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {/* Search input — pill shaped in single horizontal row */}
      <div className="relative flex-1 min-w-[140px] sm:min-w-[200px] shrink-0 sm:shrink">
        <FiSearch className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4 pointer-events-none" />
        <input
          id="search-professionals-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search by profession (e.g., Carpenter, Plumber)..."
          className="w-full pl-9 sm:pl-11 pr-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-full text-xs sm:text-sm outline-none focus:border-[#016EA6] transition-all duration-200 text-gray-700 placeholder-gray-400 min-h-[36px] sm:min-h-[42px]"
        />
      </div>

      {/* Filter pills aligned in same row */}
      <FilterDropdown
        id="filter-location-btn"
        icon={FiMapPin}
        label="Location"
        value={location}
        options={locations}
        name="location"
        setter={setLocation}
      />

      <FilterDropdown
        id="filter-rating-btn"
        icon={FiStar}
        label="Rating"
        value={rating}
        options={ratings}
        name="rating"
        setter={setRating}
      />

      <FilterDropdown
        id="filter-budget-btn"
        icon={null}
        label="Budget"
        value={budget}
        options={budgets}
        name="budget"
        setter={setBudget}
      />
    </form>
  );
};

export default ProfessionalSearchBar;
