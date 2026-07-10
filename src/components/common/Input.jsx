import React, { useState } from "react";
import clsx from "clsx";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Input = React.forwardRef(
  (
    {
      label,
      type = "text",
      placeholder = "",
      error = "",
      helperText = "",
      required = false,
      disabled = false,
      loading = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      className = "",
      containerClassName = "",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className={clsx("w-full flex flex-col gap-1.5", containerClassName)}>
        {label && (
          <label className="text-sm font-medium text-gray-700 flex items-center gap-0.5">
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {LeftIcon && (
            <span className="absolute left-4 text-gray-400 pointer-events-none">
              <LeftIcon className="w-5 h-5" />
            </span>
          )}

          <input
            ref={ref}
            type={inputType}
            placeholder={placeholder}
            disabled={disabled || loading}
            className={clsx(
              "w-full px-4 py-3 bg-white border rounded-xl text-gray-900 transition-all duration-200 outline-none placeholder:text-gray-400 text-sm md:text-base",
              LeftIcon ? "pl-11" : "pl-4",
              isPassword || RightIcon ? "pr-11" : "pr-4",
              error
                ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                : "border-gray-200 focus:border-[#016EA6] focus:ring-1 focus:ring-[#016EA6]/20",
              disabled && "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed",
              className
            )}
            {...props}
          />

          {isPassword && !disabled && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors outline-none cursor-pointer hover:bg-transparent"
            >
              {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
            </button>
          )}

          {!isPassword && RightIcon && (
            <span className="absolute right-4 text-gray-400 pointer-events-none">
              <RightIcon className="w-5 h-5" />
            </span>
          )}
        </div>

        {error && <span className="text-xs text-red-500 mt-0.5 font-medium">{error}</span>}
        {!error && helperText && (
          <span className="text-xs text-gray-400 mt-0.5">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
