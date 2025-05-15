import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '@/main/views/Index.vue'
import _404 from '@/main/views/_404.vue'
import ErrorPage from '@/main/views/ErrorPage.vue';
import moduleRoutes from './moduleRoutes.js'
import authGuard from './middleware/authGuard.js';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
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
  document.title = to.meta.title || 'Omniface'
  authGuard(to, from, next)
})

export default router
