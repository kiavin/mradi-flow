const layout = 'hopeui'
const name = 'mradi360'
export default [
    {
        path: '/iam/currency/create',
        name: 'iam/currency/create',
        component: () => import('../views/Metadata/Currency/create.vue'),
        meta: { title: `${name} - Create`, layout: layout }
    },
    {
        path: '/iam/currency/view/:id',
        name: 'iam/currency/view',
        component: () => import('../views/Metadata/Currency/view.vue'),
        props: true,
        meta: { title: `${name} - View`, layout: layout }
    },
    {
        path: '/iam/currency/update/:id',
        name: 'iam/currency/update',
        component: () => import('../views/Metadata/Currency/update.vue'),
        props: true,
        meta: { title: `${name} - Update`, layout: layout }
    },
    {
        path: '/iam/currency',
        name: 'iam/currency',
        component: () => import('../views/Metadata/Currency/index.vue'),
        meta: { title: `${name} - Index`, layout: layout }
    }
];