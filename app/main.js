import { createApp } from 'vue'
import { createPinia } from 'pinia'
import registerPlugins from './omnicore/plugins/plugin'
import App from './App.vue'
import '@vueform/multiselect/themes/default.css'
import CircleProgress from 'vue3-circle-progress'

import router from './omnicore/router'
import VueApexCharts from 'vue3-apexcharts'

const app = createApp(App)
const pinia = createPinia()
app.use(VueApexCharts)
app.component('apexchart', VueApexCharts)
app.use(CircleProgress)

app.use(pinia)

app.use(router)

registerPlugins(app)

app.mount('#app')
