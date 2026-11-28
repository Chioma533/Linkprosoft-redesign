import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const hookUrl = new URL("../src/hooks/verification/useVerification.js", import.meta.url);
const serviceUrl = new URL("../src/api/services/verificationService.js", import.meta.url);
const certUrl = new URL("../src/components/verification/CertificationPathwayModal.jsx", import.meta.url);
const ratingUrl = new URL("../src/components/verification/RatingPathwayModal.jsx", import.meta.url);
const companyUrl = new URL("../src/components/verification/CompanyVerificationModal.jsx", import.meta.url);
const governmentUrl = new URL("../src/components/verification/GovernmentVerificationModal.jsx", import.meta.url);

test("verification hook restores persisted steps and submits canonical payloads", async () => {
  const hook = await readFile(hookUrl, "utf8");
  assert.match(hook, /statusRes\.steps\?\.professional/);
  assert.match(hook, /statusRes\.steps\?\.face/);
  assert.match(hook, /statusRes\.steps\?\.payment/);
  assert.match(hook, /skills: profile\.skills/);
  assert.doesNotMatch(hook, /FALLBACK_BANKS/);
  assert.match(hook, /bankError/);
});

test("badge pathways submit real verification or media-backed applications", async () => {
  const service = await readFile(serviceUrl, "utf8");
  const [cert, rating, company, government] = await Promise.all([
    readFile(certUrl, "utf8"),
    readFile(ratingUrl, "utf8"),
    readFile(companyUrl, "utf8"),
    readFile(governmentUrl, "utf8"),
  ]);

  assert.match(service, /SUBMIT_BADGE_APPLICATION/);
  assert.match(cert, /submitBadgeApplication/);
  assert.match(rating, /submitBadgeApplication/);
  assert.match(company, /submitBadgeApplication/);
  assert.match(government, /submitBadgeApplication/);
  assert.doesNotMatch(`${cert}\n${rating}\n${company}\n${government}`, /setTimeout/);
});
