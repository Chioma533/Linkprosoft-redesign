/**
 * Three verification badge categories and their visual designs:
 * 1. Professional Verified: Blue (#016EA6)
 * 2. Company / Employer Verified: Gold (#D69A16)
 * 3. Government Verified: Ash/Grey (#73777D)
 */
export const VERIFICATION_TIERS = {
  professional: {
    category: "professional",
    name: "Professional Verified",
    hexColor: "#016EA6",
    className: "bg-[#e6f1f6] text-[#016EA6]",
    ariaLabel: "Verified professional account",
    code: "PRO",
    icon: "badge-check",
    requiresSubscriptionMaintenance: true,
  },
  company: {
    category: "company",
    name: "Company / Employer Verified",
    hexColor: "#D69A16",
    className: "bg-[#fdf6e7] text-[#D69A16]",
    ariaLabel: "Verified company account",
    code: "CORP",
    icon: "building",
    requiresSubscriptionMaintenance: true,
  },
  government: {
    category: "government",
    name: "Government Verified",
    hexColor: "#73777D",
    className: "bg-[#f1f2f3] text-[#73777D]",
    ariaLabel: "Government verified institution",
    code: "GOV",
    icon: "landmark",
    requiresSubscriptionMaintenance: false, // Institutionally validated only
  },
};

/**
 * Checks if subscription maintenance has lapsed (expired, failed, canceled).
 * @param {Object} user 
 * @returns {boolean}
 */
export const isSubscriptionLapsed = (user = {}) => {
  if (!user) return false;

  const rawStatus = (
    user.subscription_status ||
    user.subscriptionStatus ||
    user.subscription?.status ||
    ""
  ).toLowerCase();

  const lapsedStatuses = ["expired", "failed", "past_due", "canceled", "cancelled", "unpaid"];
  if (lapsedStatuses.includes(rawStatus)) {
    return true;
  }

  if (
    user.badge_maintained === false ||
    user.has_active_subscription === false ||
    user.is_subscription_active === false ||
    user.subscription?.is_active === false
  ) {
    return true;
  }

  return false;
};

/**
 * Checks if certification has expired.
 * @param {Object} user 
 * @returns {boolean}
 */
export const isCertificationExpired = (user = {}) => {
  if (!user) return false;

  if (user.certification_status === "expired" || user.is_certification_expired === true) {
    return true;
  }

  if (user.certification_expiry_date) {
    const expiry = new Date(user.certification_expiry_date);
    if (!isNaN(expiry.getTime()) && expiry.getTime() < Date.now()) {
      return true;
    }
  }

  return false;
};

/**
 * Resolves the verification tier/category for a user.
 * Company verification is NOT granted merely because an account has an employer role.
 * Government verification requires institutional validation and cannot be granted via ratings.
 *
 * @param {Object} user
 * @returns {"professional" | "company" | "government" | null}
 */
export const resolveVerificationCategory = (user = {}) => {
  if (!user) return null;

  const category = (
    user.verification_category ||
    user.verificationCategory ||
    user.category ||
    ""
  ).toLowerCase();

  const role = (user.role || user.account_type || user.accountType || "").toLowerCase();

  // 1. Government Verified Agency / Institution
  if (
    category === "government" ||
    category === "government_agency" ||
    category === "government_institution" ||
    role === "government" ||
    role === "government_agency" ||
    role === "government_official"
  ) {
    // Government verification must not be obtained via professional ratings or ordinary employer subscriptions
    if (user.pathway === "rating" || user.is_rating_verified) {
      return null;
    }
    return "government";
  }

  // 2. Company / Employer Verified
  // Must NOT automatically be granted simply because an account has an employer role.
  if (
    category === "company" ||
    category === "corporate" ||
    role === "company" ||
    (category === "employer" && (user.is_company_verified || user.company_verified || user.business_registration || user.business_name)) ||
    (role === "employer" && (user.is_company_verified || user.company_verified || user.business_registration || user.business_name || category === "company"))
  ) {
    return "company";
  }

  // An employer role without business/company verification evidence does NOT qualify for company badge
  if (role === "employer") {
    return null;
  }

  // 3. Professional Verified
  if (category === "professional" || role === "professional" || role === "artisan") {
    return "professional";
  }

  return null;
};

/**
 * Evaluates whether an account is verified, actively maintained, and returns the badge configuration.
 * Returns null if the user is unverified, subscription has lapsed, or category is unsupported.
 * Never displays a placeholder, default, or grey badge for unverified users.
 *
 * @param {Object} user
 * @returns {Object|null}
 */
export const getVerificationBadge = (user = {}) => {
  if (!user || typeof user !== "object") return null;

  // Email verification alone never displays an account verification badge
  if (user.is_email_verified && !user.verification_status && !user.verificationStatus && !user.verified) {
    return null;
  }

  // Check verification status
  const rawStatus = (
    user.verification_status ||
    user.verificationStatus ||
    (user.verified === "verified" ? "verified" : null) ||
    (user.isVerified === true ? "verified" : null) ||
    user.verification?.status ||
    ""
  ).toLowerCase();

  if (rawStatus !== "verified" && rawStatus !== "approved") {
    return null;
  }

  // Determine verification category
  const categoryKey = resolveVerificationCategory(user);
  if (!categoryKey || !VERIFICATION_TIERS[categoryKey]) {
    return null;
  }

  const tier = VERIFICATION_TIERS[categoryKey];

  // Professional: check certification expiry if applicable
  if (categoryKey === "professional" && isCertificationExpired(user)) {
    return null;
  }

  // Subscription-based maintenance:
  // Active subscription maintains badge display for Professional and Company categories.
  // When subscription expires or payment fails, badge should no longer appear.
  // Government verification is institutionally validated and exempt from ordinary subscription maintenance.
  if (tier.requiresSubscriptionMaintenance && isSubscriptionLapsed(user)) {
    return null;
  }

  // Construct return payload with enumerable core properties and helper metadata
  const badge = {
    category: tier.category,
    className: tier.className,
    ariaLabel: tier.ariaLabel,
  };

  Object.defineProperty(badge, "hexColor", { value: tier.hexColor, enumerable: false, writable: true });
  Object.defineProperty(badge, "name", { value: tier.name, enumerable: false, writable: true });
  Object.defineProperty(badge, "code", { value: tier.code, enumerable: false, writable: true });
  Object.defineProperty(badge, "icon", { value: tier.icon, enumerable: false, writable: true });

  return badge;
};
