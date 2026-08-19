import React from "react";

const FilterSelect = ({
  icon: Icon,
  value,
  onChange,
  options = [],
  className = "",
}) => {
  return (
    <div
      className={`relative w-full lg:w-auto lg:flex-1 lg:max-w-45 ${className}`}
    >
      {Icon && (
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
      )}

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-11 pr-8 py-2.5 bg-gray-50 border border-gray-100 rounded-full text-xs outline-none appearance-none cursor-pointer text-gray-500 font-semibold"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterSelect;
