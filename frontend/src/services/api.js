import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: Number(import.meta.env.VITE_REQUEST_TIMEOUT),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor

api.interceptors.request.use(
  (config) => {
    console.log(
      `API Request: ${config.method?.toUpperCase()} ${config.url}`
    );

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor

api.interceptors.response.use(
  (response) => response,

  (error) => {
    console.error("API Error:", error);

    if (error.response?.status === 401) {
      console.warn("Unauthorized request");
    }

    if (error.response?.status === 500) {
      console.warn("Internal server error");
    }

    return Promise.reject(error);
  }
);

export default api;