import test from "node:test";
import assert from "node:assert/strict";
import {
  dispatchSessionExpired,
  isProtectedRoute,
  SESSION_EXPIRED_EVENT,
  shouldHandleSessionExpiry,
} from "../src/utils/sessionExpiry.js";

test("401s from unauthenticated auth flows do not trigger session expiry", () => {
  for (const url of [
    "/api/auth/login",
    "/api/auth/signup",
    "/api/auth/verify-email",
    "/api/auth/resend-otp",
    "/api/auth/forgot-password",
    "/api/auth/verify-reset-code",
    "/api/auth/reset-password",
    "/api/auth/refresh-token",
    "/api/auth/verify",
    "/api/auth/me",
  ]) {
    assert.equal(shouldHandleSessionExpiry(401, url), false, url);
  }
  assert.equal(shouldHandleSessionExpiry(401, "/api/auth/linked-accounts"), true);
  assert.equal(shouldHandleSessionExpiry(403, "/api/auth/linked-accounts"), false);
});

test("session expiry detection handles absolute URLs and query strings", () => {
  assert.equal(
    shouldHandleSessionExpiry(401, "https://api.example.test/api/jobs?page=2"),
    true,
  );
});

test("protected route detection covers dashboard routes but not public pages", () => {
  assert.equal(isProtectedRoute("/professional/dashboard"), true);
  assert.equal(isProtectedRoute("/employer/verification"), true);
  assert.equal(isProtectedRoute("/professional/verification"), true);
  assert.equal(isProtectedRoute("/employers/123"), true);
  assert.equal(isProtectedRoute("/professionals"), false);
  assert.equal(isProtectedRoute("/login"), false);
});

test("dispatches a session-expired event for the application handler", () => {
  let eventType;
  dispatchSessionExpired({
    dispatchEvent: (event) => {
      eventType = event.type;
    },
  });
  assert.equal(eventType, SESSION_EXPIRED_EVENT);
});
