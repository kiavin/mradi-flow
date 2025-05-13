import { ref, computed, watch, watchEffect } from 'vue'
import axios from 'axios'
import qs from 'qs' // Import for handling query parameters
import axiosInstance from './axiosInstance'

// Cache storage with expiration
const cache = new Map()

const setCache = (key, value, ttl = 5 * 60 * 1000) => {
    cache.set(key, { value, expiry: Date.now() + ttl })
}

const getCache = (key) => {
    const cached = cache.get(key)
    if (!cached) return null
    if (Date.now() > cached.expiry) {
        cache.delete(key)
        return null
    }
    return cached.value
}

// Helper function to clear all variants of a URL from cache
const clearCacheForUrl = (baseUrl) => {
    for (const key of cache.keys()) {
        if (key.startsWith(baseUrl)) {
            cache.delete(key)
        }
    }
}

export function useApi(baseUrl, method = 'GET', options = {}, autoFetch = true, enableCache = false, useAuth = false, manualToken = null) {
    const data = ref(null)
    const error = ref(null)
    const status = ref('idle') // idle | loading | success | error | refreshed
    const lastFetched = ref(null)
    let controller = null

    const request = async (payload = null, queryParams = {}) => {
        if (controller) {
            await new Promise(resolve => setTimeout(resolve, 50))
            controller.abort()
        }
        controller = new AbortController()

        status.value = 'loading'
        error.value = null

        try {
            const queryString = Object.keys(queryParams).length ? `?${qs.stringify(queryParams)}` : ''
            const url = `${baseUrl}${queryString}`

            if (enableCache && method.toUpperCase() !== 'GET') {
                clearCacheForUrl(baseUrl)
            }

            if (enableCache && method.toUpperCase() === 'GET') {
                const cachedData = getCache(url)
                if (cachedData) {
                    data.value = cachedData
                    status.value = 'success'
                    return
                }
            }
            ////////////////
            const headers = {
                ...(options.headers || {})
            }

            // Add manual Authorization header if token is provided
            if (manualToken) {
                headers['Authorization'] = `Bearer ${manualToken}`
            }
            ////////////////

            const config = {
                method,
                url,
                signal: controller.signal, //signal for cancellation
                headers,
                ...(useAuth ? {} : { skipAuth: true }), // custom flag for axiosInterceptor
                ...options,
            }

            if (payload) config.data = payload

            // const response = await axios(config)
            const axiosToUse = useAuth ? axiosInstance : axios
            const response = await axiosToUse(config)
            data.value = response.data

            if (enableCache && method.toUpperCase() === 'GET') {
                setCache(url, response.data)
            }

            status.value = 'success'
            lastFetched.value = new Date().toISOString()
        } catch (err) {
            if (axios.isCancel(err)) return
            error.value = err.response?.data?.errorPayload?.errors || err.response?.data || [err.message]
            status.value = 'error'
            data.value = null
        }
    }



    // Auto-fetch for GET requests when dependencies change
    watch(() => [baseUrl, method, options], () => {
        if (method.toUpperCase() === 'GET' && autoFetch) request()
    }, { deep: true, immediate: true })

    const refresh = async () => {
        status.value = 'loading'
        if (enableCache) clearCacheForUrl(baseUrl) // Remove cache before re-fetching
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
        lastFetched,
        request,
        refresh,
        clear,
        isLoading: computed(() => status.value === 'loading'),
        isError: computed(() => status.value === 'error'),
    }
}
