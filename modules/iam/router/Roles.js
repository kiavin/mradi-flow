const layout = 'hopeui'
export default [
  {
    path: '/iam/roles/create',
    name: 'iam/roles/create',
    component: () => import('../views/Roles/create.vue'),
    meta: { title: 'Omniface - Create', layout: layout }
  },
  {
    path: '/iam/roles/view/:id',
    name: 'iam/roles/view',
    component: () => import('../views/Roles/view.vue'),
    props: true,
    meta: { title: 'Omniface - View', layout: layout }
  },
  {
    path: '/iam/roles/update/:id',
    name: 'iam/roles/update',
    component: () => import('../views/Roles/update.vue'),
    props: true,
    meta: { title: 'Omniface - Update', layout: layout }
  },
  {
    path: '/iam/roles',
    name: 'iam/roles',
    component: () => import('../views/Roles/index.vue'),
    meta: { title: 'Omniface - Index', layout: layout }
  }
];