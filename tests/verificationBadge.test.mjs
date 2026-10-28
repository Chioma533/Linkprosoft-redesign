import test from "node:test";
import assert from "node:assert/strict";
import { getVerificationBadge } from "../src/utils/verificationBadge.js";

test("a verified professional receives the professional badge color", () => {
  assert.deepEqual(getVerificationBadge({ verification_status: "verified", role: "professional" }), {
    category: "professional",
    className: "bg-[#e6f1f6] text-[#016EA6]",
    ariaLabel: "Verified professional account",
  });
});

test("verified roles without a supported category remain neutral", () => {
  for (const role of ["employer", "company", "government_official", undefined]) {
    const badge = getVerificationBadge({ verification_status: "verified", role });
    assert.equal(badge.category, null);
    assert.equal(badge.className, "bg-gray-100 text-gray-700");
    assert.equal(badge.ariaLabel, "Verified account");
  }
});

test("only the verified status displays a badge", () => {
  for (const verification_status of ["unverified", "in_progress", "pending_review", "rejected", undefined, "unknown"]) {
    assert.equal(getVerificationBadge({ verification_status, role: "professional" }), null);
  }
});

test("email verification alone never displays an account verification badge", () => {
  assert.equal(getVerificationBadge({ is_email_verified: true, role: "professional" }), null);
});
