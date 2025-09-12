import { ref, computed, watch } from 'vue'
import axios from 'axios'
import qs from 'qs' // Import for handling query parameters
import axiosInstance from './axiosInstance'
import { useErrorRedirect } from '~/omnicore/helpers/useErrorRedirect.js'
import app from '../config/app'
import { useAlertStore } from '../stores/alert'
import { useNetworkStatus } from '../utils/useApiUtils'
import { useLiveSync } from './useLiveSync'

// Cache storage with expiration
const cache = new Map()

const { isOnline } = useNetworkStatus()

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

// This checks if the error is retryable.
const shouldRetry = (err) => {
    return (
        !axios.isCancel(err) &&
        [429, 503].includes(err?.response?.status)
    );
};

// This handles the actual retry delay and increments.
const handleRetry = async (err, attempt, retry, retryDelay, requestFn) => {
    if (attempt <= retry && shouldRetry(err)) {
        const delay = retryDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        return requestFn(attempt + 1);
    }
    throw err; // Not retryable or max retries reached
};



export function useApi(baseUrl, {
    method = 'GET',
    options = {},
    autoFetch = true,
    enableCache = false,
    useAuth = true,
    manualToken = null,
    autoAlert = false,
    transform = null, // response transformation
    onError = null, // Custom error handler
    onSuccess = null, // custom success hanlder
    onLoading = null, // onloading hanlder 
    onComplete = null,
    onAbort = null, // onAbort event hanlder
    retry = 0, // number of retry attempts
    retryDelay = 1000,// time between retries in ms
    loadingDelay = 0, // in milliseconds
    timeout = 30000, // New: Default timeout of 30 seconds
    mock = null,   // mock mode 
    pagination = false,
    transformPagination = null,
    realtimeOptions = null
} = {}) {

    const data = ref(null)
    const error = ref(null)
    const status = ref('idle') // idle | loading | success | error | refreshed
    const lastFetched = ref(null)
    let controller = null
    const progress = ref(0) // Progress (0-100)
    const realtime = ref(null)


    // pagination state
    const currentPage = ref(1);
    const perPage = ref(options.perPage || 10);
    const totalItems = ref(null);
    const totalPages = ref(null)


    const redirectEnabled = options?.redirectOnError ?? app.api?.redirectErrorPages

    if (realtimeOptions?.enabled) {

        realtime.value = useLiveSync({
            baseUrl: realtimeOptions.realtimeUrl ?? baseUrl,
            queryParams: realtimeOptions.realtimeParams,
            requestId: 'realtime',
            protocol: realtimeOptions.protocol || 'ws',
            transform,
            onMessage: realtimeOptions.onRealtimeMessage,
            onNotification: realtimeOptions.onNotification,
        })

        realtime.value.connect()
    }


    const buildBatchRequestConfig = (req) => {
        const {
            url = '',
            method = 'GET',
            payload = null,
            queryParams = {},
            headers = {}
        } = req

        const queryString = Object.keys(queryParams).length ? `?${qs.stringify(queryParams)}` : ''
        const fullUrl = `${url}${queryString}`

        return {
            method: method.toUpperCase(),
            url: fullUrl,
            headers: {
                ...(options.headers || {}),
                ...headers,
                ...(manualToken ? { Authorization: `Bearer ${manualToken}` } : {})
            },
            signal: controller.signal,
            ...(useAuth ? {} : { skipAuth: true }),
            ...(payload ? { data: payload } : {}),
            timeout
        }
    }

    let hasRunOnce = false // for `once` mode

    const mockApi = async (payload, queryParams) => {
        console.log('%c[MOCK MODE]', 'color: orange; font-weight: bold;', {
            payload,
            queryParams,
            method
        })

        if (typeof mock === 'object' && mock.once && hasRunOnce) {
            console.warn('[MOCK MODE] Once mode active – skipping mock, calling real API')
            return await request(payload, queryParams) // fallback to real API
        }

        status.value = 'loading'
        error.value = null

        const delay = typeof mock === 'object' && mock?.delay !== undefined ? mock.delay : 500
        const simulateError = typeof mock === 'object' && mock?.simulateError
        const simulateProgress = typeof mock === 'object' && mock?.simulateProgress

        // Simulate progress bar (optional)
        if (simulateProgress) {
            progress.value = 0
            const steps = 10
            const interval = delay / steps
            for (let i = 1; i <= steps; i++) {
                await new Promise(resolve => setTimeout(resolve, interval))
                progress.value = Math.min(100, Math.round((i / steps) * 100))
            }
        } else {
            await new Promise(resolve => setTimeout(resolve, delay))
        }

        if (simulateError) {
            status.value = 'error'
            error.value = mock?.error ?? ['Simulated API error']
            data.value = null
            return
        }

        // Dynamic mock (function or data)
        data.value = typeof mock === 'function' ? mock(payload, queryParams, method) : mock
        status.value = 'success'
        lastFetched.value = new Date().toISOString()

        if (mock?.once) {
            hasRunOnce = true
        }
    }


    const request = async (payload = null, queryParams = {}, overridePage = null) => {

        if (mock) {
            return await mockApi(payload, queryParams)
        }

        if (controller) {
            await new Promise(resolve => setTimeout(resolve, 50))
            controller.abort()
        }
        controller = new AbortController()

        // a delayed loading indicator
        const delayLoading = new Promise(resolve => {
            if (loadingDelay > 0) {
                setTimeout(resolve, loadingDelay)
            } else {
                resolve()
            }
        })
        await delayLoading

        status.value = 'loading'
        error.value = null

        // onloading custom hanlder
        if (typeof onLoading === 'function') {
            onLoading()
        }

        try {
            // const queryString = Object.keys(queryParams).length ? `?${qs.stringify(queryParams)}` : ''
            const queryString = Object.keys(queryParams).length || pagination

                // #############################
                ? `?${qs.stringify({
                    ...queryParams,
                    ...(pagination ? { page: overridePage ?? currentPage.value, per_page: perPage.value } : {})
                })}`
                : '';

            // #############################

            const url = `${baseUrl}${queryString}`

            if (enableCache && method.toUpperCase() !== 'GET') {
                clearCacheForUrl(baseUrl)
            }

            // if (enableCache && method.toUpperCase() === 'GET') {
            //     const cachedData = getCache(url)
            //     if (cachedData) {
            //         data.value = cachedData
            //         status.value = 'success'
            //         return
            //     }
            // }

            // #############################

            if (!isOnline.value && enableCache && method.toUpperCase() === 'GET') {
                const cachedData = getCache(queryString);
                if (cachedData) {
                    const transformedData = transform ? transform(cachedData) : cachedData;
                    data.value = transformedData;

                    // Populate pagination state
                    if (pagination && cachedData?.meta) {
                        totalItems.value = cachedData.meta.total || null;
                        currentPage.value = cachedData.meta.current_page || currentPage.value;
                        perPage.value = cachedData.meta.per_page || perPage.value;
                    }

                    status.value = 'success';
                    if (onSuccess) onSuccess(transformedData);
                    return;
                } else {
                    error.value = ['Offline: No cached data available']
                    status.value = 'error'
                    return
                }
            }
            // #############################

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
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        progress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    }
                },
                onDownloadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        progress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    }
                },
                timeout
            }

            if (payload) config.data = payload

            // const response = await axios(config)
            const axiosToUse = useAuth ? axiosInstance : axios
            const response = await axiosToUse(config)
            // #############################

            if (pagination) {
                if (typeof transformPagination === 'function') {
                    const meta = transformPagination(response.data)
                    totalItems.value = meta.totalItems ?? totalItems.value
                    currentPage.value = meta.currentPage ?? currentPage.value
                    perPage.value = meta.perPage ?? perPage.value
                    totalPages.value = meta.totalPages ?? totalPages.value
                } else if (response.data?.meta) {
                    totalItems.value = response.data.meta.total || null
                    currentPage.value = response.data.meta.current_page || currentPage.value
                    perPage.value = response.data.meta.per_page || perPage.value
                }
            }

            // #############################

            // ********* enabling auto alert ie triggering alerts automatically ***********
            if (autoAlert && response.data?.alertifyPayload) {
                const alertStore = useAlertStore()
                alertStore.show(response.data.alertifyPayload)
            }

            // ****************************************************

            // data.value = response.data
            data.value = transform ? transform(response.data) : response.data

            //  custom onsucess hanlder
            if (typeof onSuccess === 'function') {
                onSuccess(data.value)
            }

            if (enableCache && method.toUpperCase() === 'GET') {
                setCache(url, response.data)
            }

            status.value = 'success'
            lastFetched.value = new Date().toISOString()
        } catch (err) {
            if (axios.isCancel(err)) return

            // Retry handler — only if retry is enabled
            if (retry) {
                return await handleRetry(err, attempt, retry, retryDelay, (nextAttempt) =>
                    request(payload, queryParams, nextAttempt)
                );
            }

            // Custom error handling
            if (typeof onError === 'function') {
                const customHandledError = onError(err)

                if (customHandledError) {
                    error.value = customHandledError
                    status.value = 'error'
                    data.value = null
                    return // Skip default error logic
                }
            }

            const responseData = err.response?.data || {}
            const statusCode = err.response?.status || 500;
            const redirectUrl = '';
            //auto  redirect errors
            if (redirectEnabled) {

                // const title = responseData?.responseData?.name || '';
                const title = responseData?.alertifyPayload?.message || '';
                const description =
                    statusCode === 500
                        ? responseData?.alertifyPayload?.message || '' // intentionally leave blank since fallback handled in error page
                        : responseData?.alertifyPayload?.message || ''

                if ([401, 403, 404, 500].includes(statusCode)) {
                    const { redirectOnError } = useErrorRedirect()
                    redirectOnError(statusCode, {
                        code: statusCode,
                        title,
                        description,
                        redirectUrl
                    })
                }
            }


            error.value = err.response?.data?.errorPayload?.errors || err.response?.data || [err.message]
            status.value = 'error'
            data.value = null
        } finally {
            progress.value = 0;
            progress.value = 0;
            if (typeof onComplete === 'function') {
                onComplete({ status: status.value, data: data.value, error: error.value })
            }
        }
    }

    // batch request method
    const batchRequest = async (
        requests = [],
        {
            failFast = false,
            enableCache = false,
            useAuth = true,
            onComplete = null,
            transform = null,
            autoAlert = true,
        } = {}
    ) => {
        status.value = 'loading'
        error.value = null
        data.value = []
        progress.value = 0

        controller = new AbortController()

        const axiosToUse = useAuth ? axiosInstance : axios
        const results = []

        for (let i = 0; i < requests.length; i++) {
            const req = requests[i]
            const config = buildBatchRequestConfig(req)
            const localTransform = req.transform ?? transform

            // Check for cached response first (for GET)
            const cachedData = getCache(config.url)
            if (enableCache && config.method === 'GET' && cachedData) {
                results.push({
                    success: true,
                    data: cachedData,
                    requestName: req.requestName || null,
                    cached: true,
                    progress: 100,
                })
                progress.value = Math.round(((i + 1) / requests.length) * 100)
                continue
            }

            try {
                const res = await axiosToUse(config)
                const transformed = localTransform ? localTransform(res.data) : res.data

                // Cache response if enabled
                if (enableCache && config.method === 'GET') {
                    setCache(config.url, transformed)
                }

                // Auto-alertify
                if (autoAlert && res.data?.alertifyPayload) {
                    const alertStore = useAlertStore()
                    alertStore.show(res.data.alertifyPayload)
                }

                results.push({
                    success: true,
                    data: transformed,
                    requestName: req.requestName || null,
                    progress: 100,
                })
            } catch (err) {
                const errorPayload =
                    err.response?.data?.errorPayload?.errors ||
                    err.response?.data ||
                    [err.message]

                results.push({
                    success: false,
                    error: errorPayload,
                    statusCode: err.response?.status,
                    requestName: req.requestName || null,
                    progress: 100,
                })

                if (failFast) break
            }

            progress.value = Math.round(((i + 1) / requests.length) * 100)
        }

        data.value = results
        status.value = 'success'
        lastFetched.value = new Date().toISOString()

        if (typeof onComplete === 'function') {
            onComplete({
                status: status.value,
                data: data.value,
                error: error.value,
            })
        }

        return results
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

    const clearAllCache = () => {
        cache.clear()
    }

    const clearCacheForKey = (key) => {
        cache.delete(key)
    }

    const listCacheKeys = () => {
        return Array.from(cache.keys())
    }

    const clearCacheMatching = (pattern) => {
        for (const key of cache.keys()) {
            if (
                (typeof pattern === 'string' && key.includes(pattern)) ||
                (pattern instanceof RegExp && pattern.test(key))
            ) {
                cache.delete(key)
            }
        }
    }




    const abort = () => {
        if (controller) {
            controller.abort()
            controller = null
            status.value = 'aborted'

            // Optional callback
            if (typeof onAbort === 'function') {
                onAbort()
            }
        }
    }


    // #############################
    // pagination methods

    const nextPage = async () => {
        if (!pagination || (totalItems.value && currentPage.value * perPage.value >= totalItems.value)) return;
        currentPage.value += 1;
        await request(null, {}, currentPage.value);
    };

    const prevPage = async () => {
        if (!pagination || currentPage.value <= 1) return;
        currentPage.value -= 1;
        await request(null, {}, currentPage.value);
    };

    const goToPage = async (page) => {
        if (!pagination || page < 1) return;
        currentPage.value = page;
        await request(null, {}, page);
    };
    const setPerPage = async (newPerPage) => {
        if (!pagination) return;
        perPage.value = newPerPage;
        currentPage.value = 1;
        await request(null, {}, currentPage.value);
    };
    // #############################


    return {
        data,
        error,
        status,
        lastFetched,
        request,
        batchRequest,
        refresh,
        clear,
        abort,
        clearAllCache,
        clearCacheForKey,
        listCacheKeys,
        clearCacheMatching,
        isOnline,
        isLoading: computed(() => status.value === 'loading'),
        isError: computed(() => status.value === 'error'),
        progress: computed(() => progress.value),
        realtime: realtime?.value || null,
        ...(pagination
            ? {
                currentPage,
                perPage,
                totalItems,
                nextPage,
                prevPage,
                goToPage,
                setPerPage,
                totalPages: computed(() => {
                    if (pagination) {
                        if (typeof transformPagination === 'function') {
                            return Math.ceil(totalItems.value / perPage.value)
                        }
                        return totalItems.value ? Math.ceil(totalItems.value / perPage.value) : null
                    }
                    return null
                }),
                // pages links:
                pages: computed(() => {
                    if (!totalItems.value) return []
                    const total = Math.ceil(totalItems.value / perPage.value)
                    return Array.from({ length: total }, (_, i) => i + 1)
                }),
            }
            : {})
    }
}
