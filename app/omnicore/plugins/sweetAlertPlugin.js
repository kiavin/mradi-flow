import { showAlert, showToast } from '~/omnicore/utils';

export default {
    install: (app) => {
        app.config.globalProperties.$showAlert = showAlert;
        app.config.globalProperties.$showToast = showToast;
    }
};
