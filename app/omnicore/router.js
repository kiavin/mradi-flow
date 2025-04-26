import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '@/main/views/Index.vue'
import PlayGroundView from '@/main/views/PlayGround.vue'
import _404 from '@/main/views/_404.vue'
import moduleRoutes from './moduleRoutes.js';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingView,
      meta: { title: 'Omniface - Home', layout: 'main' },
    },
    {
      path: '/playground',
      name: 'playground',
      component: PlayGroundView,
      meta: { title: 'Omniface - PlayGround', layout: 'hopeui' },
    },

    // module generated routes
    ...moduleRoutes,
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: _404,
      meta: {
        layout: "AppLayoutError",
      },
    },
  ],
})

// router.beforeEach((to, from, next) => {
// document.title = to.meta.title || 'Omniface';
//   authMiddleware(to, from, next);
// });

export default router
