import '~/themes/hopeui/assets/main.css'
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './omnicore/router'
import { showAlert, showToast } from '~/omnicore/utils'
import sweetAlertPlugin from '~/omnicore/plugins/sweetAlertPlugin'


const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(sweetAlertPlugin)
app.provide('showAlert', showAlert)
app.provide('showToast', showToast)

app.mount('#app')
