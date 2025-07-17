const layout = 'hopeui'
export default [
  {
    path: '/admin/profile/create',
    name: 'admin/profile/create',
    component: () => import('../views/Profile/create.vue'),
    meta: { title: 'Omniface - Create', layout: layout }
  },
  {
    path: '/admin/profile/view/:id',
    name: 'admin/profile/view',
    component: () => import('../views/Profile/view.vue'),
    props: true,
    meta: { title: 'Omniface - View', layout: layout }
  },
  {
    path: '/admin/profile/update/:id',
    name: 'admin/profile/update',
    component: () => import('../views/Profile/update.vue'),
    props: true,
    meta: { title: 'Omniface - Update', layout: layout }
  },
  {
    path: '/admin/profile',
    name: 'admin/profile',
    component: () => import('../views/Profile/index.vue'),
    meta: { title: 'Omniface - Index', layout: layout }
  }
];