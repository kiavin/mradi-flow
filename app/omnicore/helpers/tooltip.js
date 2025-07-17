import { Tooltip } from 'bootstrap'

export default {
  mounted(el, binding) {
    const placement = binding.arg || 'top'
    const title = binding.value || el.getAttribute('data-bs-title')
    
    new Tooltip(el, {
      title,
      placement,
      trigger: 'hover'
    })
  },
  
  beforeUnmount(el) {
    const tooltip = Tooltip.getInstance(el)
    if (tooltip) {
      tooltip.dispose()
    }
  }
}