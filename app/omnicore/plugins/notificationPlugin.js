// /plugins/notificationPlugin.js
export default {
    install(app, options = {}) {
        const {
            websocketUrl = 'ws://localhost:3000/notifications',
            useBrowserNotifications = true,
            useRealTime = true,
            autoClearAfter = 10 * 60 * 1000 // 10 minutes
        } = options

        const store = options.store

        if (!store) {
            console.warn('Notification store is required for notificationPlugin.')
            return
        }

        let socket = null

        if (useRealTime) {
            socket = new WebSocket(websocketUrl)

            socket.onmessage = (event) => {
                const data = JSON.parse(event.data)

                const notification = {
                    id: Date.now(),
                    title: data.title || 'New Notification',
                    message: data.message,
                    type: data.type || 'info',
                    timestamp: new Date()
                }

                store.pushNotification(notification)

                if (useBrowserNotifications && Notification.permission === 'granted') {
                    new Notification(notification.title, {
                        body: notification.message
                    })
                }
            }

            socket.onclose = () => {
                store.pushNotification({
                    id: Date.now(),
                    title: 'Disconnected',
                    message: 'Lost connection to notification server.',
                    type: 'warning',
                    timestamp: new Date()
                })
            }
        }

        // Periodically auto-clear old notifications
        setInterval(() => {
            const now = Date.now()
            store.clearOldNotifications(now - autoClearAfter)
        }, 60 * 1000) // Check every minute

        // Expose controls via global properties
        app.config.globalProperties.$notificationSocket = socket
        app.config.globalProperties.$notificationOptions = {
            useRealTime,
            useBrowserNotifications,
            autoClearAfter
        }
    }
}
