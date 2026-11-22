import test from "node:test";
import assert from "node:assert/strict";
import {
  JOB_CATEGORIES,
  BUDGET_TYPES,
  getSkillsForCategory,
} from "../src/constants/jobTaxonomy.js";

test("includes 'Other' and standard categories in JOB_CATEGORIES", () => {
  assert.equal(JOB_CATEGORIES.includes("Other"), true);
  assert.equal(JOB_CATEGORIES.includes("Home Services"), true);
  assert.equal(JOB_CATEGORIES.includes("Tech"), true);
});

test("returns category-specific skills for standard categories", () => {
  const homeSkills = getSkillsForCategory("Home Services");
  assert.equal(homeSkills.length > 0, true);
  const skillNames = homeSkills.map((s) => s.name);
  assert.equal(skillNames.includes("Plumbing"), true);
  assert.equal(skillNames.includes("Carpentry & Furniture"), true);
  assert.equal(skillNames.includes("Web Development"), false);

  const techSkills = getSkillsForCategory("Tech");
  const techNames = techSkills.map((s) => s.name);
  assert.equal(techNames.includes("Web Development"), true);
  assert.equal(techNames.includes("Plumbing"), false);
});

test("returns fallback options for 'Other' category", () => {
  const otherSkills = getSkillsForCategory("Other");
  assert.equal(otherSkills.length > 0, true);
  assert.equal(otherSkills[0].id, "other-skill-general");
});

test("includes workmanship as a supported budget type with descriptive explanation", () => {
  const workmanship = BUDGET_TYPES.find((b) => b.id === "workmanship");
  assert.notEqual(workmanship, undefined);
  assert.equal(workmanship.badge, "Workmanship");
  assert.match(workmanship.description, /skilled labor/i);

  const materials = BUDGET_TYPES.find((b) => b.id === "materials_and_labor");
  assert.notEqual(materials, undefined);
});
