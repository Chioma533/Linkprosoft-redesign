import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

export const walletService = {
  getWallet: async () => {
    const response = await axiosInstance.get(API_PATHS.WALLET.GET_WALLET);
    return response.data?.data || response.data;
  },

  increaseBalance: async (amount) => {
    const response = await axiosInstance.post(API_PATHS.WALLET.INCREASE_BALANCE, { amount });
    return response.data?.data || response.data;
  },

  updateBalance: async (balance) => {
    const response = await axiosInstance.put(API_PATHS.WALLET.UPDATE_BALANCE, { balance });
    return response.data?.data || response.data;
  },
};
