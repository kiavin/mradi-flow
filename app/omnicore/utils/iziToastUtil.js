// ~/omnicore/utils/iziToastUtil.ts
import iziToast from 'izitoast'

/** Global Default Settings **/
iziToast.settings({
    timeout: 7000,
    resetOnHover: true,
    icon: 'fontawesome',
    transitionIn: 'flipInX',
    transitionOut: 'flipOutX',
    position: 'topRight',
    onOpening: () => console.log('Toast opening...'),
    onClosing: () => console.log('Toast closing...'),
})

/** Default Toast Options **/
const defaultOptions = {
    position: 'topRight',
    timeout: 5000,
    close: true,
    progressBar: true,
    transitionIn: 'fadeInUp',
    transitionOut: 'fadeOut',
    layout: 1,
    balloon: false,
    drag: true,
    pauseOnHover: true,
    animateInside: true,
}

/**
 * Shows an iziToast message with default options,
 * allowing overrides via payload.
 *
 * @param {Object} options - iziToast config overrides
 */
export function showIziToast(options = {}) {
    iziToast.show({
        ...defaultOptions,
        ...options,
    })
}

/** Convenience Shortcuts */
export function showSuccess(message, title = 'Success') {
    showIziToast({ color: '#D1FADF', title, message, icon: 'check_circle' })
}

export function showError(message, title = 'Error') {
    showIziToast({ color: 'red', title, message, icon: 'error' })
}

export function showWarning(message, title = 'Warning') {
    showIziToast({ color: 'orange', title, message, icon: 'warning' })
}

export function showInfo(message, title = 'Info') {
    showIziToast({ color: 'blue', title, message, icon: 'info' })
}

/** Custom Toast with Image (Avatar, Icons, etc.) */
export function showImageToast({ title, message, imageUrl }) {
    showIziToast({
        title,
        message,
        image: imageUrl,
        imageWidth: 50,
        color: 'light',
        timeout: 10000,
    })
}

/** Yes/No Confirmation (Question Dialog) */
export function showConfirm({ title = 'Confirm', message = 'Are you sure?', onYes, onNo }) {
    iziToast.question({
        timeout: 20000,
        close: false,
        overlay: true,
        displayMode: 'once',
        id: 'questionToast',
        zindex: 999,
        title,
        message,
        position: 'center',
        buttons: [
            [
                '<button><b>YES</b></button>',
                function (instance, toast) {
                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button')
                    if (typeof onYes === 'function') onYes()
                },
                true
            ],
            [
                '<button>NO</button>',
                function (instance, toast) {
                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button')
                    if (typeof onNo === 'function') onNo()
                }
            ],
        ],
        onClosing: function (instance, toast, closedBy) {
            console.info('Confirm toast closing | closedBy:', closedBy)
        },
        onClosed: function (instance, toast, closedBy) {
            console.info('Confirm toast closed | closedBy:', closedBy)
        },
    })
}

/** Manual Destroy (Remove All Toasts) */
export function destroyToasts() {
    iziToast.destroy()
}
