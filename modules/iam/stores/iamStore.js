import { defineStore } from 'pinia';

export const useIamStore = defineStore('iam', {
  state: () => ({
    ChangePassword: [],
    Login: [],
    ResetPasswordRequest: [],
    ResetPassword: [],
    Roles: [],
    Permissions: [],
    Groups: []
  }),
  actions: {
    async fetchIam() {
      try {
        const  data  = await fetch('/api/iam');
        this.iam = data.value;
      } catch (error) {
        console.error(error);
      }
    }
  }
});