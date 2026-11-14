import test from "node:test";
import assert from "node:assert/strict";
import { RESERVED_PROFILE_SLUGS, getSlugValidationMessage, normalizeProfileSlug } from "../src/utils/profileSlug.js";

test("normalizes display names into safe ASCII profile slugs", () => {
  assert.equal(normalizeProfileSlug("  Éléonore O'Connor / Pro! "), "eleonore-o-connor-pro");
  assert.equal(normalizeProfileSlug("A---B"), "a-b");
});

test("fixed top-level routes are reserved from public profile URLs", () => {
  for (const route of ["login", "professionals", "community", "api", "admin", "verification"]) {
    assert.equal(RESERVED_PROFILE_SLUGS.has(route), true);
    assert.match(getSlugValidationMessage(route), /reserved/i);
  }
});

test("short slugs receive a clear validation message", () => {
  assert.match(getSlugValidationMessage("ab"), /at least 3/i);
});
