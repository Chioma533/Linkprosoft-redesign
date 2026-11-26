import test from "node:test";
import assert from "node:assert/strict";
import {
  buildPublicJobsParams,
  normalizePublicJobsResponse,
} from "../src/utils/professional/publicJobs.js";

test("builds public job search, location, budget, date, and pagination parameters", () => {
  assert.deepEqual(
    buildPublicJobsParams(
      {
        searchQuery: "  carpenter  ",
        location: "Lagos",
        datePosted: "This week",
        budget: "₦5,000 – ₦20,000",
      },
      2,
      9,
    ),
    {
      page: 2,
      limit: 9,
      sortBy: "newest",
      search: "carpenter",
      location: "Lagos",
      minBudget: 5000,
      maxBudget: 20000,
      postedWithinDays: 7,
    },
  );
});

test("omits unselected public job filters", () => {
  assert.deepEqual(buildPublicJobsParams({}, 1, 9), {
    page: 1,
    limit: 9,
    sortBy: "newest",
  });
});

test("normalizes the backend paginated job response for the public job cards", () => {
  const result = normalizePublicJobsResponse(
    {
      success: true,
      data: {
        items: [
          {
            id: "job-1",
            title: "Carpenter",
            description: "Build a wardrobe",
            budget: "12000",
            createdAt: "2026-11-25T10:00:00.000Z",
            employer: { fullName: "Ada Employer", avatarUrl: "/ada.png" },
          },
        ],
        pagination: { page: 2, limit: 9, total: 15, pages: 2 },
      },
    },
    1,
    9,
  );

  assert.equal(result.total, 15);
  assert.equal(result.page, 2);
  assert.equal(result.pages, 2);
  assert.deepEqual(result.jobs[0], {
    id: "job-1",
    title: "Carpenter",
    description: "Build a wardrobe",
    budget: 12000,
    createdAt: "2026-11-25T10:00:00.000Z",
    employer: { fullName: "Ada Employer", avatarUrl: "/ada.png" },
    employerName: "Ada Employer",
    employerAvatarUrl: "/ada.png",
    location: "Remote",
    category: "General",
  });
});

test("rejects malformed jobs responses instead of treating them as empty results", () => {
  assert.throws(
    () => normalizePublicJobsResponse({ success: true, data: {} }, 1, 9),
    /unexpected response/i,
  );
});
