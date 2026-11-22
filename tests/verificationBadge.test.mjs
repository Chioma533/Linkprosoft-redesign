import test from "node:test";
import assert from "node:assert/strict";
import {
  getVerificationBadge,
  resolveVerificationCategory,
  isSubscriptionLapsed,
  isCertificationExpired,
  VERIFICATION_TIERS,
} from "../src/utils/verificationBadge.js";
import { evaluateRatingEligibility, DEFAULT_VERIFICATION_CONFIG } from "../src/utils/verificationConfig.js";

// --- 1. All Three Badge Categories & Correct Colours ---

test("a verified professional receives the blue professional badge (#016EA6)", () => {
  const badge = getVerificationBadge({ verification_status: "verified", role: "professional" });
  assert.notEqual(badge, null);
  assert.equal(badge.category, "professional");
  assert.equal(badge.className, "bg-[#e6f1f6] text-[#016EA6]");
  assert.equal(badge.ariaLabel, "Verified professional account");
  assert.equal(badge.hexColor, "#016EA6");
  assert.equal(badge.code, "PRO");
});

test("a verified company / registered employer receives the gold badge (#D69A16)", () => {
  const badge = getVerificationBadge({
    verification_status: "verified",
    role: "employer",
    is_company_verified: true,
  });
  assert.notEqual(badge, null);
  assert.equal(badge.category, "company");
  assert.equal(badge.className, "bg-[#fdf6e7] text-[#D69A16]");
  assert.equal(badge.ariaLabel, "Verified company account");
  assert.equal(badge.hexColor, "#D69A16");
  assert.equal(badge.code, "CORP");
});

test("a verified corporate account with category 'company' receives the gold badge (#D69A16)", () => {
  const badge = getVerificationBadge({
    verification_status: "verified",
    verification_category: "company",
  });
  assert.notEqual(badge, null);
  assert.equal(badge.category, "company");
  assert.equal(badge.hexColor, "#D69A16");
});

test("a government agency receives the ash/grey badge (#73777D)", () => {
  const badge = getVerificationBadge({
    verification_status: "verified",
    role: "government_agency",
  });
  assert.notEqual(badge, null);
  assert.equal(badge.category, "government");
  assert.equal(badge.className, "bg-[#f1f2f3] text-[#73777D]");
  assert.equal(badge.ariaLabel, "Government verified institution");
  assert.equal(badge.hexColor, "#73777D");
  assert.equal(badge.code, "GOV");
});

// --- 2. Strict Unverified Accounts & Edge Cases ---

test("only verified or approved status displays a badge; all others return null", () => {
  const unverifiedStatuses = [
    "unverified",
    "in_progress",
    "pending",
    "pending_review",
    "rejected",
    "expired",
    undefined,
    null,
    "unknown",
  ];

  for (const verification_status of unverifiedStatuses) {
    assert.equal(getVerificationBadge({ verification_status, role: "professional" }), null);
    assert.equal(getVerificationBadge({ verification_status, role: "company" }), null);
    assert.equal(getVerificationBadge({ verification_status, role: "government_agency" }), null);
  }
});

test("email verification alone never displays an account verification badge", () => {
  assert.equal(getVerificationBadge({ is_email_verified: true, role: "professional" }), null);
  assert.equal(getVerificationBadge({ is_email_verified: true, role: "company" }), null);
});

// --- 3. Employer / Company Verification Restrictions ---

test("an ordinary employer role without business verification evidence is NOT granted a company badge", () => {
  // An employer who hasn't submitted business verification evidence
  const unverifiedEmployer = {
    verification_status: "verified",
    role: "employer",
    // No is_company_verified, no business_registration
  };
  assert.equal(getVerificationBadge(unverifiedEmployer), null);
});

test("an employer with business identity and registration evidence is granted the company badge", () => {
  const verifiedBusinessEmployer = {
    verification_status: "verified",
    role: "employer",
    is_company_verified: true,
    business_registration: "RC-1234567",
  };
  const badge = getVerificationBadge(verifiedBusinessEmployer);
  assert.notEqual(badge, null);
  assert.equal(badge.category, "company");
  assert.equal(badge.hexColor, "#D69A16");
});

// --- 4. Government Agency Restrictions ---

test("government verification cannot be acquired through rating-based pathway", () => {
  const governmentWithRatings = {
    verification_status: "verified",
    role: "government_agency",
    pathway: "rating",
  };
  assert.equal(getVerificationBadge(governmentWithRatings), null);
});

test("government verification is exempt from commercial subscription maintenance", () => {
  // Even if subscription_status is expired, government verification remains institutionally active
  const governmentAgency = {
    verification_status: "verified",
    role: "government_agency",
    subscription_status: "expired",
    badge_maintained: false,
  };
  const badge = getVerificationBadge(governmentAgency);
  assert.notEqual(badge, null);
  assert.equal(badge.category, "government");
  assert.equal(badge.hexColor, "#73777D");
});

// --- 5. Subscription-Based Badge Maintenance ---

test("badge is maintained when professional subscription is active", () => {
  const activeUser = {
    verification_status: "verified",
    role: "professional",
    subscription_status: "active",
    badge_maintained: true,
  };
  const badge = getVerificationBadge(activeUser);
  assert.notEqual(badge, null);
  assert.equal(badge.category, "professional");
});

