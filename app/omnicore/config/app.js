export default {
    safeRoutes: [
        'playground',
        'iam/login/index',
        'iam/password-reset/index',
        'NotFound',
        'error-page',
    ],
    api: {
        redirectErrorPages: true,
    },
    pwa: {
        enabled: false, // Master switch
        // All PWA configs now here:
        registerType: 'autoUpdate',
        manifest: {
            name: 'Omniface', // pass app name here
            short_name: 'Boilerplate',
            theme_color: '#ffffff',
            start_url: '/',
            display: 'standalone',
            background_color: '#ffffff',
            icons: [
                {
                    src: '/storage/pwa-192x192.png',
                    sizes: '192x192',
                    type: 'image/png'
                },
                {
                    src: '/storage/pwa-512x512.png',
                    sizes: '512x512',
                    type: 'image/png'
                }
            ]
        },
        // workbox: {
        //     globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
        // }
    }
}
