const layout = 'hopeui'
export default [
  {
    path: '/iam/groups/create',
    name: 'iam/groups/create',
    component: () => import('../views/Groups/create.vue'),
    meta: { title: 'Omniface - Create', layout: layout }
  },
  {
    path: '/iam/groups/view/:id',
    name: 'iam/groups/view',
    component: () => import('../views/Groups/view.vue'),
    props: true,
    meta: { title: 'Omniface - View', layout: layout }
  },
  {
    path: '/iam/groups/update/:id',
    name: 'iam/groups/update',
    component: () => import('../views/Groups/update.vue'),
    props: true,
    meta: { title: 'Omniface - Update', layout: layout }
  },
  {
    path: '/iam/groups',
    name: 'iam/groups',
    component: () => import('../views/Groups/index.vue'),
    meta: { title: 'Omniface - Index', layout: layout }
  }
];