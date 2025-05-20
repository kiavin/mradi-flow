const layout = 'hopeui'
export default [
  {
    path: '/admin/mailsettings/create',
    name: 'admin/mailsettings/create',
    component: () => import('../views/MailSettings/create.vue'),
    meta: { title: 'Omniface - Create', layout: layout }
  },
  {
    path: '/admin/mailsettings/view/:id',
    name: 'admin/mailsettings/view',
    component: () => import('../views/MailSettings/view.vue'),
    props: true,
    meta: { title: 'Omniface - View', layout: layout }
  },
  {
    path: '/admin/mailsettings/update/:id',
    name: 'admin/mailsettings/update',
    component: () => import('../views/MailSettings/update.vue'),
    props: true,
    meta: { title: 'Omniface - Update', layout: layout }
  },
  
];