const layout = 'hopeui'
export default [
  {
    path: '/iam/rbac/roles/create',
    name: 'iam/rbac/roles/create',
    component: () => import('../views/Roles/create.vue'),
    meta: { title: 'Omniface - Create', layout: layout }
  },
  {
    path: '/iam/rbac/roles/view/:id',
    name: 'iam/rbac/roles/view',
    component: () => import('../views/Roles/view.vue'),
    props: true,
    meta: { title: 'Omniface - View', layout: layout }
  },
  {
    path: '/iam/rbac/roles/update/:id',
    name: 'iam/rbac/roles/update',
    component: () => import('../views/Roles/update.vue'),
    props: true,
    meta: { title: 'Omniface - Update', layout: layout }
  },
  {
    path: '/iam/rbac/roles',
    name: 'iam/rbac/roles',
    component: () => import('../views/Roles/index.vue'),
    meta: { title: 'Omniface - Index', layout: layout }
  }
];