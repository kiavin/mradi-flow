import Footer from '../components/organisms/Footer.vue'
import Header from '@/main/components/organisms/Header.vue';
import Hero from '@/main/components/organisms/Hero.vue'
import Features from '@/main/components/organisms/Features.vue'
import Features2 from '@/main/components/organisms/Features2.vue'
import Features3 from '@/main/components/organisms/Features3.vue'
import Warpcard from '../components/molecules/Warpcard.vue'

export default class MainAssets {

    static assets = [
        () => import('../assets/style.css'),
    ]

    static styleRefs = []

    static components = {
        Header,
        Footer,
        Hero,
        Features,
        Features2,
        Features3,
        Warpcard
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