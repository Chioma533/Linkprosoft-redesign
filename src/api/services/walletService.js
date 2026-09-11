import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const unwrapList = (response) => {
  if (!response) return [];

  const payload = response.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.payments)) return payload.payments;
  if (Array.isArray(payload?.data?.payments)) return payload.data.payments;

  return [];
};

export const walletService = {
  getWallet: async () => {
    const response = await axiosInstance.get(API_PATHS.WALLET.GET_WALLET);
    return response.data?.data || response.data;
  },

  getPaymentHistory: async (userId, page = 1, limit = 20) => {
    const response = await axiosInstance.get(
      API_PATHS.PAYMENTS.GET_PAYMENT_HISTORY(userId),
      { params: { page, limit } },
    );

    return unwrapList(response);
  },

  increaseBalance: async (amount) => {
    const response = await axiosInstance.post(
      API_PATHS.WALLET.INCREASE_BALANCE,
      { amount },
    );
    return response.data?.data || response.data;
  },

  updateBalance: async (balance) => {
    const response = await axiosInstance.put(API_PATHS.WALLET.UPDATE_BALANCE, {
      balance,
    });
    return response.data?.data || response.data;
  },
};
