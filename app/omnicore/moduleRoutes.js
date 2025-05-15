import iamRoutes from '@/iam/router/index.js';
import mainRoutes from '@/main/router/index.js';

export default [
  ...iamRoutes,
  ...mainRoutes
];