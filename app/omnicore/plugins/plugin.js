import { createPinia } from 'pinia'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import particles from 'vue3-particles'
// import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// import { faUser, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'
import sweetAlertPlugin from '~/omnicore/plugins/sweetAlertPlugin'
import fontawsome from './fontawsome'
import { showAlert, showToast } from '~/omnicore/utils'

// Add Font Awesome icons to the library
// library.add(faUser, faTrash, faEdit)

export default function registerPlugins(app) {
    app.use(createPinia())
    app.use(particles)
    app.use(sweetAlertPlugin)
    app.use(fontawsome)

    // Provide global methods
    app.provide('showAlert', showAlert)
    app.provide('showToast', showToast)

    // Register global components
    app.component('font-awesome-icon', FontAwesomeIcon)
}
