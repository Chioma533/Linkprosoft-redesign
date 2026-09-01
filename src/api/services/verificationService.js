import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

export const verificationService = {
  // Get verification progress & current status
  getVerificationStatus: async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.VERIFICATION.STATUS);
      return response.data?.data || response.data;
    } catch (error) {
      console.warn("Failed to fetch verification status:", error.message);
      throw error;
    }
  },

  // Step 1: Submit Identity Details & ID Upload (Multipart Form-Data)
  submitIdentity: async (formData) => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.VERIFICATION.SUBMIT_IDENTITY,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data?.data || response.data;
    } catch (error) {
      console.warn("Failed to submit identity verification:", error.message);
      throw error;
    }
  },

  // Step 2: Submit Professional Credentials & Categories
  submitProfessional: async (payload) => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.VERIFICATION.SUBMIT_PROFESSIONAL,
        payload
      );
      return response.data?.data || response.data;
    } catch (error) {
      console.warn("Failed to submit professional verification:", error.message);
      throw error;
    }
  },

  // Step 3: Submit Face Selfie & Liveness (Multipart Form-Data or Base64)
  submitFaceVerification: async (formData) => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.VERIFICATION.SUBMIT_FACE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data?.data || response.data;
    } catch (error) {
      console.warn("Failed to submit face verification:", error.message);
      throw error;
    }
  },

  // Step 4 Helper: Get supported banks list
  getBanks: async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.VERIFICATION.BANKS);
      return response.data?.data || response.data || [];
    } catch (error) {
      console.warn("Failed to fetch banks list:", error.message);
      return [];
    }
  },

  // Step 4 Helper: Resolve Bank Account via NUBAN
  resolveAccount: async (bankCode, accountNumber) => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.VERIFICATION.RESOLVE_ACCOUNT,
        { bankCode, accountNumber }
      );
      return response.data?.data || response.data;
    } catch (error) {
      console.warn("Failed to resolve bank account:", error.message);
      throw error;
    }
  },

  // Step 4: Submit Payment & Bank Account Details
  submitPaymentVerification: async (payload) => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.VERIFICATION.SUBMIT_PAYMENT,
        payload
      );
      return response.data?.data || response.data;
    } catch (error) {
      console.warn("Failed to submit payment verification:", error.message);
      throw error;
    }
  },

  // Step 5: Final Submission & Confirmation
  submitVerification: async (payload = { agreeToTerms: true }) => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.VERIFICATION.SUBMIT_ALL,
        payload
      );
      return response.data?.data || response.data;
    } catch (error) {
      console.warn("Failed to submit final verification:", error.message);
      throw error;
    }
  },

  // Get consolidated preview
  getPreview: async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.VERIFICATION.PREVIEW);
      return response.data?.data || response.data;
    } catch (error) {
      console.warn("Failed to fetch verification preview:", error.message);
      return null;
    }
  },
};

export default verificationService;
