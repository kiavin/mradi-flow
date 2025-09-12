import adminRoutes from '@/admin/router/index.js';
import clientRoutes from '@/client/router/index.js';
import iamRoutes from '@/iam/router/index.js';
import mainRoutes from '@/main/router/index.js';

export default [
  ...adminRoutes,
  ...clientRoutes,
  ...iamRoutes,
  ...mainRoutes
];