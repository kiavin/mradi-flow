const layout = 'hopeui'
const name = 'mradi360'

export default [
  {
    path: '/iam/country/create',
    name: 'iam/country/create',
    component: () => import('../views/Metadata/Country/create.vue'),
    meta: { title: `${name} - Create`, layout: layout }
  },
  {
    path: '/iam/country/view/:id',
    name: 'iam/country/view',
    component: () => import('../views/Metadata/Country/view.vue'),
    props: true,
    meta: { title: `${name} - View`, layout: layout }
  },
  {
    path: '/iam/country/update/:id',
    name: 'iam/country/update',
    component: () => import('../views/Metadata/Country/update.vue'),
    props: true,
    meta: { title: `${name} - Update`, layout: layout }
  },
  {
    path: '/iam/country',
    name: 'iam/country',
    component: () => import('../views/Metadata/Country/index.vue'),
    meta: { title: `${name} - Index`, layout: layout }
  }
];