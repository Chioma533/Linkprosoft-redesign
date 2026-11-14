import test from "node:test";
import assert from "node:assert/strict";
import { getPublicProfilePath } from "../src/utils/publicProfilePath.js";

test("creates an encoded root route for a public profile slug", () => {
  assert.equal(getPublicProfilePath("gideon-soala"), "/gideon-soala");
  assert.equal(getPublicProfilePath("name with space"), "/name%20with%20space");
});

test("does not create a public route without a slug", () => {
  assert.equal(getPublicProfilePath(null), null);
  assert.equal(getPublicProfilePath("  "), null);
});
