<template>
  <div
    ref="circleRef"
    class="circle-progress-wrapper"
    :style="{
      width: `${diameter}px`,
      height: `${diameter}px`,
      position: 'relative',
    }"
  >
    <div
      class="circle-content"
      style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import CircleProgress from 'js-circle-progress'

// Props
const props = defineProps({
  value: { type: Number, default: 0 }, // percent (0–100)
  diameter: { type: Number, default: 120 },
  strokeWidth: { type: Number, default: 8 },
  color: { type: String, default: '#3a57e8' }, // filled ring color
  emptyColor: { type: String, default: '#e0e0e0' } // background ring color
})

const circleRef = ref(null)

const drawCircle = () => {
  if (!circleRef.value) return

  // Clear previous render
  circleRef.value.innerHTML = ''

  new CircleProgress(circleRef.value, {
    value: props.value / 100, // convert to decimal
    size: props.diameter,
    thickness: props.strokeWidth,
    fill: props.color,
    emptyFill: props.emptyColor,
    startAngle: -Math.PI / 2,
    animation: true,
  })
}

onMounted(drawCircle)
watch(() => props.value, drawCircle)
</script>
