const layout = 'hopeui'
export default [
  {
    path: '/project/financier/create',
    name: 'project/financier/create',
    component: () => import('../views/Financier/create.vue'),
    meta: { title: 'Omniface - Create', layout: layout }
  },
  {
    path: '/project/financier/view/:id',
    name: 'project/financier/view',
    component: () => import('../views/Financier/view.vue'),
    props: true,
    meta: { title: 'Omniface - View', layout: layout }
  },
  {
    path: '/project/financier/update/:id',
    name: 'project/financier/update',
    component: () => import('../views/Financier/update.vue'),
    props: true,
    meta: { title: 'Omniface - Update', layout: layout }
  },
  {
    path: '/project/financier',
    name: 'project/financier',
    component: () => import('../views/Financier/index.vue'),
    meta: { title: 'Omniface - Index', layout: layout }
  }
];