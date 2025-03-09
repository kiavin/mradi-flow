import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '@/main/views/Index.vue'
import PlayGroundView from '@/main/views/PlayGround.vue'
import moduleRoutes from './generatedRoutes.js';
import View from '@/main/views/View.vue'
// import Sc from '@/scheduler/router/index.js'


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
      path: '/play',
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
    // ...Sc,
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
