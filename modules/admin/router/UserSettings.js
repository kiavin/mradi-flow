const layout = 'hopeui'
export default [
  {
    path: '/admin/usersettings/create',
    name: 'admin/usersettings/create',
    component: () => import('../views/UserSettings/create.vue'),
    meta: { title: 'Omniface - Create', layout: layout }
  },
  {
    path: '/admin/usersettings/view/:id',
    name: 'admin/usersettings/view',
    component: () => import('../views/UserSettings/view.vue'),
    props: true,
    meta: { title: 'Omniface - View', layout: layout }
  },
  {
    path: '/admin/usersettings/update/:id',
    name: 'admin/usersettings/update',
    component: () => import('../views/UserSettings/update.vue'),
    props: true,
    meta: { title: 'Omniface - Update', layout: layout }
  },
  {
    path: '/admin/usersettings',
    name: 'admin/usersettings',
    component: () => import('../views/UserSettings/index.vue'),
    meta: { title: 'Omniface - Index', layout: layout }
  }
];