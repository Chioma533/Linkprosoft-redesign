import React from "react";

const PillGroup = ({ options, value, onChange }) => (
  <div className="flex flex-wrap gap-2.5 mt-3">
    {options.map((opt) => {
      const active = value === opt;
      return (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer ${
            active
              ? "border-[#016EA6] text-[#016EA6] bg-white shadow-sm"
              : "border-gray-200 text-gray-600 bg-white hover:border-gray-400"
          }`}
        >
          {opt}
        </button>
      );
    })}
  </div>
);

export default PillGroup;
