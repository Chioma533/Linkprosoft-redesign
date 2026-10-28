const ROLE_CATEGORIES = {
  professional: {
    label: "professional",
    className: "bg-[#e6f1f6] text-[#016EA6]",
  },
};

export const getVerificationBadge = ({ verification_status, role } = {}) => {
  if (verification_status !== "verified") return null;

  const category = typeof role === "string" ? ROLE_CATEGORIES[role.toLowerCase()] : null;

  return {
    category: category?.label || null,
    className: category?.className || "bg-gray-100 text-gray-700",
    ariaLabel: category
      ? `Verified ${category.label} account`
      : "Verified account",
  };
};
