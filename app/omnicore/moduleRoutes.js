import iamRoutes from '@/iam/router/index.js';
import mainRoutes from '@/main/router/index.js';
import projectRoutes from '@/project/router/index.js';

export default [
  ...iamRoutes,
  ...mainRoutes,
  ...projectRoutes
];
