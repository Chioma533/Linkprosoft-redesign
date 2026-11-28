import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const settingsUrl = new URL("../src/pages/SettingsSubpage.jsx", import.meta.url);
const apiUrl = new URL("../src/utils/apiPaths.js", import.meta.url);
const appUrl = new URL("../src/App.jsx", import.meta.url);

test("settings uses real password, linked-account, and legal destinations", async () => {
  const settings = await readFile(settingsUrl, "utf8");
  assert.doesNotMatch(settings, /not available yet|showUnavailable/);
  assert.match(settings, /setShowChangePassword\(true\)/);
  assert.match(settings, /setShowLinkedAccounts\(true\)/);
  assert.match(settings, /navigate\(["']\/privacy["']\)/);
  assert.match(settings, /navigate\(["']\/terms["']\)/);
});

test("account settings expose backend paths and legal routes", async () => {
  const apiPaths = await readFile(apiUrl, "utf8");
  const app = await readFile(appUrl, "utf8");
  assert.match(apiPaths, /CHANGE_PASSWORD:\s*["']\/api\/auth\/change-password["']/);
  assert.match(apiPaths, /LINKED_ACCOUNTS:\s*["']\/api\/auth\/linked-accounts["']/);
  assert.match(app, /path=["']\/privacy["']/);
  assert.match(app, /path=["']\/terms["']/);
});
