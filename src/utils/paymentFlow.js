const unwrapData = (response) => response?.data?.data ?? response?.data ?? null;

export const extractPaymentInitiation = (response) => {
  const data = unwrapData(response);
  if (!data?.authorization_url || !data?.reference) {
    throw new Error("The payment provider did not return a checkout URL and reference.");
  }
  let checkoutUrl;
  try {
    checkoutUrl = new URL(data.authorization_url);
  } catch {
    throw new Error("The payment provider returned an invalid checkout URL.");
  }
  if (checkoutUrl.protocol !== "https:" || checkoutUrl.hostname !== "checkout.paystack.com") {
    throw new Error("The payment provider returned an untrusted checkout URL.");
  }
  return data;
};

export const extractVerifiedPayment = (response) => {
  const data = unwrapData(response);
  const payment = data?.payment ?? data;
  if (!payment || typeof payment.status !== "string") {
    throw new Error("The payment status could not be verified.");
  }
  return payment;
};
