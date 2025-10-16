import { defineStore } from 'pinia';

export const useProjectStore = defineStore('project', {
  state: () => ({
    Expense: [],
    ExpenseContribution: [],
    Financier: [],
    Project: [],
    ProjectExpense: [],
    ProjectFinancier: []
  }),
  actions: {
    async fetchProject() {
      try {
        const  data  = await fetch('/api/project');
        this.project = data.value;
      } catch (error) {
        console.error(error);
      }
    }
  }
});