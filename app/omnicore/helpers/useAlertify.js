import { showAlert, showToast } from '~/omnicore/utils'
import { showIziToast } from '../utils/iziToastUtil'

export function useAlertify() {
    const showAutoAlert = (alertPayload = {}) => {
        if (!alertPayload?.message) return

        const iconMap = {
            success: 'fas fa-check-circle',
            error: 'fas fa-times-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle',
        }


        const {
            type = 'alert',     // 'toast' or 'alert'
            theme,
            message = '',
            delay = 0,
            position = 'topRight',  // default toast position top-end
            ...rest
        } = alertPayload

        const fire = () => {
            const iconName = iconMap[theme] || 'info'
            const title = theme.charAt(0).toUpperCase() + theme.slice(1)
            if (type === 'toast') {
                // showToast({
                //     title: message,
                //     icon: theme,
                //     position,
                //     ...rest,
                // })

                showIziToast({
                    icon: 'fa fa-circle-check',
                    title: theme,
                    message: message,
                    // icon: iconMap[theme] || 'fas fa-info-circle',
                    color: '#ffffff',
                    backgroundColor: '#D1FADF',
                    position,
                    ...rest,
                })
            } else {
                showAlert({
                    title: theme,
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
