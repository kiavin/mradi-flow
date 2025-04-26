import HeaderComponent from '~/themes/hopeui/components/molecules/partials/HeaderComponent.vue'
import MainContentComponent from '~/themes/hopeui/components/molecules/partials/MainContentComponent.vue'
import SidebarComponent from '~/themes/hopeui/components/molecules/partials/SidebarComponent.vue'
import FooterComponent from '~/themes/hopeui/components/molecules/partials/FooterComponent.vue'
import SubHeader from '~/themes/hopeui/components/molecules/SubHeaderComponent.vue'

export default class HopeUiAssets {

    static assets = [
        () => import('../hopeui/assets/css/demo.css'),
    ]

    static styleRefs = []

    static components = {
        HeaderComponent,
        MainContentComponent,
        SidebarComponent,
        FooterComponent,
        SubHeader
    }

    static async register() {
        this.styleRefs = await Promise.all(this.assets.map(fn => fn()))
        return this
    }

    static cleanup() {
        const styles = document.querySelectorAll('style');
        styles.forEach(style => {
          if (this.styleRefs.some(ref => style.textContent?.includes(ref.default))) {
            style.remove()
          }
        })
      }

    static getComponents() {
        return this.components
    }

}