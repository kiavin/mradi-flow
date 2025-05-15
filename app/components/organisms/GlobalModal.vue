<script setup>
import { defineProps } from 'vue'
import { useModalStore } from '~/omnicore/stores/modalStore.js'

const modalStore = useModalStore()

defineProps({
  title: String,
  showFooter: { type: Boolean, default: false },
})
</script>

<template>
  <Teleport to="body">
    <div v-if="modalStore.isOpen" class="modal fade show d-block" tabindex="-1" role="dialog">
      <div
        :class="[
          'modal-dialog',
          `modal-${modalStore.modalSize}`,
          modalStore.centered ? 'modal-dialog-centered' : '',
          modalStore.scrollable ? 'modal-dialog-scrollable' : '',
          modalStore.fullscreen ? 'modal-fullscreen' : '',
        ]"
        role="document"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title || modalStore.title }}</h5>
            <button type="button" class="btn-close" @click="modalStore.closeModal"></button>
          </div>
          <div class="modal-body">
            <component
              v-if="modalStore.component"
              :is="modalStore.component"
              v-bind="modalStore.props"
            />
            <slot v-else name="component">
              <p>demo Modal</p>
            </slot>
          </div>
          <!-- footer -->
          <div v-if="modalStore.showFooter || $slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="modalStore.isOpen" class="modal-backdrop fade show"></div>
  </Teleport>
</template>
