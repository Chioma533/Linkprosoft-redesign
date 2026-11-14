export const RESERVED_PROFILE_SLUGS = new Set([
  "admin",
  "api",
  "auth",
  "browse-professionals",
  "community",
  "employer",
  "home",
  "login",
  "manage-jobs",
  "notifications",
  "payment-screen",
  "professional",
  "professionals",
  "signup",
  "test-preloader",
  "verification",
  "waitlist",
]);

export const normalizeProfileSlug = (value = "") => value
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "")
  .slice(0, 50);

export const getSlugValidationMessage = (slug) => {
  if (slug.length < 3) return "Use at least 3 letters or numbers.";
  if (RESERVED_PROFILE_SLUGS.has(slug)) return "This URL is reserved by Linkprosoft.";
  return "";
};
