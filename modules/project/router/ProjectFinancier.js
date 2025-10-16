const layout = 'hopeui'
export default [
  {
    path: '/project/projectfinancier/create',
    name: 'project/projectfinancier/create',
    component: () => import('../views/ProjectFinancier/create.vue'),
    meta: { title: 'Omniface - Create', layout: layout }
  },
  {
    path: '/project/projectfinancier/view/:id',
    name: 'project/projectfinancier/view',
    component: () => import('../views/ProjectFinancier/view.vue'),
    props: true,
    meta: { title: 'Omniface - View', layout: layout }
  },
  {
    path: '/project/projectfinancier/update/:id',
    name: 'project/projectfinancier/update',
    component: () => import('../views/ProjectFinancier/update.vue'),
    props: true,
    meta: { title: 'Omniface - Update', layout: layout }
  },
  {
    path: '/project/projectfinancier',
    name: 'project/projectfinancier',
    component: () => import('../views/ProjectFinancier/index.vue'),
    meta: { title: 'Omniface - Index', layout: layout }
  }
];