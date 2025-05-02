import { createPinia } from 'pinia'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

import sweetAlertPlugin from '~/omnicore/plugins/sweetAlertPlugin'
import { showAlert, showToast } from '~/omnicore/utils'
import BootstrapVueNext from 'bootstrap-vue-next'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas)

// omnigrid view registering globaly
import OmniGridView from '~/themes/hopeui/components/organisms/OmniGridView.vue'

export default function registerPlugins(app) {
    app.use(createPinia())
    app.use(sweetAlertPlugin)
    app.use(BootstrapVueNext)

    // Provide global methods
    app.provide('showAlert', showAlert)
    app.provide('showToast', showToast)

    // Register global components
    app.component('font-awesome-icon', FontAwesomeIcon)
    app.component('OmniGridView', OmniGridView)
}
