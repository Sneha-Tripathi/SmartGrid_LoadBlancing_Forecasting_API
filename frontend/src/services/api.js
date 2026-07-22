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

api.interceptors.response.use(
  (response) => response,

  (error) => {

    console.group("API ERROR");

    console.log("URL :", error.config?.url);

    console.log("Method :", error.config?.method);

    console.log("Status :", error.response?.status);

    console.log("Message :", error.message);

    console.groupEnd();

    return Promise.reject(error);

  }
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