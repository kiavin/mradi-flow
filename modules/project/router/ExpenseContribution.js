const layout = 'hopeui'
export default [
  {
    path: '/project/expensecontribution/create',
    name: 'project/expensecontribution/create',
    component: () => import('../views/ExpenseContribution/create.vue'),
    meta: { title: 'Omniface - Create', layout: layout }
  },
  {
    path: '/project/expensecontribution/view/:id',
    name: 'project/expensecontribution/view',
    component: () => import('../views/ExpenseContribution/view.vue'),
    props: true,
    meta: { title: 'Omniface - View', layout: layout }
  },
  {
    path: '/project/expensecontribution/update/:id',
    name: 'project/expensecontribution/update',
    component: () => import('../views/ExpenseContribution/update.vue'),
    props: true,
    meta: { title: 'Omniface - Update', layout: layout }
  },
  {
    path: '/project/expensecontribution',
    name: 'project/expensecontribution',
    component: () => import('../views/ExpenseContribution/index.vue'),
    meta: { title: 'Omniface - Index', layout: layout }
  }
];