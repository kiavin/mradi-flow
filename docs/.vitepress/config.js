// docs/.vitepress/config.js
export default {
    base: '/docs/',
    title: 'Omniface Vue Boilerplate', // Site title
    description: 'Documentation for Omniface, Warp CLI, and useApi', // Meta description
    themeConfig: {
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Omnigrid', link: '/omnigrid/' },
            { text: 'Warp CLI', link: '/warp-cli/' },
            { text: 'useApi', link: '/use-api/' }
        ],
        sidebar: {
            '/omnigrid/': [
                { text: 'Overview', link: '/omnigrid/' },
                { text: 'Usage', link: '/omnigrid/usage' },
                { text: 'Examples', link: '/omnigrid/examples' }
            ],
            '/warp-cli/': [
                { text: 'Introduction', link: '/warp-cli/' },
                { text: 'Commands', link: '/warp-cli/commands' },
                { text: 'Code Generation', link: '/warp-cli/codegen' }
            ],
            '/use-api/': [
                { text: 'Getting Started', link: '/use-api/' },
                { text: 'Methods', link: '/use-api/methods' },
                { text: 'Error Handling', link: '/use-api/error-handling' }
            ]
        }
    }
}