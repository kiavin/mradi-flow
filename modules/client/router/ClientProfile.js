const layout = 'hopeui'
export default [
  {
    path: '/iam/clientprofile/create',
    name: 'iam/clientprofile/create',
    component: () => import('../views/ClientProfile/create.vue'),
    meta: { title: 'Omniface - Create', layout: layout }
  },
  {
    path: '/iam/clientprofile/view/:id',
    name: 'iam/clientprofile/view',
    component: () => import('../views/ClientProfile/view.vue'),
    props: true,
    meta: { title: 'Omniface - View', layout: layout }
  },
  {
    path: '/iam/clientprofile/update/:id',
    name: 'iam/clientprofile/update',
    component: () => import('../views/ClientProfile/update.vue'),
    props: true,
    meta: { title: 'Omniface - Update', layout: layout }
  },
  {
    path: '/iam/clientprofile',
    name: 'iam/clientprofile',
    component: () => import('../views/ClientProfile/index.vue'),
    meta: { title: 'Omniface - Index', layout: layout }
  }
];