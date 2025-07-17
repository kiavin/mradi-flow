const layout = 'hopeui'
export default [
  {
    path: '/iam/changepassword',
    name: 'iam/changepassword',
    component: () => import('../views/ChangePassword/create.vue'),
    meta: { title: 'Mradi360', layout: layout }
  },
];