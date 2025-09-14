import { ref } from 'vue'

// useLiveSync
export function useLiveSync({
    baseUrl,
    queryParams = {},
    requestId = 'default',
    transform = null,
    onMessage = null,
    onNotification = null,
    protocol = 'ws' // or 'sse'
}) {
    const connection = ref(null)
    const status = ref('idle')
    const messages = ref({})
    const errors = ref(null)

    const buildUrl = () => {
        const query = new URLSearchParams(queryParams).toString()
        return `${baseUrl}${query ? '?' + query : ''}`
    }

    const connect = () => {
        const url = buildUrl()
        status.value = 'connecting'

        if (protocol === 'ws') {
            const ws = new WebSocket(url)
            connection.value = ws

            ws.onopen = () => {
                status.value = 'connected'
            }

            ws.onmessage = (e) => {
                const raw = JSON.parse(e.data)
                const msg = transform ? transform(raw) : raw

                if (msg?.type === 'notification' && typeof onNotification === 'function') {
                    onNotification(msg)
                }

                messages.value[requestId] = msg
                if (onMessage) onMessage(msg)
            }

            ws.onerror = (e) => {
                errors.value = e
                status.value = 'error'
            }

            ws.onclose = () => {
                status.value = 'closed'
            }
        } else {
            const es = new EventSource(url)
            connection.value = es

            es.onopen = () => {
                status.value = 'connected'
            }

            es.onmessage = (e) => {
                const raw = JSON.parse(e.data)
                const msg = transform ? transform(raw) : raw

                if (msg?.type === 'notification' && typeof onNotification === 'function') {
                    onNotification(msg)
                }

                messages.value[requestId] = msg
                if (onMessage) onMessage(msg)
            }

            es.onerror = (e) => {
                errors.value = e
                status.value = 'error'
                es.close()
            }
        }
    }

    const disconnect = () => {
        if (connection.value) {
            connection.value.close?.()
            connection.value = null
        }
    }

    return {
        connect,
        disconnect,
        status,
        messages,
        errors
    }
}





