import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
// import tooltip from '~/omnicore/helpers/tooltip.js'
import BootstrapTooltips from '~/omnicore/plugins/bootstrap-tooltip.js'
import notificationPlugin from './notificationPlugin'

// izzi toast css

import 'izitoast/dist/css/iziToast.min.css';




import sweetAlertPlugin from '~/omnicore/plugins/sweetAlertPlugin'
import { showAlert, showToast } from '~/omnicore/utils'
import BootstrapVueNext from 'bootstrap-vue-next'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas)

// registering globaly omnigrid view registering globaly
import OmniGridView from '~/components/OmniGridView.vue'
import Logo from '~/components/molecules/Logo.vue'


// ts perticles config
import Particles from "@tsparticles/vue3";
//import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "@tsparticles/slim";
import { useNotificationStore } from '../stores/notificationStore'
import pinia from './pinia'

export default function registerPlugins(app) {
    app.use(sweetAlertPlugin)
    app.use(BootstrapVueNext)

    // ts particles
    app.use(Particles, {
        init: async engine => {
            // await loadFull(engine); // you can load the full tsParticles library from "tsparticles" if you need it
            await loadSlim(engine); // or you can load the slim version from "@tsparticles/slim" if don't need Shapes or Animations
        },
    })

    // notification plugin
    // app.use(notificationPlugin, {
    //     websocketUrl: 'ws://localhost:3000/notifications',
    //     useRealTime: true,
    //     useBrowserNotifications: true,
    //     autoClearAfter: 10 * 60 * 1000, // 10 minutes
    //     store: useNotificationStore()
    // })

    // app.directive('tooltip', tooltip)
    app.use(BootstrapTooltips)

    // Provide global methods
    app.provide('showAlert', showAlert)
    app.provide('showToast', showToast)

    // Register global components
    app.component('font-awesome-icon', FontAwesomeIcon)
    app.component('OmniGridView', OmniGridView)
    app.component('Logo', Logo)

}
