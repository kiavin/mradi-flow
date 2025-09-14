const layout = 'hopeui'
export default [

  {
    path: '/',
    name: 'dashboard',
    component: () => import('../views/Dashboard/index.vue'),
    meta: { title: 'Omniface - Index', layout: layout }
  },
  {
    path: '/project/one',
    name: 'projectDashboard',
    component: () => import('../views/Dashboard/projectdash.vue'),
    meta: { title: 'Omniface - Index', layout: layout }
  }
];
