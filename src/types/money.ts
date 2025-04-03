export type TransactionStatus = 'pending' | 'cleared' | 'reconciled';
export type TransactionType = 'income' | 'expense';
export type Currency = 'PKR' | 'USD';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  name: string;
  rate: number; // Exchange rate relative to USD
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
