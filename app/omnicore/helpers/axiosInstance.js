import axios from "axios";
import { encrypt, decrypt } from "./crypto";

let isRefreshing = false;
let requestQueue = [];

// Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
});

function decryptToken(encryptedToken) {
  return decrypt(encryptedToken);
}

// Queue processor
function processQueue(error, token = null) {
  requestQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  requestQueue = [];
}

// Logout and cleanup
async function broadcastLogout() {
  const { useAuthStore } = await import("../stores/authStore");
  const authStore = useAuthStore();
  authStore.logOutRequest(); // Internal cleanups

  localStorage.setItem("logout-event", Date.now().toString());

  const { useRouter } = await import("vue-router");
  const router = useRouter();

  if (router.currentRoute.value.path !== "/iam/auth/login") {
    router.push("/iam/auth/login");
  }
}

// Cross-tab sync logout
window.addEventListener("storage", async (event) => {
  if (event.key === "logout-event") {
    const { useAuthStore } = await import("../stores/authStore");
    const authStore = useAuthStore();
    authStore.removeToken();
    authStore.removeRefreshToken();
    const { useRouter } = await import("vue-router");
    useRouter().push("/iam/login/index");
  }
});

// Attach token to requests
axiosInstance.interceptors.request.use((config) => {
  if (config.skipAuth) return config;

  const encryptedToken = localStorage.getItem("user.token");
  const token = decryptToken(encryptedToken);

  if (token && !config.headers["Authorization"]) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

// Refresh token function
async function refreshAccessToken() {
  try {
    const response = await axios.post("/v1/iam/auth/refresh", null, {
      withCredentials: true,
    });

    const newToken = response.data?.dataPayload?.data?.access_token;
    console.log('new token after refresh', newToken)

    if (newToken) {
      const { useAuthStore } = await import("../stores/authStore");
      const authStore = useAuthStore();

      authStore.setToken(newToken, authStore.user.username);
      return newToken;
    }

    throw new Error("No token returned during refresh");
  } catch (err) {
    console.log('i died here ', err)
    await broadcastLogout();``
    throw err;
  }
}
axiosInstance.interceptors.response.use(
  (response) => response, // Success: pass through
  async (error) => {
    const status = error.response?.status;
    const data = error.response?.data || {};
    const message = data?.message;
    const route = data?.type?.route; // ✅ Safely extract route
    const originalRequest = error.config;

    // Don't retry requests that already failed refresh
    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized
    if (status === 401) {
      // ✅ Exact match with logout-triggering route
      console.log("401 message and all that ", message, route);
      if (
        message === "Session has expired" ||
        message === "Your account has been deactivated." ||
        route === "iam/auth/login"
      ) {
        console.warn("⛔ Force logout triggered:", route || message);

        localStorage.clear(); // handles token cleanup & base redirect

        // ✅ Explicit redirect to the route if provided
        if (route) {
          const { useRouter } = await import("vue-router");
          const router = useRouter();

          router.push("/iam/auth/login");
        }

        return Promise.reject(error);
      }

      // ✅ Mark request as retried
      originalRequest._retry = true;

      // ✅ Queue if refresh already in progress
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          requestQueue.push({
            resolve: (token) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }
      // ✅ First 401 triggers refresh
      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        isRefreshing = false;

        // ✅ Process queue
        processQueue(null, newToken);

        // ✅ Retry original request
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      }
    }

    // Any other error
    return Promise.reject(error);
  }
);

export default axiosInstance;
