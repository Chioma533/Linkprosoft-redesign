export const SESSION_EXPIRED_EVENT = "app:session-expired";

const SESSION_EXPIRY_EXEMPT_PATHS = new Set([
  "/api/auth/signup",
  "/api/auth/login",
  "/api/auth/verify-email",
  "/api/auth/resend-otp",
  "/api/auth/forgot-password",
  "/api/auth/verify-reset-code",
  "/api/auth/reset-password",
  "/api/auth/refresh-token",
  "/api/auth/logout",
  "/api/auth/verify",
  "/api/auth/me",
]);

const PROTECTED_ROUTE_PATTERNS = [
  /^\/notifications\/?$/,
  /^\/home\/?$/,
  /^\/trending\/?$/,
  /^\/employer\/dashboard\/?$/,
  /^\/employer\/verification\/?$/,
  /^\/manage-jobs\/?$/,
  /^\/employers\/[^/]+\/?$/,
  /^\/professional\/(?:home|dashboard|verification)\/?$/,
  /^\/admin\/dashboard\/?$/,
];

const getRequestPath = (url = "") => {
  try {
    return new URL(url, "http://localhost").pathname;
  } catch {
    return String(url).split("?")[0];
  }
};

export const shouldHandleSessionExpiry = (status, url) =>
  status === 401 && !SESSION_EXPIRY_EXEMPT_PATHS.has(getRequestPath(url));

export const isProtectedRoute = (pathname) =>
  PROTECTED_ROUTE_PATTERNS.some((pattern) => pattern.test(pathname));

export const dispatchSessionExpired = (target = window) => {
  target.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
};
