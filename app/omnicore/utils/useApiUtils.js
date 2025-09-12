// Cache storage with expiration
import { ref, onMounted, onUnmounted } from 'vue'

const cache = new Map();
const isOnline = ref(navigator.onLine)

export const setCache = (key, value, ttl = 5 * 60 * 1000) => {
    cache.set(key, { value, expiry: Date.now() + ttl });
};

export const getCache = (key) => {
    const cached = cache.get(key);
    if (!cached) return null;
    if (Date.now() > cached.expiry) {
        cache.delete(key);
        return null;
    }
    return cached.value;
};

export const clearCacheForUrl = (baseUrl) => {
    for (const key of cache.keys()) {
        if (key.startsWith(baseUrl)) {
            cache.delete(key);
        }
    }
};

// Utility to build query string
export const buildQueryString = (baseUrl, queryParams = {}) => {
    return Object.keys(queryParams).length
        ? `${baseUrl}?${qs.stringify(queryParams)}`
        : baseUrl;
};

export function useNetworkStatus() {
  const updateOnlineStatus = () => {
    isOnline.value = navigator.onLine
  }

  onMounted(() => {
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
  })

  onUnmounted(() => {
    window.removeEventListener('online', updateOnlineStatus)
    window.removeEventListener('offline', updateOnlineStatus)
  })

  return { isOnline }
}