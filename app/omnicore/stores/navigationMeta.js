import { defineStore } from 'pinia'
import { ref, toRaw, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

export const useNavigationMetaStore = defineStore('navigationMeta', () => {
    const meta = ref({})
    const expiryMap = ref({})
    const flashKeys = ref(new Set())
    const subscribers = ref({})

    function setMeta(key, value, options = {}) {
        meta.value[key] = value

        // Flash keys: removed on route change or after get
        if (options.flash) {
            flashKeys.value.add(key)
        }

        // TTL
        if (options.ttl) {
            const expiry = Date.now() + options.ttl
            expiryMap.value[key] = expiry

            setTimeout(() => {
                if (Date.now() >= expiryMap.value[key]) {
                    delete meta.value[key]
                    delete expiryMap.value[key]
                    flashKeys.value.delete(key)
                }
            }, options.ttl)
        }

        notifySubscribers(key, value)
    }

    function getMeta(key, { removeFlash = true } = {}) {
        const value = meta.value[key]

        if (flashKeys.value.has(key) && removeFlash) {
            delete meta.value[key]
            flashKeys.value.delete(key)
            delete expiryMap.value[key]
        }

        return value
    }

    function namespacedSet(namespace, key, value, options = {}) {
        setMeta(`${namespace}:${key}`, value, options)
    }

    function hasMeta(key) {
        return key in meta.value
    }

    function getAll() {
        return toRaw(meta.value)
    }

    function subscribeToMetaChanges(key, callback) {
        if (!subscribers.value[key]) {
            subscribers.value[key] = []
        }
        subscribers.value[key].push(callback)
    }

    function notifySubscribers(key, value) {
        if (subscribers.value[key]) {
            subscribers.value[key].forEach(cb => cb(value))
        }
    }

    function clearMeta(key) {
        if (key) {
            delete meta.value[key]
            delete expiryMap.value[key]
            flashKeys.value.delete(key)
        } else {
            meta.value = {}
            expiryMap.value = {}
            flashKeys.value.clear()
        }
    }

    function clearFlashOnRouteChange() {
        const route = useRoute()
        watchEffect(() => {
            flashKeys.value.forEach(key => {
                delete meta.value[key]
                delete expiryMap.value[key]
            })
            flashKeys.value.clear()
        })
    }

    return {
        meta,
        setMeta,
        getMeta,
        namespacedSet,
        hasMeta,
        getAll,
        clearMeta,
        subscribeToMetaChanges,
        clearFlashOnRouteChange
    }
})
