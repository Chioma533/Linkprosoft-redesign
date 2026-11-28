import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createServer } from "vite";

test("admin verification page loads pending review details and uploaded media", async () => {
  const page = await readFile(new URL("../src/pages/admin/AdminVerificationSubpage.jsx", import.meta.url), "utf8");

  assert.match(page, /adminService\.getAdminVerifications/);
  assert.match(page, /status:\s*"pending_review"/);
  assert.match(page, /adminService\.getAdminVerificationById/);
  assert.match(page, /mediaService\.getUrl/);
  assert.match(page, /adminService\.approveAdminVerification/);
  assert.match(page, /adminService\.rejectAdminVerification/);
});

test("admin verification service uses the pending-review endpoints and request IDs", async () => {
  const vite = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });

  try {
    const [{ adminService }, { default: axiosInstance }] = await Promise.all([
      vite.ssrLoadModule("/src/api/services/adminService.js"),
      vite.ssrLoadModule("/src/utils/axiosInstance.js"),
    ]);
    const originalGet = axiosInstance.get;
    const originalPatch = axiosInstance.patch;
    const calls = [];

    axiosInstance.get = async (...args) => {
      calls.push(["GET", ...args]);
      return { data: { data: { items: [], total: 0 } } };
    };
    axiosInstance.patch = async (...args) => {
      calls.push(["PATCH", ...args]);
      return { data: { data: { status: "updated" } } };
    };

    try {
      await adminService.getAdminVerifications({ page: 2, limit: 20, status: "pending_review" });
      await adminService.getAdminVerificationById("verification/123");
      await adminService.approveAdminVerification("verification/123");
      await adminService.rejectAdminVerification("verification/123", {
        rejectionReason: "Blurry document",
        rejectedStep: "identity",
      });

      assert.deepEqual(calls, [
        ["GET", "/api/admin/verifications", { params: { page: 2, limit: 20, status: "pending_review" } }],
        ["GET", "/api/admin/verifications/verification%2F123"],
        ["PATCH", "/api/admin/verifications/verification%2F123/approve"],
        ["PATCH", "/api/admin/verifications/verification%2F123/reject", {
          rejectionReason: "Blurry document",
          rejectedStep: "identity",
        }],
      ]);
    } finally {
      axiosInstance.get = originalGet;
      axiosInstance.patch = originalPatch;
    }
  } finally {
    await vite.close();
  }
});
