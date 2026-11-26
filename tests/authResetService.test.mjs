import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";

test("auth reset service uses backend payloads and propagates a missing route", async () => {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  try {
    const [{ authService }, { default: axiosInstance }] = await Promise.all([
      vite.ssrLoadModule("/src/api/services/authService.js"),
      vite.ssrLoadModule("/src/utils/axiosInstance.js"),
    ]);
    const originalPost = axiosInstance.post;
    const calls = [];

    axiosInstance.post = async (...args) => {
      calls.push(args);
      return { data: { success: true, data: { resetToken: "reset-token" } } };
    };

    try {
      await authService.resendOtp("user@example.com");
      await authService.resendOtp("user@example.com", "password_reset");
      const verified = await authService.verifyResetCode("user@example.com", "123456");
      await authService.resetPassword(verified.data.resetToken, "Password1!");

      assert.deepEqual(calls, [
        ["/api/auth/resend-otp", { email: "user@example.com", purpose: "email_verification" }],
        ["/api/auth/resend-otp", { email: "user@example.com", purpose: "password_reset" }],
        ["/api/auth/verify-reset-code", { email: "user@example.com", otp_code: "123456" }],
        ["/api/auth/reset-password", { reset_token: "reset-token", new_password: "Password1!" }],
      ]);

      const notFound = new Error("not found");
      notFound.response = { status: 404 };
      axiosInstance.post = async () => {
        throw notFound;
      };

      await assert.rejects(
        authService.verifyResetCode("user@example.com", "123456"),
        (error) => error === notFound,
      );
    } finally {
      axiosInstance.post = originalPost;
    }
  } finally {
    await vite.close();
  }
});
