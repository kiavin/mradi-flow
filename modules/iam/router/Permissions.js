const layout = 'hopeui'
export default [
  {
    path: '/iam/rbac/permissions/create',
    name: 'iam/rbac/permissions/create',
    component: () => import('../views/Permissions/create.vue'),
    meta: { title: 'Omniface - Create', layout: layout }
  },
  {
    path: '/iam/rbac/permissions/view/:id',
    name: 'iam/rbac/permissions/view',
    component: () => import('../views/Permissions/view.vue'),
    props: true,
    meta: { title: 'Omniface - View', layout: layout }
  },
  {
    path: '/iam/rbac/permissions/update/:id',
    name: 'iam/rbac/permissions/update',
    component: () => import('../views/Permissions/update.vue'),
    props: true,
    meta: { title: 'Omniface - Update', layout: layout }
  },
  {
    path: '/iam/rbac/permissions',
    name: 'iam/rbac/permissions',
    component: () => import('../views/Permissions/index.vue'),
    meta: { title: 'Omniface - Index', layout: layout }
  }
];