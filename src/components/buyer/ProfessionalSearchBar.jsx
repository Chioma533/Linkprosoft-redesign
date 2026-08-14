import React, { useState, useRef, useEffect } from "react";
import { FiSearch, FiMapPin, FiStar, FiChevronDown } from "react-icons/fi";

const ProfessionalSearchBar = ({ onApply }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState("");
  const [budget, setBudget] = useState("");

  const [openDropdown, setOpenDropdown] = useState(null); // 'location' | 'rating' | 'budget' | null

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

  const locations = ["All Locations", "Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano", "Enugu"];
  const ratings = ["Any Rating", "5 Stars", "4+ Stars", "3+ Stars"];
  const budgets = ["Any Budget", "Under ₦5,000", "₦5,000 – ₦20,000", "₦20,000 – ₦50,000", "₦50,000+"];

  const toggle = (name) => setOpenDropdown(openDropdown === name ? null : name);

  const FilterDropdown = ({ id, icon: Icon, label, value, options, name, onSelect }) => (
    <div className="relative shrink-0">
      <button
        type="button"
        id={id}
        onClick={() => toggle(name)}
        className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-gray-300 transition-all duration-150 whitespace-nowrap cursor-pointer"
      >
        {Icon && <Icon className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
        <span className="font-medium">{value || label}</span>
        <FiChevronDown
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-150 ${openDropdown === name ? "rotate-180" : ""}`}
        />
      </button>
      {openDropdown === name && (
        <div className="absolute top-full left-0 mt-1.5 min-w-[160px] bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-40">
          {options.map((opt) => (
            <button
              type="button"
              key={opt}
              onClick={() => { onSelect(opt === options[0] ? "" : opt); setOpenDropdown(null); }}
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
    <form ref={barRef} onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2 py-2">
      {/* Search input — pill shaped */}
      <div className="relative flex-1 min-w-0">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        <input
          id="search-professionals-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search by profession (e.g., Carpenter, Plumber, Electrician)..."
          className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm outline-none focus:border-[#016EA6] transition-all duration-200 text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        <FilterDropdown
          id="filter-location-btn"
          icon={FiMapPin}
          label="Location"
          value={location}
          options={locations}
          name="location"
          onSelect={setLocation}
        />

        <FilterDropdown
          id="filter-rating-btn"
          icon={FiStar}
          label="Rating"
          value={rating}
          options={ratings}
          name="rating"
          onSelect={setRating}
        />

        <FilterDropdown
          id="filter-budget-btn"
          icon={null}
          label="Budget"
          value={budget}
          options={budgets}
          name="budget"
          onSelect={setBudget}
        />

        {/* Apply button — pill, light grey matching Figma */}
        <button
          id="filter-apply-btn"
          type="submit"
          className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap"
        >
          Apply
        </button>
      </div>
    </form>
  );
};

export default ProfessionalSearchBar;
