import test from "node:test";
import assert from "node:assert/strict";
import {
  extractPaymentInitiation,
  extractVerifiedPayment,
} from "../src/utils/paymentFlow.js";

test("payment initiation accepts the backend response envelope", () => {
  const initiation = extractPaymentInitiation({
    data: {
      data: {
        authorization_url: "https://checkout.paystack.com/example",
        reference: "payref_example",
      },
    },
  });

  assert.equal(initiation.reference, "payref_example");
  assert.equal(initiation.authorization_url, "https://checkout.paystack.com/example");
});

test("payment initiation rejects missing checkout information", () => {
  assert.throws(
    () => extractPaymentInitiation({ data: { data: { reference: "payref_example" } } }),
    /checkout URL and reference/,
  );
});

test("payment initiation rejects non-Paystack checkout URLs", () => {
  assert.throws(
    () => extractPaymentInitiation({
      data: {
        authorization_url: "https://example.test/checkout",
        reference: "payref_example",
      },
    }),
    /untrusted checkout URL/,
  );
});

test("payment verification extracts the persisted payment status", () => {
  const payment = extractVerifiedPayment({
    data: {
      data: {
        payment: { status: "pending_admin_approval", provider_status: "success" },
      },
    },
  });
  assert.equal(payment.status, "pending_admin_approval");
});

test("payment verification rejects an unusable response", () => {
  assert.throws(
    () => extractVerifiedPayment({ data: { data: { payment: {} } } }),
    /status could not be verified/,
  );
});
