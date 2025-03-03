import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notification', {
  state: () => ({ messages: [] }),
  actions: {
    addMessage(type, text) {
      this.messages.push({ type, text });
    },
    removeMessage(index) {
      this.messages.splice(index, 1);
    }
  }
});
