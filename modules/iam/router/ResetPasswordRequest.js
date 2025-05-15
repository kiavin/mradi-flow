const layout = 'none'
export default [
  {
    path: '/iam/resetpasswordrequest/index',
    name: 'iam/resetpasswordrequest/index',
    component: () => import('../views/ResetPasswordRequest/index.vue'),
    meta: { title: 'Omniface - Create', layout: layout }
  },
];