import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const dashboardPath = new URL("../src/pages/employer/EmployerDashboardPage.jsx", import.meta.url);
const disputePath = new URL("../src/pages/employer/EmployerOpenDisputeSubpage.jsx", import.meta.url);
const detailsPath = new URL("../src/pages/employer/EmployerJobDetailsSubpage.jsx", import.meta.url);

test("employer dashboard never initializes a fallback job ID", async () => {
  const source = await readFile(dashboardPath, "utf8");
  assert.match(source, /useState\(null\)/);
  assert.doesNotMatch(source, /ORD657783/);
  assert.match(source, /No project selected/);
});

test("disputes and completion use the live assignment ID instead of the job ID", async () => {
  const disputeSource = await readFile(disputePath, "utf8");
  const detailsSource = await readFile(detailsPath, "utf8");

  assert.match(disputeSource, /const assignmentId\s*=/);
  assert.match(disputeSource, /DISPUTE_SATISFACTION\(assignmentId\)/);
  assert.doesNotMatch(disputeSource, /ORD657783|Wardrobe Installation|Johnathan David/);

  assert.match(detailsSource, /const assignmentId\s*=/);
  assert.match(detailsSource, /APPROVE_SATISFACTION\(assignmentId\)/);
});
