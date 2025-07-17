import { Tooltip } from 'bootstrap'

export default {
  install(app) {
    // Directive
    app.directive('tooltip', {
      mounted(el, binding) {
        new Tooltip(el, {
          title: binding.value,
          placement: binding.arg || 'top'
        })
      },
      beforeUnmount(el) {
        const tooltip = Tooltip.getInstance(el)
        if (tooltip) {
          tooltip.dispose()
        }
      }
    })

    // Global method
    app.config.globalProperties.$initTooltips = () => {
      document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
        new Tooltip(el)
      })
    }
  }
}