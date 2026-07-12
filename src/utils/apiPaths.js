export const API_BASE_URL = "https://linprosoft-backend.onrender.com"

export const API_PATHS = {
    AUTH:{
        SIGNUP: "/api/auth/signup",
        LOGIN: "api/auth/login",
        LOGOUT: "api/auth/logout",
        VERIFY: "api/auth/verify",
        FORGOT_PASSWORD: "api/auth/forgot-password",
        VERIFY_RESET_CODE: "api/auth/verify-reset-code",
        RESET_PASSWORD: "api/auth/reset-password"
    },
    PROFILE:{
        GET_PROFILE: "api/profile",
        UPDATE_PROFILE: "api/profile",
    },
    SKILLS:{
        GET_SKILLS: "api/skills",
        ADD_SKILLS: "api/skills",
        DELETE_SKILLS: "api/skills/:id",
        UPDATE_SKILLS: "api/skills/:id"
    },
    JOBS:{
        GET_JOBS: "api/jobs",
        ADD_JOB: "api/jobs",
        DELETE_JOB: "api/jobs/:id",
        UPDATE_JOB: "api/jobs/:id"
    },
    APPLICATIONS:{
        GET_APPLICATIONS: "api/applications",
        ADD_APPLICATION: "api/applications",
        DELETE_APPLICATION: "api/applications/:id",
        UPDATE_APPLICATION: "api/applications/:id"
    },
    PAYMENTS:{
        GET_PAYMENTS: "api/payments",
        GET_PAYMENT_BY_ID: "api/payments/:id",
    }

}