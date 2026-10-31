import test from "node:test";
import assert from "node:assert/strict";
import { clearPersistedAuth, getCookieSessionUser } from "../src/utils/cookieSession.js";

const response = (status, body = {}) => ({ status, ok: status >= 200 && status < 300, json: async () => body });

test("logout cleanup removes only persisted auth values", () => {
  const removed = [];
  clearPersistedAuth({ removeItem: (key) => removed.push(key) });
  assert.deepEqual(removed.sort(), ["accessToken", "refreshToken", "token", "user"].sort());
});

test("cookie callback ignores an old bearer token and uses the /me response", async () => {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    return response(200, { data: { user: { id: "179d1c7e-2eb6-4fc6-bf43-7fb8da78e782", role: "professional" } } });
  };

  const user = await getCookieSessionUser(fetchImpl, "https://api.example.test");
  assert.equal(user.id, "179d1c7e-2eb6-4fc6-bf43-7fb8da78e782");
  assert.deepEqual(calls[0].options, { credentials: "include" });
  assert.equal(calls[0].options.headers, undefined);
});

test("a 401 refreshes the cookie session once and profile state comes from the retried /me", async () => {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    if (url.endsWith("/me") && calls.filter((call) => call.url.endsWith("/me")).length === 1) return response(401);
    if (url.endsWith("/refresh-token")) return response(204);
    return response(200, { user: { id: "new-cookie-user", role: "employer" } });
  };

  const user = await getCookieSessionUser(fetchImpl, "https://api.example.test/");
  assert.deepEqual(user, { id: "new-cookie-user", role: "employer" });
  assert.deepEqual(calls.map((call) => call.url), [
    "https://api.example.test/api/auth/me",
    "https://api.example.test/api/auth/refresh-token",
    "https://api.example.test/api/auth/me",
  ]);
});
