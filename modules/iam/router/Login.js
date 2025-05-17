const layout = 'hopeui'
export default [
  {
    path: '/iam/auth/login',
    name: 'iam/auth/login',
    component: () => import('../views/Login/index.vue'),
    meta: { title: 'Omniface - Create', layout: 'none' }
  },
   
];