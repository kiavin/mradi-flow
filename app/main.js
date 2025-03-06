import { createApp } from 'vue'
import registerPlugins from './omnicore/plugins/plugin';
import App from './App.vue'
import router from './omnicore/router'
 

const app = createApp(App)

app.use(router)

registerPlugins(app)

app.mount('#app')
