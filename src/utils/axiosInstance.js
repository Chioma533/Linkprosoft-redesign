import axios from "axios"
import { API_BASE_URL } from "./apiPaths"
import { debugLog } from "./debugLogger";

// Create axios instance
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 50000,
    // ensure cookies (HttpOnly accessToken) are sent with requests to the backend
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept:"application/json"
    }
})

// Add request interceptor to include token
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token")
        // console.log(accessToken,"token")
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        try {
            debugLog("axios_request", { url: config.url, method: config.method, authHeader: config.headers?.Authorization?.slice(0,40) || null });
        } catch (e) {
            console.debug("[axiosInstance] debugLog request failed", e);
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

    // response interceptor
    axiosInstance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.response) {
                try {
                    debugLog("axios_response_error", {
                        url: error.config?.url,
                        status: error.response.status,
                        data: error.response.data
                    });
                } catch (e) {
                    console.debug("[axiosInstance] debugLog response failed", e);
                }

                // Handle 401 Unauthorized
                if (error.response.status === 401) {
                    const reqUrl = error.config?.url || "";
                    const isAuthCheck = reqUrl.includes("/api/auth/me") || reqUrl.includes("/api/auth/verify");
                    const currentPath = window.location.pathname;
                    const isPublicRoute = ["/login", "/signup", "/verify-otp", "/forgot-password", "/reset-password", "/"].includes(currentPath);

                    // Only force redirect to /login if a core auth verification fails and we are not already on a public route
                    if (isAuthCheck && !isPublicRoute) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        window.location.href = "/login";
                    }
                } else if (error.response.status === 500) {
                    console.error("Server error, Please try again later");
                } else if (error.code === "ECONNABORTED") {
                    console.error("Request timeout, Please try again");
                }
            }
            return Promise.reject(error);
        }
    );

export default axiosInstance

