export type TransactionStatus = 'pending' | 'due' | 'paid';
export type TransactionType = 'income' | 'expense';
export type Currency = 'PKR';

export interface CurrencyConfig {
  symbol: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  budget?: number;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  categoryId: string;
  type: TransactionType;
  date: string;
  status: TransactionStatus;
  currency: string;
  receipt?: string;
  notes?: string;
}

export interface MonthlyData {
  income: number;
  expense: number;
  transactions: Transaction[];
  categories: Category[];
  budgets: {
    [categoryId: string]: number;
  };
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface ChartData {
  name: string;
  income: number;
  expense: number;
}
