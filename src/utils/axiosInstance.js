import axios from "axios"
import { API_BASE_URL } from "./apiPaths"

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

// Cookie sessions are authoritative. Do not resurrect the legacy bearer-token
// flow from localStorage: it can identify a different, expired account.
axiosInstance.interceptors.request.use(
    (config) => {
        if (config.headers) delete config.headers.Authorization;
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
                if (error.response.status === 500) {
                    console.error("Server error, Please try again later");
                } else if (error.code === "ECONNABORTED") {
                    console.error("Request timeout, Please try again");
                }
            }
            return Promise.reject(error);
        }
    );

export default axiosInstance

