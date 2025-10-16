const layout = 'hopeui'
export default [
  {
    path: '/project/projectexpense/create',
    name: 'project/projectexpense/create',
    component: () => import('../views/ProjectExpense/create.vue'),
    meta: { title: 'Omniface - Create', layout: layout }
  },
  {
    path: '/project/projectexpense/view/:id',
    name: 'project/projectexpense/view',
    component: () => import('../views/ProjectExpense/view.vue'),
    props: true,
    meta: { title: 'Omniface - View', layout: layout }
  },
  {
    path: '/project/projectexpense/update/:id',
    name: 'project/projectexpense/update',
    component: () => import('../views/ProjectExpense/update.vue'),
    props: true,
    meta: { title: 'Omniface - Update', layout: layout }
  },
  {
    path: '/project/projectexpense',
    name: 'project/projectexpense',
    component: () => import('../views/ProjectExpense/index.vue'),
    meta: { title: 'Omniface - Index', layout: layout }
  }
];