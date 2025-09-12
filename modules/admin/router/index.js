import ProfileRoutes from './Profile.js';
import UserSettingsRoutes from './UserSettings.js';
import MailSettingsRoutes from './MailSettings.js';
import CurrencyRoutes from './Currency.js';
import CountryRoutes from './Country.js';



export default [
  ...ProfileRoutes,
  ...UserSettingsRoutes,
  ...MailSettingsRoutes,
  ...CountryRoutes,
  ...CurrencyRoutes
];