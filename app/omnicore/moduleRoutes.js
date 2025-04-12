import mainRoutes from '@/main/router/index.js';
import iamRoutes from '@/iam/router/index.js';

// import schedulerRoutes from '@/scheduler/router/index.js';

export default [
  ...iamRoutes,
  ...mainRoutes,
  // ...schedulerRoutes
];