// stores/alert.js or .ts
import { defineStore } from 'pinia'
import { useAlertify } from '~/omnicore/helpers/useAlertify.js'

export const useAlertStore = defineStore('alert', {
    state: () => ({
        suppressAutoAlerts: false,
    }),
    actions: {
        show(payload = {}) {
            if (this.suppressAutoAlerts) return

            const { showAutoAlert } = useAlertify()

            // Automatically extract nested alertifyPayload
            const finalPayload = payload?.alertifyPayload || payload

            showAutoAlert(finalPayload)
        },
    },
})
