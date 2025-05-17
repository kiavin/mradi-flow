const layout = 'hopeui'
export default [
  {
    path: '/iam/changepassword/index',
    name: 'iam/changepassword/index',
    component: () => import('../views/ChangePassword/create.vue'),
    meta: { title: 'Mradi360', layout: layout }
  },
];