const layout = 'none'
export default [
  {
    path: '/iam/reset-password',
    name: 'iam/reset-password',
    component: () => import('../views/ResetPassword/index.vue'),
    meta: { title: 'Omniface - Create', layout: layout }
  },
];