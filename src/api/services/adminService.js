import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

export const adminService = {
  // ==========================================
  // SCREEN 1: DASHBOARD OVERVIEW & GLOBAL
  // ==========================================

  /**
   * Fetch high-level overview KPI metrics
   * GET /api/admin/dashboard/overview-metrics
   */
  getOverviewMetrics: async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.OVERVIEW_METRICS);
      return response.data;
    } catch (error) {
      console.warn("[adminService] getOverviewMetrics error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Fetch revenue and escrow activity time-series dataset
   * GET /api/admin/dashboard/revenue-escrow-chart?period=30d
   * @param {string} [period="30d"] - "7d" | "30d" | "90d" | "1y"
   */
  getRevenueEscrowChart: async (period = "30d") => {
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.REVENUE_ESCROW_CHART, {
        params: { period },
      });
      return response.data;
    } catch (error) {
      console.warn("[adminService] getRevenueEscrowChart error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Fetch urgent critical alert counts for Needs Attention widget
   * GET /api/admin/dashboard/critical-alerts
   */
  getCriticalAlerts: async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.CRITICAL_ALERTS);
      return response.data;
    } catch (error) {
      console.warn("[adminService] getCriticalAlerts error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Fetch paginated recent platform activity audit log
   * GET /api/admin/dashboard/recent-activity?page=1&limit=10
   * @param {Object} [params]
   */
  getRecentActivity: async (params = { page: 1, limit: 10 }) => {
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.RECENT_ACTIVITY, {
        params,
      });
      return response.data;
    } catch (error) {
      console.warn("[adminService] getRecentActivity error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Broadcast platform announcement
   * POST /api/admin/announcements
   * @param {Object} payload - { title, message, targetAudience, channel, priority }
   */
  sendAnnouncement: async (payload) => {
    try {
      const response = await axiosInstance.post(API_PATHS.ADMIN.ANNOUNCEMENTS, payload);
      return response.data;
    } catch (error) {
      console.warn("[adminService] sendAnnouncement error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Global universal admin search
   * GET /api/admin/search?q=query&type=ALL
   * @param {Object} params - { q, type, limit }
   */
  universalSearch: async (params) => {
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.SEARCH, {
        params,
      });
      return response.data;
    } catch (error) {
      console.warn("[adminService] universalSearch error:", error.response?.data || error.message);
      throw error;
    }
  },

  // ==========================================
  // SCREEN 2: USER MANAGEMENT & KYC
  // ==========================================

  /**
   * Fetch user statistics (Total, Clients, Professionals, Suspended)
   * GET /api/admin/users/metrics
   */
  getUserMetrics: async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.USERS_METRICS);
      return response.data;
    } catch (error) {
      console.warn("[adminService] getUserMetrics error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Fetch paginated users with multi-filter parameters
   * GET /api/admin/users
   * @param {Object} [params] - { page, limit, search, role, category, verificationStatus, accountStatus, startDate, endDate, sortBy, sortOrder }
   */
  getUsers: async (params = {}) => {
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.USERS_LIST, {
        params,
      });
      return response.data;
    } catch (error) {
      console.warn("[adminService] getUsers error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Fetch complete user dossier by user ID
   * GET /api/admin/users/:id
   * @param {string} id
   */
  getUserById: async (id) => {
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.USER_BY_ID(id));
      return response.data;
    } catch (error) {
      console.warn("[adminService] getUserById error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Update account status (active, suspended, banned)
   * PATCH /api/admin/users/:id/status
   * @param {string} id
   * @param {string} status - "ACTIVE" | "SUSPENDED" | "BANNED" | "active" | "suspended"
   * @param {string} [reason]
   */
  updateUserStatus: async (id, status, reason = "") => {
    try {
      const response = await axiosInstance.patch(API_PATHS.ADMIN.UPDATE_USER_STATUS(id), {
        status,
        reason,
      });
      return response.data;
    } catch (error) {
      console.warn("[adminService] updateUserStatus error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Fetch verification queue of professionals awaiting KYC approval
   * GET /api/admin/users/verification-queue
   * @param {Object} [params] - { page, limit, status }
   */
  getVerificationQueue: async (params = { page: 1, limit: 10, status: "pending" }) => {
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.VERIFICATION_QUEUE, {
        params,
      });
      return response.data;
    } catch (error) {
      console.warn("[adminService] getVerificationQueue error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Approve or reject professional KYC verification
   * PATCH /api/admin/users/:id/verification
   * @param {string} id
   * @param {string} status - "VERIFIED" | "REJECTED"
   * @param {string} [reason]
   */
  updateUserVerification: async (id, status, reason = "") => {
    try {
      const response = await axiosInstance.patch(API_PATHS.ADMIN.UPDATE_USER_VERIFICATION(id), {
        status,
        reason,
      });
      return response.data;
    } catch (error) {
      console.warn("[adminService] updateUserVerification error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Impersonate user session
   * POST /api/admin/users/:id/impersonate
   * @param {string} id
   */
  impersonateUser: async (id) => {
    try {
      const response = await axiosInstance.post(API_PATHS.ADMIN.IMPERSONATE_USER(id));
      return response.data;
    } catch (error) {
      console.warn("[adminService] impersonateUser error:", error.response?.data || error.message);
      throw error;
    }
  },

  // ==========================================
  // SCREEN 3: JOBS MANAGEMENT
  // ==========================================

  /**
   * Fetch jobs KPI metrics
   * GET /api/admin/jobs/metrics
   */
  getJobsMetrics: async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.JOBS_METRICS);
      return response.data;
    } catch (error) {
      console.warn("[adminService] getJobsMetrics error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Fetch paginated jobs list
   * GET /api/admin/jobs
   * @param {Object} [params] - { page, limit, search, status, category }
   */
  getJobs: async (params = {}) => {
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.JOBS_LIST, { params });
      return response.data;
    } catch (error) {
      console.warn("[adminService] getJobs error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Fetch single job details
   * GET /api/admin/jobs/:id
   * @param {string} id
   */
  getJobById: async (id) => {
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.JOB_BY_ID(id));
      return response.data;
    } catch (error) {
      console.warn("[adminService] getJobById error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Update job status
   * PATCH /api/admin/jobs/:id/status
   * @param {string} id
   * @param {string} status
   */
  updateJobStatus: async (id, status) => {
    try {
      const response = await axiosInstance.patch(API_PATHS.ADMIN.UPDATE_JOB_STATUS(id), { status });
      return response.data;
    } catch (error) {
      console.warn("[adminService] updateJobStatus error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Force cancel job
   * POST /api/admin/jobs/:id/force-cancel
   * @param {string} id
   * @param {string} reason
   */
  forceCancelJob: async (id, reason = "") => {
    try {
      const response = await axiosInstance.post(API_PATHS.ADMIN.FORCE_CANCEL_JOB(id), { reason });
      return response.data;
    } catch (error) {
      console.warn("[adminService] forceCancelJob error:", error.response?.data || error.message);
      throw error;
    }
  },

  // ==========================================
  // SCREEN 4: DISPUTES & ARBITRATION
  // ==========================================

  /**
   * Fetch disputes KPI metrics
   * GET /api/admin/disputes/metrics
   */
  getDisputesMetrics: async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.DISPUTES_METRICS);
      return response.data;
    } catch (error) {
      console.warn("[adminService] getDisputesMetrics error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Fetch paginated disputes list
   * GET /api/admin/disputes
   * @param {Object} [params] - { page, limit, search, status, raisedBy }
   */
  getDisputes: async (params = {}) => {
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.DISPUTES_LIST, { params });
      return response.data;
    } catch (error) {
      console.warn("[adminService] getDisputes error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Fetch single dispute details
   * GET /api/admin/disputes/:id
   * @param {string} id
   */
  getDisputeById: async (id) => {
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.DISPUTE_BY_ID(id));
      return response.data;
    } catch (error) {
      console.warn("[adminService] getDisputeById error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Assign dispute to an admin
   * PATCH /api/admin/disputes/:id/assign
   * @param {string} id
   * @param {string} adminId
   */
  assignDispute: async (id, adminId) => {
    try {
      const response = await axiosInstance.patch(API_PATHS.ADMIN.ASSIGN_DISPUTE(id), { adminId });
      return response.data;
    } catch (error) {
      console.warn("[adminService] assignDispute error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Arbitrate and resolve dispute
   * PATCH /api/admin/disputes/:id/arbitrate
   * @param {string} id
   * @param {Object} payload - { resolution, clientPercentage, proPercentage, notes }
   */
  arbitrateDispute: async (id, payload) => {
    try {
      const response = await axiosInstance.patch(API_PATHS.ADMIN.ARBITRATE_DISPUTE(id), payload);
      return response.data;
    } catch (error) {
      console.warn("[adminService] arbitrateDispute error:", error.response?.data || error.message);
      throw error;
    }
  },

  // ==========================================
  // SCREEN 5: FINANCE & PAYMENTS
  // ==========================================

  /**
   * Fetch finance overview metrics
   * GET /api/admin/finance/overview-metrics
   */
  getFinanceOverviewMetrics: async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.FINANCE_OVERVIEW_METRICS);
      return response.data;
    } catch (error) {
      console.warn("[adminService] getFinanceOverviewMetrics error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Fetch finance transactions list
   * GET /api/admin/finance/transactions
   * @param {Object} [params] - { page, limit, search, status, type }
   */
  getFinanceTransactions: async (params = {}) => {
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.FINANCE_TRANSACTIONS, { params });
      return response.data;
    } catch (error) {
      console.warn("[adminService] getFinanceTransactions error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Fetch escrow metrics
   * GET /api/admin/finance/escrow/metrics
   */
  getEscrowMetrics: async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.FINANCE_ESCROW_METRICS);
      return response.data;
    } catch (error) {
      console.warn("[adminService] getEscrowMetrics error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Fetch escrow accounts list
   * GET /api/admin/finance/escrow
   * @param {Object} [params]
   */
  getEscrowList: async (params = {}) => {
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.FINANCE_ESCROW_LIST, { params });
      return response.data;
    } catch (error) {
      console.warn("[adminService] getEscrowList error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Manually release escrow funds to professional
   * POST /api/admin/finance/escrow/:id/manual-release
   * @param {string} id
   */
  manualReleaseEscrow: async (id) => {
    try {
      const response = await axiosInstance.post(API_PATHS.ADMIN.MANUAL_RELEASE_ESCROW(id));
      return response.data;
    } catch (error) {
      console.warn("[adminService] manualReleaseEscrow error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Freeze escrow funds
   * POST /api/admin/finance/escrow/:id/freeze
   * @param {string} id
   */
  freezeEscrow: async (id) => {
    try {
      const response = await axiosInstance.post(API_PATHS.ADMIN.FREEZE_ESCROW(id));
      return response.data;
    } catch (error) {
      console.warn("[adminService] freezeEscrow error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Fetch payouts metrics
   * GET /api/admin/finance/payouts/metrics
   */
  getPayoutsMetrics: async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.FINANCE_PAYOUTS_METRICS);
      return response.data;
    } catch (error) {
      console.warn("[adminService] getPayoutsMetrics error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Fetch payouts requests list
   * GET /api/admin/finance/payouts
   * @param {Object} [params]
   */
  getPayoutsList: async (params = {}) => {
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.FINANCE_PAYOUTS_LIST, { params });
      return response.data;
    } catch (error) {
      console.warn("[adminService] getPayoutsList error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Approve a payout request
   * POST /api/admin/finance/payouts/:id/approve
   * @param {string} id
   */
  approvePayout: async (id) => {
    try {
      const response = await axiosInstance.post(API_PATHS.ADMIN.APPROVE_PAYOUT(id));
      return response.data;
    } catch (error) {
      console.warn("[adminService] approvePayout error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Reject a payout request
   * POST /api/admin/finance/payouts/:id/reject
   * @param {string} id
   * @param {string} reason
   */
  rejectPayout: async (id, reason = "") => {
    try {
      const response = await axiosInstance.post(API_PATHS.ADMIN.REJECT_PAYOUT(id), { reason });
      return response.data;
    } catch (error) {
      console.warn("[adminService] rejectPayout error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Fetch refunds metrics
   * GET /api/admin/finance/refunds/metrics
   */
  getRefundsMetrics: async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.FINANCE_REFUNDS_METRICS);
      return response.data;
    } catch (error) {
      console.warn("[adminService] getRefundsMetrics error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Fetch refunds list
   * GET /api/admin/finance/refunds
   * @param {Object} [params]
   */
  getRefundsList: async (params = {}) => {
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.FINANCE_REFUNDS_LIST, { params });
      return response.data;
    } catch (error) {
      console.warn("[adminService] getRefundsList error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Process / Approve a refund
   * POST /api/admin/finance/refunds/:id/process
   * @param {string} id
   */
  processRefund: async (id) => {
    try {
      const response = await axiosInstance.post(API_PATHS.ADMIN.PROCESS_REFUND(id));
      return response.data;
    } catch (error) {
      console.warn("[adminService] processRefund error:", error.response?.data || error.message);
      throw error;
    }
  },
};
