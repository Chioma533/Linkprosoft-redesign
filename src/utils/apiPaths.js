export const API_BASE_URL = "https://linkprosoft-backend-hxmc.onrender.com";
// export const API_BASE_URL = "http://localhost:5020";

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

  ADMIN_PAYMENTS: {
    GET_PENDING_APPROVAL: "/api/admin/payments/pending-admin-approval",
    GET_PENDING_DISPUTES: "/api/admin/payments/pending-disputes",
    APPROVE_PAYMENT: (paymentId) => `/api/admin/payments/${paymentId}/approve-payment`,
    REJECT_PAYMENT: (paymentId) => `/api/admin/payments/${paymentId}/reject-payment`,
    GET_DISPUTE: (disputeId) => `/api/admin/payments/${disputeId}`,
    RESOLVE_DISPUTE: (disputeId) => `/api/admin/payments/disputes/${disputeId}/resolve`,
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

  WAITLIST: "/api/waitlist",
};
