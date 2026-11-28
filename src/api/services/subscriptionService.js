import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const dataOf = (response) => response.data?.data ?? response.data;

export const subscriptionService = {
  async getMySubscription() {
    const response = await axiosInstance.get(API_PATHS.SUBSCRIPTIONS.ME);
    return dataOf(response);
  },

  async initiateSubscription({ plan = "pro", callbackUrl } = {}) {
    const response = await axiosInstance.post(API_PATHS.SUBSCRIPTIONS.INITIATE, {
      plan,
      ...(callbackUrl ? { callbackUrl } : {}),
    });
    return dataOf(response);
  },

  async verifySubscription(reference) {
    const response = await axiosInstance.post(API_PATHS.SUBSCRIPTIONS.VERIFY, {
      reference,
    });
    return dataOf(response);
  },

  async cancelSubscription() {
    const response = await axiosInstance.post(API_PATHS.SUBSCRIPTIONS.CANCEL);
    return dataOf(response);
  },
};

export default subscriptionService;
