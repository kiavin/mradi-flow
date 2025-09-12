import { defineStore } from 'pinia';

export const useClientStore = defineStore('client', {
  state: () => ({
    ClientProfile: []
  }),
  actions: {
    async fetchClient() {
      try {
        const  data  = await fetch('/api/client');
        this.client = data.value;
      } catch (error) {
        console.error(error);
      }
    }
  }
});