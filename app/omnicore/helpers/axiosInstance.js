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
    console.log("new token after refresh", newToken);

    if (newToken) {
      const { useAuthStore } = await import("../stores/authStore");
      const authStore = useAuthStore();

      authStore.setToken(newToken, authStore.user.username);
      return newToken;
    }

    throw new Error("No token returned during refresh");
  } catch (err) {
    console.log("i died here ", err);
    await broadcastLogout();
    ``;
    throw err;
  }
}
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const data = error.response?.data || {};
    const message = data?.message;
    const route = data?.type?.route;
    const originalRequest = error.config;

    // Handle forced logout first
    if (
      status === 401 &&
      (message === "Session has expired" ||
        message === "Your account has been deactivated." ||
        route === "iam/auth/login")
    ) {
      console.warn("⛔ Force logout triggered:", route || message);

      localStorage.clear(); // Remove tokens immediately

      // Redirect to login
      const { useRouter } = await import("vue-router");
      const router = useRouter();

      if (router.currentRoute.value.path !== "/iam/auth/login") {
        router.push("/iam/auth/login");
      }

      return Promise.reject(error); // Stop any further processing
    }

    // Skip retries if request already retried
    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Handle normal 401 with refresh
    if (status === 401) {
      originalRequest._retry = true;

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

      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        isRefreshing = false;

        processQueue(null, newToken);

        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      }
    }

    // Other errors
    return Promise.reject(error);
  }
);

export default axiosInstance;
