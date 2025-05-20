const layout = 'hopeui'
export default [

    {
        path: '/iam/users/view/:id',
        name: 'iam/users/view',
        component: () => import('../views/Users/view.vue'),
        props: true,
        meta: { title: 'Omniface - View', layout: layout }
    },

    {
        path: '/iam/users',
        name: 'iam/users',
        component: () => import('../views/Users/index.vue'),
        meta: { title: 'Omniface - Index', layout: layout }
    }
];