<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const commands = ref([
  'Initializing Omnibase Framework...',
  'Fetching module data...',
  'Generating components...',
  'Compiling assets...',
  'Done! 🚀',
])

const typedText = ref('')
let commandIndex = 0

const typeCommand = () => {
  if (commandIndex >= commands.value.length) return

  let command = commands.value[commandIndex]
  let charIndex = 0

  const typingInterval = setInterval(() => {
    if (charIndex < command.length) {
      typedText.value += command[charIndex]
      charIndex++
    } else {
      clearInterval(typingInterval)
      typedText.value += '\n' // New line
      commandIndex++
      setTimeout(typeCommand, 800) // Next command
    }
  }, 50)
}

onMounted(() => {
  typeCommand()
})
</script>
<template>
  <div class="czi3f" data-aos="fade-down">
    <div
      class="c834w c2dmz cgj2h cj3ir ce8dy cck46 c82g2 csey4 cjvxe cjijg crcid ccdmz c40tf csdod coafw ckogm cpspx ca3hu cxmgp c3stx cvgwp ct4qk cvu3y cmgcy czde0 c45mq cww8d cnhmh c4lt2 crsge c2zs5"
    >
      <div class="cgq9w cxmgp cp877 c4lt2 crsge cdmuy">
        <div class="c1yms ccgia cre2l cg9hr citnk terminal">
          <pre>{{ typedText }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.terminal {
  background: rgba(0, 0, 0, 0.8);
  color: green;
  font-family: 'Courier New', monospace;
  padding: 20px;
  border-radius: 8px;
  /* width: 500px; */
  height: 250px;
  overflow-y: auto;
  box-shadow: 0px 0px 10px rgba(0, 255, 204, 0.6);
}
</style>