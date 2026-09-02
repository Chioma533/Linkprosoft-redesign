//export const API_BASE_URL = "https://linkprosoft-backend-hxmc.onrender.com";
export const API_BASE_URL = "http://localhost:5020";


export const API_PATHS = {
  AUTH: {
    SIGNUP: "/api/auth/signup",
    LOGIN: "/api/auth/login",
    VERIFY: "/api/auth/verify-email",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    VERIFY_RESET_CODE: "/api/auth/verify-reset-code",
    RESET_PASSWORD: "/api/auth/reset-password",
    RESEND_OTP: "/api/auth/resend-otp",
    REFRESH_TOKEN: "/api/auth/refresh-token",
    LOGOUT: "/api/auth/logout",
    VERIFY_SESSION: "/api/auth/verify",
    ME: "/api/auth/me",
    UPDATE_ME: "/api/auth/me",
  },

  GOOGLE_AUTH: {
    GOOGLE_SIGNIN: "/api/auth/google",
    GOOGLE_CALLBACK: "/api/auth/google/callback",
  },

  PROFILE: {
    CREATE_PROFILE: "/api/profiles",
    GET_PROFILE: "/api/profiles/me",
    GET_MY_PROFILE: "/api/profiles/me",
    UPDATE_PROFILE: "/api/profiles/me",
    UPDATE_MY_PROFILE: "/api/profiles/me",
    DELETE_MY_PROFILE: "/api/profiles/me",
    GET_PROFILE_BY_USER_ID: (userId) => `/api/profiles/${userId}`,
    GET_DETAILED_PROFILE: (userId) => `/api/profiles/${userId}/detailed`,
  },

  CERTIFICATIONS: {
    GET_USER_CERTIFICATIONS: (userId) => `/api/profiles/${userId}/certifications`,
    ADD_CERTIFICATION: "/api/profiles/me/certifications",
    UPDATE_CERTIFICATION: (certificationId) => `/api/profiles/me/certifications/${certificationId}`,
    DELETE_CERTIFICATION: (certificationId) => `/api/profiles/me/certifications/${certificationId}`,
  },

  PORTFOLIO: {
    GET_USER_PORTFOLIO: (userId) => `/api/profiles/${userId}/portfolio`,
    ADD_PORTFOLIO_ITEM: "/api/profiles/me/portfolio",
    UPDATE_PORTFOLIO_ITEM: (portfolioItemId) => `/api/profiles/me/portfolio/${portfolioItemId}`,
    DELETE_PORTFOLIO_ITEM: (portfolioItemId) => `/api/profiles/me/portfolio/${portfolioItemId}`,
  },

  SKILLS: {
    GET_SKILLS: "/api/skills",
    GET_USER_SKILLS: (userId) => `/api/skills/${userId}/skills`,
    ADD_SKILLS: "/api/skills/me/skills",
    ADD_MY_SKILL: "/api/skills/me/skills",
    UPDATE_SKILLS: (skillId) => `/api/skills/me/skills/${skillId}`,
    UPDATE_MY_SKILL: (skillId) => `/api/skills/me/skills/${skillId}`,
    DELETE_SKILLS: (skillId) => `/api/skills/me/skills/${skillId}`,
    DELETE_MY_SKILL: (skillId) => `/api/skills/me/skills/${skillId}`,
  },

  REVIEWS: {
    CREATE_REVIEW: "/api/reviews",
    GET_PROFESSIONAL_REVIEWS: (professionalId) => `/api/reviews/${professionalId}`,
  },

  JOBS: {
    GET_JOBS: "/api/jobs",
    GET_MY_JOBS: "/api/jobs/my-jobs",
    GET_CONTRACTED_JOBS: "/api/jobs/my-jobs",
    GET_POSTED_JOBS: "/api/jobs/me",
    CREATE_JOB: "/api/jobs",
    GET_JOB_BY_ID: (id) => `/api/jobs/${id}`,
    UPDATE_JOB: (id) => `/api/jobs/${id}`,
    DELETE_JOB: (id) => `/api/jobs/${id}`,
    MATCH_JOB: (id) => `/api/jobs/${id}/matches`,
    GET_JOB_APPLICATIONS: (id) => `/api/jobs/${id}/applications`,
    ACCEPT_AND_FUND_APPLICATION: (jobId, applicationId) =>
      `/api/jobs/${jobId}/applications/${applicationId}/accept-and-fund`,
  },

  ASSIGNMENTS: {
    CREATE_ASSIGNMENT: "/api/assignments",
    GET_ASSIGNMENTS: "/api/assignments",
    GET_ASSIGNMENT_BY_ID: (id) => `/api/assignments/${id}`,
    UPDATE_ASSIGNMENT: (id) => `/api/assignments/${id}`,
    DELETE_ASSIGNMENT: (id) => `/api/assignments/${id}`,
    APPROVE_SATISFACTION: (id) => `/api/assignments/${id}/approve-satisfaction`,
    DISPUTE_SATISFACTION: (id) => `/api/assignments/${id}/dispute-satisfaction`,
  },

  APPLICATIONS: {
    CREATE_APPLICATION: "/api/applications",
    ADD_APPLICATION: "/api/applications",
    GET_APPLICATIONS: "/api/applications",
    GET_APPLICATION_METRICS: "/api/applications/metrics",
    GET_APPLICATION_BY_ID: (id) => `/api/applications/${id}`,
    UPDATE_APPLICATION: (id) => `/api/applications/${id}`,
    DELETE_APPLICATION: (id) => `/api/applications/${id}`,
  },

  PAYMENTS: {
    INITIATE_PAYMENT: "/api/payments/initiate",
    WEBHOOK: "/api/payments/webhook",
    VERIFY_PAYMENT: (reference) => `/api/payments/${reference}/verify`,
    GET_PAYMENTS: "/api/payments",
    GET_PAYMENT_BY_ID: (id) => `/api/payments/${id}`,
    GET_PAYMENT_HISTORY: (userId) => `/api/payments/history/${userId}`,
  },

  WALLET: {
    GET_WALLET: "/api/wallet",
    INCREASE_BALANCE: "/api/wallet",
    UPDATE_BALANCE: "/api/wallet",
  },

  ADMIN_PAYMENTS: {
    GET_PENDING_APPROVAL: "/api/admin/payments/pending-admin-approval",
    GET_PENDING_DISPUTES: "/api/admin/payments/pending-disputes",
    APPROVE_PAYMENT: (paymentId) => `/api/admin/payments/${paymentId}/approve-payment`,
    REJECT_PAYMENT: (paymentId) => `/api/admin/payments/${paymentId}/reject-payment`,
    GET_DISPUTE: (disputeId) => `/api/admin/payments/${disputeId}`,
    RESOLVE_DISPUTE: (disputeId) => `/api/admin/payments/disputes/${disputeId}/resolve`,
  },

  ADMIN: {
    // Overview & Global
    OVERVIEW_METRICS: "/api/admin/dashboard/overview-metrics",
    REVENUE_ESCROW_CHART: "/api/admin/dashboard/revenue-escrow-chart",
    CRITICAL_ALERTS: "/api/admin/dashboard/critical-alerts",
    RECENT_ACTIVITY: "/api/admin/dashboard/recent-activity",
    ANNOUNCEMENTS: "/api/admin/announcements",
    SEARCH: "/api/admin/search",

    // User Management
    USERS_METRICS: "/api/admin/users/metrics",
    USERS_LIST: "/api/admin/users",
    USER_BY_ID: (id) => `/api/admin/users/${id}`,
    UPDATE_USER_STATUS: (id) => `/api/admin/users/${id}/status`,
    VERIFICATION_QUEUE: "/api/admin/users/verification-queue",
    UPDATE_USER_VERIFICATION: (id) => `/api/admin/users/${id}/verification`,
    IMPERSONATE_USER: (id) => `/api/admin/users/${id}/impersonate`,

    // Jobs Management
    JOBS_METRICS: "/api/admin/jobs/metrics",
    JOBS_LIST: "/api/admin/jobs",
    JOB_BY_ID: (id) => `/api/admin/jobs/${id}`,
    UPDATE_JOB_STATUS: (id) => `/api/admin/jobs/${id}/status`,
    FORCE_CANCEL_JOB: (id) => `/api/admin/jobs/${id}/force-cancel`,

    // Disputes Management
    DISPUTES_METRICS: "/api/admin/disputes/metrics",
    DISPUTES_LIST: "/api/admin/disputes",
    DISPUTE_BY_ID: (id) => `/api/admin/disputes/${id}`,
    ASSIGN_DISPUTE: (id) => `/api/admin/disputes/${id}/assign`,
    ARBITRATE_DISPUTE: (id) => `/api/admin/disputes/${id}/arbitrate`,
    REVIEWS_LIST: "/api/admin/reviews",
    DELETE_REVIEW: (id) => `/api/admin/reviews/${id}`,

    // Finance Management
    FINANCE_OVERVIEW_METRICS: "/api/admin/finance/overview-metrics",
    FINANCE_REVENUE_ANALYTICS: "/api/admin/finance/revenue-analytics",
    FINANCE_EARNINGS_BREAKDOWN: "/api/admin/finance/earnings-breakdown",
    FINANCE_ESCROW_SUMMARY: "/api/admin/finance/escrow-summary",
    FINANCE_PAYOUT_SUMMARY: "/api/admin/finance/payout-summary",
    FINANCE_TRANSACTIONS: "/api/admin/finance/transactions",
    FINANCE_TRANSACTION_BY_ID: (id) => `/api/admin/finance/transactions/${id}`,
    RECONCILE_TRANSACTION: (id) => `/api/admin/finance/transactions/${id}/reconcile`,
    FINANCE_EXPORT_TRANSACTIONS: "/api/admin/finance/transactions/export",
    FINANCE_ESCROW_METRICS: "/api/admin/finance/escrow/metrics",
    FINANCE_ESCROW_LIST: "/api/admin/finance/escrow",
    FINANCE_ESCROW_BY_ID: (id) => `/api/admin/finance/escrow/${id}`,
    MANUAL_RELEASE_ESCROW: (id) => `/api/admin/finance/escrow/${id}/manual-release`,
    FREEZE_ESCROW: (id) => `/api/admin/finance/escrow/${id}/freeze`,
    FINANCE_PAYOUTS_METRICS: "/api/admin/finance/payouts/metrics",
    FINANCE_PAYOUTS_LIST: "/api/admin/finance/payouts",
    FINANCE_PAYOUT_BY_ID: (id) => `/api/admin/finance/payouts/${id}`,
    APPROVE_PAYOUT: (id) => `/api/admin/finance/payouts/${id}/approve`,
    BATCH_APPROVE_PAYOUTS: "/api/admin/finance/payouts/batch-approve",
    REJECT_PAYOUT: (id) => `/api/admin/finance/payouts/${id}/reject`,
    RETRY_PAYOUT: (id) => `/api/admin/finance/payouts/${id}/retry`,
    FINANCE_REFUNDS_METRICS: "/api/admin/finance/refunds/metrics",
    FINANCE_REFUNDS_LIST: "/api/admin/finance/refunds",
    FINANCE_REFUND_BY_ID: (id) => `/api/admin/finance/refunds/${id}`,
    PROCESS_REFUND: (id) => `/api/admin/finance/refunds/${id}/process`,
    MANUAL_INITIATE_REFUND: "/api/admin/finance/refunds/manual-initiate",
    COMMISSION_METRICS: "/api/admin/finance/commission/metrics",
    COMMISSION_SETTINGS: "/api/admin/finance/commission/settings",
    COMMISSION_CATEGORIES: "/api/admin/finance/commission/categories",
    COMMISSION_CATEGORY_BY_ID: (id) => `/api/admin/finance/commission/categories/${id}`,
  },

  PROFESSIONALS: {
    DASHBOARD_METRICS: "/api/professionals/dashboard/metrics",
    PERFORMANCE: "/api/professionals/performance",
  },

  NOTIFICATIONS: {
    GET_NOTIFICATIONS: "/api/notifications",
    MARK_AS_READ: (id) => `/api/notifications/${id}/read`,
    MARK_ALL_READ: "/api/notifications/mark-all-read",
  },

  MESSAGING: {
    THREADS: "/api/chat/threads",
    THREAD_MESSAGES: (threadId) => `/api/chat/threads/${threadId}/messages`,
    THREAD_READ: (threadId) => `/api/chat/threads/${threadId}/read`,
    USER_INFO: (userId) => `/api/chat/users/${userId}`,
    APPROVED_CONTACTS: "/api/chat/contacts/approved",
    ACCEPT_REQUEST: (threadId) => `/api/chat/threads/${threadId}/accept`,
    DECLINE_REQUEST: (threadId) => `/api/chat/threads/${threadId}/decline`,
  },

  SEARCH: {
    PROFESSIONALS: "/api/search/professionals",
    AI_SEARCH_PROFESSIONALS: "/api/search/professionals",
    FILTERS: "/api/search/filters",
    SKILLS_AUTOCOMPLETE: "/api/search/skills",
  },

  VERIFICATION: {
    STATUS: "/api/verification/status",
    GET_STATUS: "/api/verification/status",
    SUBMIT_IDENTITY: "/api/verification/identity",
    SUBMIT_PROFESSIONAL: "/api/verification/professional",
    SUBMIT_FACE: "/api/verification/face",
    BANKS: "/api/verification/banks",
    RESOLVE_ACCOUNT: "/api/verification/resolve-account",
    SUBMIT_PAYMENT: "/api/verification/payment",
    SUBMIT_ALL: "/api/verification/submit",
    PREVIEW: "/api/verification/preview",
    ADMIN: {
      LIST: "/api/admin/verifications",
      DETAILS: (id) => `/api/admin/verifications/${id}`,
      APPROVE: (id) => `/api/admin/verifications/${id}/approve`,
      REJECT: (id) => `/api/admin/verifications/${id}/reject`,
    },
  },

  WAITLIST: "/api/waitlist",
};
