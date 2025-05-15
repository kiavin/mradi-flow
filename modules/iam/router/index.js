import ChangePasswordRoutes from './ChangePassword.js';
import LoginRoutes from './Login.js';
import ResetPasswordRequestRoutes from './ResetPasswordRequest.js';
import ResetPasswordRoutes from './ResetPassword.js';
import RolesRoutes from './Roles.js';
import PermissionsRoutes from './Permissions.js';
import GroupsRoutes from './Groups.js';

export default [
  ...ChangePasswordRoutes,
  ...LoginRoutes,
  ...ResetPasswordRequestRoutes,
  ...ResetPasswordRoutes,
  ...RolesRoutes,
  ...PermissionsRoutes,
  ...GroupsRoutes
];