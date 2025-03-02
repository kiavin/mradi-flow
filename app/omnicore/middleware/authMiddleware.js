import { useAuthStore } from '@/stores/authStore'; // Import Pinia/Vuex auth store

export function authMiddleware(to, from, next) {
    const authStore = useAuthStore();
    const userIsAuthenticated = authStore.isAuthenticated; // Check if user is logged in

    // Get module config dynamically based on route
    const moduleName = to.matched[0]?.name || ''; // Extract module name
    let moduleConfig;

    try {
        moduleConfig = require(`@/modules/${moduleName}/module.config.js`).default;
    } catch (error) {
        console.warn(`⚠️ No config found for module: ${moduleName}. Defaulting to open access.`);
        moduleConfig = { IS_SECURE: true, SAFE_ROUTES: [] }; // Default: all routes open
    }

    const { IS_SECURE, SAFE_ROUTES } = moduleConfig;

    if (!IS_SECURE) {
        // If route is safe, allow access
        if (SAFE_ROUTES.includes(to.path)) {
            return next();
        }

        // If user is not authenticated, redirect to login
        if (!userIsAuthenticated) {
            return next({ name: 'login' }); 
        }
    }

    next(); // Allow access
}
