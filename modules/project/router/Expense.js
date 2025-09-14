const layout = 'hopeui'
export default [
  {
    path: '/project/expense/create',
    name: 'project/expense/create',
    component: () => import('../views/Expense/create.vue'),
    meta: { title: 'Omniface - Create', layout: layout }
  },
  {
    path: '/project/expense/view/:id',
    name: 'project/expense/view',
    component: () => import('../views/Expense/view.vue'),
    props: true,
    meta: { title: 'Omniface - View', layout: layout }
  },
  {
    path: '/project/expense/update/:id',
    name: 'project/expense/update',
    component: () => import('../views/Expense/update.vue'),
    props: true,
    meta: { title: 'Omniface - Update', layout: layout }
  },
  {
    path: '/project/expense',
    name: 'project/expense',
    component: () => import('../views/Expense/index.vue'),
    meta: { title: 'Omniface - Index', layout: layout }
  }
];
