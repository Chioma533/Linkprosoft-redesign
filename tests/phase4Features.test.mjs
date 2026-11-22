import test from "node:test";
import assert from "node:assert/strict";
import { calculateProfileCompletion } from "../src/utils/profileCompletion.js";
import { EMPLOYER_TOUR_STEPS, TOUR_STORAGE_KEY } from "../src/constants/tourSteps.js";

test("calculateProfileCompletion returns 0% when no data is provided", () => {
  const result = calculateProfileCompletion({});
  assert.equal(result.percentage, 0);
  assert.equal(result.isComplete, false);
  assert.equal(result.missingItems.length, 5);
});

test("calculateProfileCompletion accurately calculates percentage across criteria", () => {
  const partial = calculateProfileCompletion({
    user: { avatarUrl: "/avatar.png", bio: "Experienced Carpenter with 10 years experience" },
    skills: [{ id: 1, name: "Carpentry" }],
    portfolio: [],
  });
  // avatar (20) + bio (20) + skills (20) = 60%
  assert.equal(partial.percentage, 60);
  assert.equal(partial.isComplete, false);
  assert.equal(partial.missingItems.length, 2);
  assert.deepEqual(
    partial.missingItems.map((m) => m.id),
    ["location", "portfolio"]
  );
});

test("calculateProfileCompletion returns 100% and isComplete when all criteria are met", () => {
  const complete = calculateProfileCompletion({
    user: {
      avatarUrl: "/avatar.png",
      bio: "Master Electrician specializing in residential wiring.",
      location: "Lagos, Nigeria",
    },
    skills: [{ id: 2, name: "Electrical" }],
    portfolio: [{ id: 1, title: "Duplex Wiring Project" }],
  });
  assert.equal(complete.percentage, 100);
  assert.equal(complete.isComplete, true);
  assert.equal(complete.missingItems.length, 0);
});

test("EMPLOYER_TOUR_STEPS defines 3 required spotlight highlights", () => {
  assert.equal(EMPLOYER_TOUR_STEPS.length, 3);
  assert.equal(EMPLOYER_TOUR_STEPS[0].target, "#tour-search-bar");
  assert.equal(EMPLOYER_TOUR_STEPS[1].target, "[data-tour='professional-card']");
  assert.equal(EMPLOYER_TOUR_STEPS[2].target, "#nav-post-job-btn");
  assert.equal(TOUR_STORAGE_KEY, "lps_tour_employer_v1");
});
