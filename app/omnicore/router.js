import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '@/main/views/Index.vue'
import _404 from '@/main/views/_404.vue'
import ErrorPage from '@/main/views/ErrorPage.vue';
import moduleRoutes from './moduleRoutes.js'
import authGuard from './middleware/authGuard.js';

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL || '/'),
  routes: [
    {
      path: '/welcome',
      name: 'home',
      component: LandingView,
      meta: { title: 'Omniface - Home', layout: 'main' },
    },

    // module generated routes
    ...moduleRoutes,
    {
      path: '/ErrorPage',
      name: 'error-page',
      component: ErrorPage,
      meta: { title: 'Omniface-ErrorPage', layout: 'none' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: _404,
      meta: {
        layout: 'AppLayoutError',
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Mradi360'
  authGuard(to, from, next)
})

router.afterEach((to) => {
  const APP_NAME = import.meta.env.VITE_APP_NAME || 'Mradi360';
  if (to.meta?.title) {
    document.title = to.meta.title.replace('Omniface', APP_NAME);
  }
})

export default router
