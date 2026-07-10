import axios from "axios"
import { API_BASE_URL } from "./apiPaths"

// Create axios instance
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept:"application/json"
    }
})

// Add request interceptor to include token
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token")
        console.log(accessToken,"token")
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

    // request interceptors
    axiosInstance.interceptors.response.use(
        (response) => {
            return(response)
        },
        (error) => {
        if(error.response){
                if(error.response.status === 401){
                window.location.href = "/login"
            }else if(error.response.status === 500){
                console.error("Server error, Please try again later")
            }else if (error.code === "ECONNABORTED"){
                console.error("Request timeout, Please try again")
            }
        }
            return Promise.reject(error);
      }
    )

export default axiosInstance

