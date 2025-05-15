const layout = 'hopeui'
export default [
  {
    path: '/iam/permissions/create',
    name: 'iam/permissions/create',
    component: () => import('../views/Permissions/create.vue'),
    meta: { title: 'Omniface - Create', layout: layout }
  },
  {
    path: '/iam/permissions/view/:id',
    name: 'iam/permissions/view',
    component: () => import('../views/Permissions/view.vue'),
    props: true,
    meta: { title: 'Omniface - View', layout: layout }
  },
  {
    path: '/iam/permissions/update/:id',
    name: 'iam/permissions/update',
    component: () => import('../views/Permissions/update.vue'),
    props: true,
    meta: { title: 'Omniface - Update', layout: layout }
  },
  {
    path: '/iam/permissions',
    name: 'iam/permissions',
    component: () => import('../views/Permissions/index.vue'),
    meta: { title: 'Omniface - Index', layout: layout }
  }
];