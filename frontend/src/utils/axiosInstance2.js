import axios from "axios";

const axiosInstance2 = axios.create({
    baseURL: process.env.REACT_APP_API_LLM_URL, 
});

axiosInstance2.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance2.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const { status } = error.response;

            if (status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
            }

            if (status === 403) {
                console.error("Access denied. You do not have permission to perform this action.");
            } else if (status >= 500) {
                console.error("Server error. Please try again later.");
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance2;