import { ref, watch, computed } from 'vue'
import axios from 'axios'

const cache = new Map() // Cache for storing API responses

export function useApi(url, method = 'GET', options = {}) {
    const data = ref(null)
    const error = ref(null)
    const status = ref('idle') // idle | loading | success | error | refreshed
    const lastFetched = ref(null)

    const request = async (payload = null) => {
        status.value = 'loading'
        error.value = null

        try {
            // Prepare request config
            const config = {
                method,
                url,
                ...options,
            }

            if (payload) config.data = payload // Attach body if needed

            // Use cache for GET requests
            if (method.toUpperCase() === 'GET' && cache.has(url)) {
                data.value = cache.get(url)
                status.value = 'success'
                return
            }

            const response = await axios(config)
            data.value = response.data

            // Cache only GET requests
            if (method.toUpperCase() === 'GET') cache.set(url, response.data)

            status.value = 'success'
            lastFetched.value = new Date().toISOString()
        } catch (err) {
            error.value = err.response?.data?.errors || [err.message]
            status.value = 'error'
        }
    }

    // Auto-fetch for GET requests
    watch(() => [url, method, options], () => {
        if (method.toUpperCase() === 'GET') request()
    }, { deep: true, immediate: true })

    const refresh = async () => {
        status.value = 'loading'
        cache.delete(url) // Remove cache before re-fetching
        await request()
        status.value = 'refreshed'
    }

    const clear = () => {
        data.value = null
        error.value = null
        status.value = 'idle'
    }

    return {
        data,
        error,
        status,
        refresh,
        clear,
        lastFetched,
        request, // Call this for POST, PUT, DELETE
        isLoading: computed(() => status.value === 'loading'),
        isError: computed(() => status.value === 'error'),
    }
}
