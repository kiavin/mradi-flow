const layout = 'hopeui'
export default [
  {
    path: '/iam/rbac/groups/create',
    name: 'iam/rbac/groups/create',
    component: () => import('../views/Groups/create.vue'),
    meta: { title: 'Omniface - Create', layout: layout }
  },
  {
    path: '/iam/rbac/groups/view/:id',
    name: 'iam/rbac/groups/view',
    component: () => import('../views/Groups/view.vue'),
    props: true,
    meta: { title: 'Omniface - View', layout: layout }
  },
  {
    path: '/iam/rbac/groups/update/:id',
    name: 'iam/rbac/groups/update',
    component: () => import('../views/Groups/update.vue'),
    props: true,
    meta: { title: 'Omniface - Update', layout: layout }
  },
  {
    path: '/iam/rbac/groups',
    name: 'iam/rbac/groups',
    component: () => import('../views/Groups/index.vue'),
    meta: { title: 'Omniface - Index', layout: layout }
  }
];