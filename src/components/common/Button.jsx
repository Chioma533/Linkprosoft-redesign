import clsx from "clsx";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  rounded = "full",
  disabled = false,
  className = "",
  onClick = () => {},
}) => {
  const base =
    "font-medium transition-all duration-300 flex items-center justify-center";

  const variants = {
    primary: "bg-[#061EA6] text-white hover:bg-[#061EA6]/90",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    // outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
    // danger: "bg-red-600 text-white hover:bg-red-700",
    // success: "bg-green-600 text-white hover:bg-green-700",
  };
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg",
  };
  const radius = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        base,
        variants[variant],
        sizes[size],
        radius[rounded],
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      {children}
    </button>
  );
};

export default Button;
