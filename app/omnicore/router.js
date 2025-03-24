import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '@/main/views/Index.vue'
import PlayGroundView from '@/main/views/PlayGround.vue'
import moduleRoutes from './moduleRoutes.js';
import View from '@/main/views/View.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingView,
      meta: { title: 'Omniface - Home' },
    },
    {
      path: '/playground',
      name: 'playground',
      component: PlayGroundView,
      meta: { title: 'Omniface - Home', layout: 'default' },
    },
    {
      path: '/view-demo/:id',
      name: 'view',
      component: View,
      meta: { title: 'Omniface - Home' },
      props: true
    },
    ...moduleRoutes,
    // {
    //   path: "/:pathMatch(.*)*",
    //   name: "NotFound",
    //   component: NotFoundView,
    //   meta: {
    //     layout: "AppLayoutError",
    //   },
    // },
  ],
})

// router.beforeEach((to, from, next) => {
// document.title = to.meta.title || 'Omniface';
//   authMiddleware(to, from, next);
// });

export default router
