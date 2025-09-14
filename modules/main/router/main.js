const layout = 'hopeui'
export default [
  {
    path: '/playground',
    name: 'playground',
    component: () => import('../views/PlayGround.vue'),
    meta: { title: 'Omniface - playground', layout: layout }
  },
  {
    path: '/main/dashboard',
    name: 'dashboard2',
    component: () => import('../views/Dashboard.vue'),
    meta: { title: 'Omniface - dashboard', layout: layout }
  }
];
