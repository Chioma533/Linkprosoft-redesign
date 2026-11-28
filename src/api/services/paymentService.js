import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { extractPaymentInitiation, extractVerifiedPayment } from "../../utils/paymentFlow";

export { extractPaymentInitiation, extractVerifiedPayment };

export const paymentService = {
  initiate: async (assignmentId) => {
    const response = await axiosInstance.post(API_PATHS.PAYMENTS.INITIATE_PAYMENT, {
      assignmentId,
      currency: "NGN",
    });
    return extractPaymentInitiation(response);
  },

  verify: async (reference) => {
    const response = await axiosInstance.get(
      API_PATHS.PAYMENTS.VERIFY_PAYMENT(encodeURIComponent(reference)),
    );
    return extractVerifiedPayment(response);
  },
};
