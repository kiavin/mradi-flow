require('dotenv').config({ path: './omniface.cfg' });

const server = {
    host: true,
    proxy: {
        '/v1': {
            target: process.env.API_BASE_URL,
            changeOrigin: true,
            secure: false,
            rewrite: (path) => path.replace(/^\/api/, '')
        }
    },
    cors: false
};

// ...existing code...
