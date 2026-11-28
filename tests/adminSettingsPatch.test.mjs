import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const settingsUrl = new URL("../src/pages/admin/AdminSettingsSubpage.jsx", import.meta.url);
const adminServiceUrl = new URL("../src/api/services/adminService.js", import.meta.url);
const apiUrl = new URL("../src/utils/apiPaths.js", import.meta.url);

test("admin settings load and save persisted configuration", async () => {
  const settings = await readFile(settingsUrl, "utf8");
  assert.match(settings, /adminService\.getCommissionSettings/);
  assert.match(settings, /adminService\.updateCommissionSettings/);
  assert.match(settings, /minimumWalletPayout/);
  assert.match(settings, /adminSessionExpiryHours/);
  assert.doesNotMatch(settings, /ADM-001|ADM-002|ADM-003/);
});

test("admin settings use backend administrator lifecycle endpoints", async () => {
  const settings = await readFile(settingsUrl, "utf8");
  const service = await readFile(adminServiceUrl, "utf8");
  const apiPaths = await readFile(apiUrl, "utf8");

  assert.match(settings, /adminService\.getAdmins/);
  assert.match(settings, /adminService\.createAdmin/);
  assert.match(settings, /adminService\.revokeAdmin/);
  assert.match(service, /getAdmins:/);
  assert.match(service, /createAdmin:/);
  assert.match(service, /revokeAdmin:/);
  assert.match(apiPaths, /ADMINS_LIST:\s*["']\/api\/admin\/users\/admins["']/);
});
