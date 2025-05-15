const layout = 'hopeui'
export default [
  {
    path: '/iam/changepassword/create',
    name: 'iam/changepassword/create',
    component: () => import('../views/ChangePassword/create.vue'),
    meta: { title: 'Omniface - Create', layout: layout }
  },
  {
    path: '/iam/changepassword/view/:id',
    name: 'iam/changepassword/view',
    component: () => import('../views/ChangePassword/view.vue'),
    props: true,
    meta: { title: 'Omniface - View', layout: layout }
  },
  {
    path: '/iam/changepassword/update/:id',
    name: 'iam/changepassword/update',
    component: () => import('../views/ChangePassword/update.vue'),
    props: true,
    meta: { title: 'Omniface - Update', layout: layout }
  },
  {
    path: '/iam/changepassword',
    name: 'iam/changepassword',
    component: () => import('../views/ChangePassword/index.vue'),
    meta: { title: 'Omniface - Index', layout: layout }
  }
];