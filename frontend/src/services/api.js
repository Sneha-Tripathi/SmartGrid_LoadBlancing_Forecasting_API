import axios from "axios";
import toast from "react-hot-toast";
import { getCacheKey, getFromCache, setInCache } from "../utils/cache";

// -------------------------------
// Axios Instance
// -------------------------------

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: Number(import.meta.env.VITE_REQUEST_TIMEOUT || 10000),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// -------------------------------
// Retry Configuration
// -------------------------------

const RETRY_DELAYS = [1000, 3000, 5000]; // ms between retries
const MAX_RETRIES = 3;

function shouldRetry(error, attempt) {
  if (attempt >= MAX_RETRIES) return false;
  // Retry on network errors, 5xx, or timeout
  if (!error.response) return true;
  if (error.response.status >= 500) return true;
  if (error.code === "ECONNABORTED") return true;
  // Don't retry 4xx except 429 (rate limit)
  if (error.response.status === 429) return true;
  return false;
}

function getRetryDelay(attempt) {
  return RETRY_DELAYS[attempt] || 5000;
}

// -------------------------------
// Abort Controller Store
// -------------------------------

const pendingRequests = new Map();

/** Cancel all pending requests matching a URL pattern */
export function cancelRequests(pattern) {
  for (const [key, controller] of pendingRequests) {
    if (key.includes(pattern)) {
      controller.abort();
      pendingRequests.delete(key);
    }
  }
}

/** Cancel all pending requests */
export function cancelAllRequests() {
  for (const controller of pendingRequests.values()) {
    controller.abort();
  }
  pendingRequests.clear();
}

// Flag to prevent infinite refresh loops
let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

// -------------------------------
// Request Interceptor
// -------------------------------

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("sg-access-token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // --- Cache: serve from cache if available ---
    if (config.useCache && config.method?.toLowerCase() === "get") {
      const cacheKey = getCacheKey(config);
      const cached = getFromCache(cacheKey);
      if (cached) {
        config._cachedResponse = cached;
      }
    }

    // --- Cancellation: attach AbortController ---
    if (!config.signal) {
      const controller = new AbortController();
      config.signal = controller.signal;
      const key = config.url || "";
      // Cancel any existing request to the same URL (GET only)
      if (config.method?.toLowerCase() === "get" && pendingRequests.has(key)) {
        pendingRequests.get(key).abort();
      }
      pendingRequests.set(key, controller);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// -------------------------------
// Response Interceptor
// -------------------------------

api.interceptors.response.use(
  (response) => {
    // Clean up pending requests tracking
    if (response.config?.url) {
      pendingRequests.delete(response.config.url);
    }

    // --- Cache: store successful GET responses ---
    if (response.config?.useCache && response.config.method?.toLowerCase() === "get") {
      const cacheKey = getCacheKey(response.config);
      setInCache(cacheKey, response.data, response.config.cacheTtl);
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Skip if config is missing (aborted or network error)
    if (!originalRequest) {
      if (!axios.isCancel(error)) {
        toast.error("Network error - please check your connection");
      }
      return Promise.reject(error);
    }

    // Clean up pending requests tracking
    if (originalRequest.url) {
      pendingRequests.delete(originalRequest.url);
    }

    // --- Retry Logic ---
    if (originalRequest._retryCount === undefined) {
      originalRequest._retryCount = 0;
    }

    if (shouldRetry(error, originalRequest._retryCount)) {
      originalRequest._retryCount += 1;
      const delay = getRetryDelay(originalRequest._retryCount - 1);

      // Show a toast for retry attempts
      if (originalRequest._retryCount <= 2) {
        const status = error.response?.status ? ` (${error.response.status})` : "";
        toast.loading(`Retrying request${status}... (${originalRequest._retryCount}/${MAX_RETRIES})`, {
          id: `retry-${originalRequest.url}`,
          duration: delay + 500,
        });
      }

      // Create a new AbortController for the retry
      const controller = new AbortController();
      originalRequest.signal = controller.signal;

      await new Promise((resolve) => setTimeout(resolve, delay));
      return api(originalRequest);
    }

    // Only attempt refresh for 401 and if we haven't retried yet
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/register") &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("sg-refresh-token");
      if (!refreshToken) {
        isRefreshing = false;
        localStorage.removeItem("sg-access-token");
        localStorage.removeItem("sg-refresh-token");
        localStorage.removeItem("sg-user");
        localStorage.removeItem("sg-session-expiry");
        window.location.href = "/login?expired=1";
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refresh_token: refreshToken }
        );

        const newAccessToken = data.access_token;
        const newRefreshToken = data.refresh_token;

        localStorage.setItem("sg-access-token", newAccessToken);
        localStorage.setItem("sg-refresh-token", newRefreshToken);

        const rememberMe = localStorage.getItem("sg-remember-me") === "true";
        if (rememberMe) {
          const expiry = Date.now() + data.expires_in * 1000;
          localStorage.setItem("sg-session-expiry", String(expiry));
        }

        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("sg-access-token");
        localStorage.removeItem("sg-refresh-token");
        localStorage.removeItem("sg-user");
        localStorage.removeItem("sg-session-expiry");
        localStorage.removeItem("sg-remember-me");
        window.location.href = "/login?expired=1";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // --- Global Error Handling ---
    if (!axios.isCancel(error)) {
      console.error("API Error:", error);

      // Don't toast for auth endpoints (handled elsewhere) or aborted requests
      const isAuthEndpoint = originalRequest?.url?.includes("/auth/");
      const isAborted = axios.isCancel(error) || error.name === "CanceledError" || error.code === "ERR_CANCELED";

      if (!isAuthEndpoint && !isAborted) {
        if (error.response?.status === 500) {
          toast.error("Internal Server Error — please try again later");
        } else if (error.code === "ECONNABORTED") {
          toast.error("Request timed out — retrying...");
        } else if (!error.response) {
          toast.error("Network error — please check your connection");
        } else if (error.response?.status === 429) {
          toast.error("Rate limit exceeded — slowing down");
        } else if (error.response?.status !== 401) {
          const msg =
            error.response?.data?.detail ||
            error.response?.data?.message ||
            "API Request Failed";
          toast.error(msg);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;

