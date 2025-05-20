import ProfileRoutes from './Profile.js';
import UserSettingsRoutes from './UserSettings.js';
import MailSettingsRoutes from './MailSettings.js';

export default [
  ...ProfileRoutes,
  ...UserSettingsRoutes,
  ...MailSettingsRoutes
];