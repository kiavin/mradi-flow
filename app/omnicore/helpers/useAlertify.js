import { showAlert, showToast } from '~/omnicore/utils'

export function useAlertify() {
    const showAutoAlert = (alertPayload = {}) => {
        if (!alertPayload?.message) return

        const {
            type = 'alert',     // 'toast' or 'alert'
            theme = 'info',
            message = '',
            delay = 0,
            position = 'top-end',  // default toast position
            ...rest
        } = alertPayload

        const fire = () => {
            if (type === 'toast') {
                showToast({
                    title: message,
                    icon: theme,
                    position,
                    ...rest,
                })
            } else {
                showAlert({
                    title: 'Notification',
                    text: message,
                    icon: theme,
                    showCancelButton: false,
                    ...rest,
                })
            }
        }

        delay ? setTimeout(fire, delay) : fire()
    }

    return { showAutoAlert }
}
