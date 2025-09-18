import axios from "axios";
import { encrypt, decrypt } from "./crypto";

let isRefreshing = false;
let requestQueue = [];

const axiosInstance = axios.create({
  baseURL: import.meta.env.API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
});

// Encryption Helpers
function encryptToken(token) {
  return encrypt(token);
}

function decryptToken(encryptedToken) {
  return decrypt(encryptedToken);
}

async function broadcastLogout() {
  const { useAuthStore } = await import("../stores/authStore");
  const authStore = useAuthStore();

  // This will handle all cleanup internally
  authStore.logOutRequest();

  localStorage.setItem("logout-event", Date.now().toString());

  const { useRouter } = await import("vue-router");
  const router = useRouter();

  if (router.currentRoute.value.path !== "/iam/login") {
    router.push("/iam/login");
  }
}

// Cross-tab logout
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

// Request Interceptor
axiosInstance.interceptors.request.use(async (config) => {
  // console.log('[AXIOS INTERCEPTOR] Executing...', config)
  if (config.skipAuth) return config;

  const encryptedToken = localStorage.getItem("user.token");
  const token = decryptToken(encryptedToken);

  if (token && !config.headers["Authorization"]) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

// Token Refresh Handler
function processQueue(error, token = null) {
  requestQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  requestQueue = [];
}

// Refresh Access Token
async function refreshAccessToken() {
  try {
    const response = await axios.post("/v1/iam/auth/refresh", null, {
      withCredentials: true,
    });

    const newToken = response.data?.dataPayload?.access_token;
    if (newToken) {
      const encrypted = encryptToken(newToken);
      localStorage.setItem("user.token", encrypted);

      const { useAuthStore } = await import("../stores/authStore");
      const authStore = useAuthStore();
      authStore.setToken(newToken, authStore.user.username);

      return newToken;
    }
    //logout
    authStore.removeToken();
    useRouter().push("/iam/auth/login");

    throw new Error("No token returned");
  } catch (err) {
    await broadcastLogout();
    throw err;
  }
}

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const data = error.response?.data || {};

    const message = data?.message;
    const type = data?.type;
    const originalRequest = error.config;

    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (status === 401) {
      if (
        message === "Session has expired" ||
        message === "Your account has been deactivated." ||
        (typeof type === "object" && type.route?.includes("/auth/login"))
      ) {
        await broadcastLogout();
        return Promise.reject(error);
      }
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          requestQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return axiosInstance(originalRequest);
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

    return Promise.reject(error);
  }
);

export default axiosInstance;
