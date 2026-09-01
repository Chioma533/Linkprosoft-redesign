import React from "react";

const VerificationField = ({
  label,
  optional = false,
  error,
  helperText,
  className = "",
  ...props
}) => {
  return (
    <label className={`block text-xs text-[#44484a] ${className}`}>
      <span>
        {label} {optional && <span className="text-[#999d9f]">(Optional)</span>}
      </span>

      <input
        {...props}
        className={`mt-2 h-10 w-full rounded-full border px-4 text-xs text-[#333] outline-none transition placeholder:text-[#a5a8aa] ${
          error
            ? "border-red-400 focus:border-red-500"
            : "border-[#e7e8e8] focus:border-[#0879aa]"
        }`}
      />

      {error ? (
        <span className="mt-1 block text-[10px] text-red-500">{error}</span>
      ) : helperText ? (
        <span className="mt-1 block text-[10px] text-[#0879aa]">{helperText}</span>
      ) : null}
    </label>
  );
};

export default VerificationField;
