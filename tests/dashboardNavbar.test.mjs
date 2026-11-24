import test from "node:test";
import assert from "node:assert/strict";
import {
  getUnreadMessagesCount,
  getUnreadNotificationsCount,
  getUserDisplayName,
  getUserRole,
  isUserVerified,
} from "../src/utils/dashboardNavbar.js";
import { getDashboardNavigationItems } from "../src/constants/dashboardNavigation.js";
import { searchDashboard } from "../src/utils/dashboardNavbarSearch.js";

test("user utilities preserve role, verification, and display-name fallbacks", () => {
  assert.equal(getUserRole(null), "professional");
  assert.equal(getUserRole({ role: "employer" }), "employer");
  assert.equal(isUserVerified({ isVerified: true }), true);
  assert.equal(isUserVerified({ is_verified: true }), true);
  assert.equal(isUserVerified({ verificationStatus: "verified" }), true);
  assert.equal(isUserVerified({ verification_status: "verified" }), true);
  assert.equal(isUserVerified({ verificationStatus: "pending" }), false);
  assert.equal(getUserDisplayName({}, "professional"), "Queen Michael");
  assert.equal(getUserDisplayName({}, "professional", "Michael Queen"), "Michael Queen");
  assert.equal(getUserDisplayName({ full_name: "Alex Doe" }, "employer"), "Alex Doe");
  assert.equal(getUserDisplayName({}, "employer"), "Employer User");
});

test("unread count utilities retain the existing unread conditions", () => {
  assert.equal(getUnreadMessagesCount([{ unread: true }, { unread: false }, {}]), 1);
  assert.equal(getUnreadNotificationsCount([{ unread: true }, { is_read: false }, { is_read: true }]), 2);
});

test("role navigation preserves role-specific IDs and labels", () => {
  assert.equal(getDashboardNavigationItems("employer").find((item) => item.id === "manage-jobs").label, "My Jobs");
  assert.equal(getDashboardNavigationItems("professional").find((item) => item.id === "chat").label, "Messages & Chat");
});

test("dashboard search preserves matching, deduplication, and result limits", () => {
  const navigation = [{ id: "browse-jobs", label: "Browse Jobs", keywords: ["market"] }];
  const repeatedJob = { id: "1", title: "Carpentry" };
  const jobs = [
    repeatedJob,
    { ...repeatedJob, title: "Carpentry duplicate" },
    ...Array.from({ length: 4 }, (_, index) => ({ id: String(index + 2), title: "Carpentry" })),
  ];
  const messages = Array.from({ length: 3 }, (_, index) => ({ senderName: `Carpentry ${index}` }));
  const notifications = Array.from({ length: 3 }, (_, index) => ({ title: `Carpentry ${index}` }));

  const result = searchDashboard("  carpentry ", navigation, [], jobs, messages, notifications);

  assert.deepEqual(result.navMatches, []);
  assert.equal(result.jobMatches.length, 4);
  assert.equal(new Set(result.jobMatches.map((job) => job.id)).size, 4);
  assert.equal(result.messageMatches.length, 2);
  assert.equal(result.notifMatches.length, 2);
  assert.deepEqual(searchDashboard("market", navigation, [], [], [], []).navMatches, navigation);
  assert.equal(
    searchDashboard("contract-42", [], [], [{ id: "contract", order_id: "CONTRACT-42" }], [], []).jobMatches.length,
    1
  );
  assert.deepEqual(searchDashboard(" ", navigation, [], jobs, messages, notifications), {
    navMatches: [],
    jobMatches: [],
    messageMatches: [],
    notifMatches: [],
  });
});
