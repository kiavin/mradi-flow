const layout = 'hopeui'
export default [
  {
    path: '/playground',
    name: 'playground',
    component: () => import('../views/PlayGround.vue'),
    meta: { title: 'Omniface - Index', layout: layout }
  }
];