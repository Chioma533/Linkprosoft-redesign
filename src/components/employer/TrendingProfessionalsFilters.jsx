import { FiChevronDown, FiSearch } from "react-icons/fi";

const FILTERS = [
  { id: "topRated", label: "Top Rated" },
  { id: "available", label: "Available Today" },
  { id: "verified", label: "Verified" },
  { id: "trending", label: "Trending this week" },
];

const TrendingFilter = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    className={`shrink-0 rounded-full border px-4 py-2 text-xs transition-colors ${
      selected
        ? "border-[#016EA6] bg-[#016EA6] text-white"
        : "border-gray-200 bg-white text-gray-600 hover:border-[#016EA6] hover:text-[#016EA6]"
    }`}
  >
    {label}
  </button>
);

const TrendingProfessionalsFilters = ({
  search,
  onSearchChange,
  service,
  services,
  onServiceChange,
  selectedFilters,
  onToggleFilter,
}) => (
  <section
    aria-label="Search and filter professionals"
    className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center"
  >
    <label className="relative min-w-0 flex-1">
      <span className="sr-only">Search professionals</span>
      <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search Professionals"
        className="h-10 w-full rounded-full border border-gray-200 bg-white pl-9 pr-4 text-xs text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-[#016EA6]"
      />
    </label>

    <div className="flex gap-2 overflow-x-auto pb-1 lg:overflow-visible lg:pb-0">
      <label className="relative shrink-0">
        <span className="sr-only">Filter by service</span>
        <select
          value={service}
          onChange={(event) => onServiceChange(event.target.value)}
          className="h-10 min-w-32 appearance-none rounded-full border border-gray-200 bg-white py-2 pl-3 pr-8 text-xs text-gray-600 outline-none focus:border-[#016EA6]"
        >
          <option value="">All Services</option>
          {services.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
      </label>
      {FILTERS.map((filter) => (
        <TrendingFilter
          key={filter.id}
          label={filter.label}
          selected={selectedFilters.includes(filter.id)}
          onClick={() => onToggleFilter(filter.id)}
        />
      ))}
    </div>
  </section>
);

export default TrendingProfessionalsFilters;