test("badge is hidden when subscription expires", () => {
  const expiredUser = {
    verification_status: "verified",
    role: "professional",
    subscription_status: "expired",
  };
  assert.equal(getVerificationBadge(expiredUser), null);
});

test("badge is hidden when subscription payment fails", () => {
  const failedPaymentUser = {
    verification_status: "verified",
    role: "professional",
    subscription_status: "failed",
  };
  assert.equal(getVerificationBadge(failedPaymentUser), null);
});

test("badge is restored when user renews subscription and verification remains approved", () => {
  // 1. Initially expired -> no badge
  const user = {
    verification_status: "verified",
    role: "professional",
    subscription_status: "expired",
  };
  assert.equal(getVerificationBadge(user), null);

  // 2. Renew subscription -> badge restored without deleting verification records
  user.subscription_status = "active";
  user.badge_maintained = true;
  const restoredBadge = getVerificationBadge(user);
  assert.notEqual(restoredBadge, null);
  assert.equal(restoredBadge.category, "professional");
  assert.equal(restoredBadge.hexColor, "#016EA6");
});

test("company badge also lapses when company subscription expires", () => {
  const expiredCompany = {
    verification_status: "verified",
    role: "company",
    subscription_status: "expired",
  };
  assert.equal(getVerificationBadge(expiredCompany), null);
});

// --- 6. Certification Expiry ---

test("professional badge is hidden if government-recognised certification has expired", () => {
  const expiredCertUser = {
    verification_status: "verified",
    role: "professional",
    is_certification_expired: true,
  };
  assert.equal(getVerificationBadge(expiredCertUser), null);

  const pastDateUser = {
    verification_status: "verified",
    role: "professional",
    certification_expiry_date: "2020-01-01",
  };
  assert.equal(getVerificationBadge(pastDateUser), null);
});

// --- 7. Rating-Based Eligibility Evaluation ---

test("rating-based verification evaluates eligibility using configurable thresholds", () => {
  const qualifiedPro = {
    averageRating: 4.8,
    completedJobsCount: 15,
    totalReviews: 8,
    hasFraudFlag: false,
  };

  const evalResult = evaluateRatingEligibility(qualifiedPro, DEFAULT_VERIFICATION_CONFIG.ratingPathway);
  assert.equal(evalResult.isEligible, true);
  assert.equal(evalResult.unmetCriteria.length, 0);

  const underqualifiedPro = {
    averageRating: 3.8, // below 4.5
    completedJobsCount: 4, // below 10
    totalReviews: 2, // below 5
    hasFraudFlag: false,
  };

  const failResult = evaluateRatingEligibility(underqualifiedPro, DEFAULT_VERIFICATION_CONFIG.ratingPathway);
  assert.equal(failResult.isEligible, false);
  assert.equal(failResult.unmetCriteria.length, 3);
});

test("rating-based verification blocks accounts with fraud or tampering flags", () => {
  const suspiciousPro = {
    averageRating: 5.0,
    completedJobsCount: 20,
    totalReviews: 12,
    hasFraudFlag: true,
  };

  const result = evaluateRatingEligibility(suspiciousPro, DEFAULT_VERIFICATION_CONFIG.ratingPathway);
  assert.equal(result.isEligible, false);
  assert.match(result.unmetCriteria[0], /fraud/i);
});

// --- 8. Future Valid Certification & Document Privacy ---

test("professional with valid future certification expiry date displays the blue badge", () => {
  const validFutureCertUser = {
    verification_status: "verified",
    role: "professional",
    certification_expiry_date: "2035-12-31",
  };
  const badge = getVerificationBadge(validFutureCertUser);
  assert.notEqual(badge, null);
  assert.equal(badge.category, "professional");
  assert.equal(badge.hexColor, "#016EA6");
});

test("badge object strictly never exposes private certification or identity documents", () => {
  const sensitiveUser = {
    verification_status: "verified",
    role: "professional",
    bvn: "22233344455",
    idDocumentUrl: "https://storage.linkprosoft.com/ids/private-id.pdf",
    cacDocumentUrl: "https://storage.linkprosoft.com/certs/cac.pdf",
    bankAccountNumber: "0123456789",
  };

  const badge = getVerificationBadge(sensitiveUser);
  assert.notEqual(badge, null);
  assert.equal(badge.bvn, undefined);
  assert.equal(badge.idDocumentUrl, undefined);
  assert.equal(badge.cacDocumentUrl, undefined);
  assert.equal(badge.bankAccountNumber, undefined);
});

test("evaluates rating eligibility with custom administrative threshold overrides", () => {
  const customConfig = {
    minAverageRating: 4.8,
    minCompletedJobs: 25,
    minGenuineReviews: 15,
    fraudProtectionEnabled: true,
  };

  const candidate = {
    averageRating: 4.6, // passes default 4.5, but fails custom 4.8
    completedJobsCount: 30,
    totalReviews: 20,
    hasFraudFlag: false,
  };

  const evalResult = evaluateRatingEligibility(candidate, customConfig);
  assert.equal(evalResult.isEligible, false);
  assert.equal(evalResult.unmetCriteria.length, 1);
});
