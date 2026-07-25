import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: Number(import.meta.env.VITE_REQUEST_TIMEOUT),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Response Interceptor

api.interceptors.response.use(
  (response) => response,

  (error) => {
    console.error("API Error:", error);

    if (error.response?.status === 401) {
      toast.error("Unauthorized Request");
    } else if (error.response?.status === 500) {
      toast.error("Internal Server Error");
    } else {
      toast.error(
        error.response?.data?.message ||
        "API Request Failed"
      );
    }

    return Promise.reject(error);
  }
);

export default api;