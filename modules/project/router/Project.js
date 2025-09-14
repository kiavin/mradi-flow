const layout = 'hopeui'
export default [
  {
    path: '/project/project/create',
    name: 'project/project/create',
    component: () => import('../views/Project/create.vue'),
    meta: { title: 'Omniface - Create', layout: layout }
  },
  {
    path: '/project/project/view/:id',
    name: 'project/project/view',
    component: () => import('../views/Project/view.vue'),
    props: true,
    meta: { title: 'Omniface - View', layout: layout }
  },
  {
    path: '/project/project/update/:id',
    name: 'project/project/update',
    component: () => import('../views/Project/update.vue'),
    props: true,
    meta: { title: 'Omniface - Update', layout: layout }
  },
  {
    path: '/project/project',
    name: 'project/project',
    component: () => import('../views/Project/index.vue'),
    meta: { title: 'Omniface - Index', layout: layout }
  }
];