import { useAuthStore } from '~/omnicore/stores/authStore'
import { getSafeRoutes } from '../helpers/safeRoutes'

export default function authGuard(to, from, next) {
    const auth = useAuthStore()
    const safeRoutes = getSafeRoutes()

    const currentRouteName = to.name?.toString() || '';
    const isSafe = safeRoutes.includes(currentRouteName);

    if (auth.isAuthenticated && currentRouteName === 'iam/auth/login') {
        return next(from.fullPath || { name: 'dashboard' })
    }

    if (!auth.isAuthenticated && !isSafe) {
        if (currentRouteName === 'iam/login') {
            return next()
        }
        return next({ name: 'iam/auth/login' })
    }

    return next()
}


