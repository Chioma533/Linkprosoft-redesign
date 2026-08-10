export const API_BASE_URL = "https://linprosoft-backend.onrender.com"
//export const API_BASE_URL = "http://localhost:5020"
export const API_PATHS = {
  AUTH: {
    SIGNUP: "/api/auth/signup",
    LOGIN: "/api/auth/login",
    VERIFY: "/api/auth/verify-email",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    VERIFY_RESET_CODE: "/api/auth/verify-reset-code",
    RESET_PASSWORD: "/api/auth/reset-password",
    RESEND_OTP: "/api/auth/resend-otp",
  },
  PROFILE: {
    GET_PROFILE: "/api/profile",
    UPDATE_PROFILE: "/api/profile",
  },
  SKILLS: {
    GET_SKILLS: "/api/skills",
    ADD_SKILLS: "/api/skills",
    DELETE_SKILLS: "/api/skills/:id",
    UPDATE_SKILLS: "/api/skills/:id",
  },

  JOBS: {
    GET_JOBS: "/api/jobs",
    GET_MY_JOBS: "/api/jobs/me",
    CREATE_JOB: "/api/jobs",
    GET_JOB_BY_ID: (id) => `/api/jobs/${id}`,
    UPDATE_JOB: (id) => `/api/jobs/${id}`,
    DELETE_JOB: (id) => `/api/jobs/${id}`,
    MATCH_JOB: (id) => `/api/jobs/${id}/matches`,
  },
  ASSIGNMENTS: {
    CREATE_ASSIGNMENT: "/api/assignments",
    APPROVE_SATISFACTION: (id) => `/api/assignments/${id}/approve-satisfaction`,
    DISPUTE_SATISFACTION: (id) => `/api/assignments/${id}/dispute-satisfaction`,
  },
  APPLICATIONS: {
    GET_APPLICATIONS: "/api/applications",
    ADD_APPLICATION: "/api/applications",
    DELETE_APPLICATION: "/api/applications/:id",
    UPDATE_APPLICATION: "/api/applications/:id",
  },
  PAYMENTS: {
    GET_PAYMENTS: "/api/payments",
    GET_PAYMENT_BY_ID: "/api/payments/:id",
  },

  GOOGLE_AUTH: {
    GOOGLE_SIGNIN: "/api/auth/google",
    GOOGLE_CALLBACK: "/auth/google/callback",
  },
  SEARCH: {
    PROFESSIONALS: "/api/search/professionals",
    FILTERS: "/api/search/filters",
    SKILLS_AUTOCOMPLETE: "/api/search/skills",
  }
};
