import appConfig from "../config/app";
export const getSafeRoutes = () => {
    // return appConfig.safeRoutes
    const raw = import.meta.env.VITE_SAFE_ROUTES || ''
    return raw.split(',').map(r => r.trim()).filter(Boolean)
}
