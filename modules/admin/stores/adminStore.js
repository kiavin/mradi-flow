import { defineStore } from 'pinia';

export const useAdminStore = defineStore('admin', {
  state: () => ({
    Profile: [],
    UserSettings: [],
    MailSettings: []
  }),
  actions: {
    async fetchAdmin() {
      try {
        const  data  = await fetch('/api/admin');
        this.admin = data.value;
      } catch (error) {
        console.error(error);
      }
    }
  }
});