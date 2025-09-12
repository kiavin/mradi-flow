// ~/omnicore/stores/notificationStore.js
import { defineStore } from 'pinia'
import { showSuccess, showError, showInfo, showWarning } from '~/omnicore/utils/iziToastUtil'

export const useNotificationStore = defineStore('notificationStore', {
    state: () => ({
        notifications: [], // For history if you want
        isOnline: navigator.onLine,
        muted: false, // to silence notifications
    }),

    actions: {
        pushNotification({ message, title = 'Notice', type = 'info', persist = false }) {
            const notification = {
                id: Date.now(),
                message,
                title,
                type,
                timestamp: new Date(),
            }

            // Store in list (optional for UI tab)
            if (persist) this.notifications.unshift(notification)

            // Skip toast if muted
            if (this.muted) return

            // Display toast
            switch (type) {
                case 'success':
                    showSuccess(message, title)
                    break
                case 'error':
                    showError(message, title)
                    break
                case 'warning':
                    showWarning(message, title)
                    break
                default:
                    showInfo(message, title)
            }
        },

        // Triggered on internet disconnect
        handleOffline() {
            this.isOnline = false
            this.pushNotification({
                title: 'Connection Lost',
                message: 'You are offline. Some features may not work.',
                type: 'warning',
            })
        },

        // Triggered on internet reconnect
        handleOnline() {
            this.isOnline = true
            this.pushNotification({
                title: 'Back Online',
                message: 'Your internet connection is restored.',
                type: 'success',
            })
        },

        toggleMute() {
            this.muted = !this.muted
        },
    },
})


// const notify = useNotificationStore()
// notify.pushNotification({
//   title: 'Saved!',
//   message: 'Your data was saved successfully.',
//   type: 'success',
//   persist: true
// })
