import { createApp } from 'vue';
import { createPinia } from 'pinia';
import registerPlugins from './omnicore/plugins/plugin';
import App from './App.vue';

import router from './omnicore/router';

const app = createApp(App);
const pinia = createPinia()

app.use(pinia)

app.use(router)

registerPlugins(app)

app.mount('#app')
