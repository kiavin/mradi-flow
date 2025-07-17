const layout = 'hopeui'
export default [
  {
    path: '/iam/users/create',
    name: 'iam/users/create',
    component: () => import('../views/UserSettings/create.vue'),
    meta: { title: 'Omniface - Create', layout: layout }
  },
  {
    path: '/iam/users/view/:id',
    name: 'iam/users/view',
    component: () => import('../views/UserSettings/view.vue'),
    props: true,
    meta: { title: 'Omniface - View', layout: layout }
  },
  {
    path: '/iam/users/update/:id',
    name: 'iam/users/update',
    component: () => import('../views/UserSettings/update.vue'),
    props: true,
    meta: { title: 'Omniface - Update', layout: layout }
  },
  {
    path: '/iam/users',
    name: 'iam/users',
    component: () => import('../views/UserSettings/index.vue'),
    meta: { title: 'Omniface - Index', layout: layout }
  }
];