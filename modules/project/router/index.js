import ExpenseRoutes from './Expense.js';
import ExpenseContributionRoutes from './ExpenseContribution.js';
import FinancierRoutes from './Financier.js';
import ProjectRoutes from './Project.js';
import ProjectExpenseRoutes from './ProjectExpense.js';
import ProjectFinancierRoutes from './ProjectFinancier.js';
import Dashboard from './Dashboard.js';

export default [
  ...ExpenseRoutes,
  ...ExpenseContributionRoutes,
  ...FinancierRoutes,
  ...ProjectRoutes,
  ...ProjectExpenseRoutes,
  ...ProjectFinancierRoutes,
  ...Dashboard
];
