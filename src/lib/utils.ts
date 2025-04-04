import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { MonthlyData, Transaction, Currency, CurrencyConfig } from "@/types/money"
import { getInitialData } from "@/lib/finance"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const CURRENCY_CONFIG: CurrencyConfig = {
  symbol: '₨',
  name: 'Pakistani Rupee'
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ur-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0
  }).format(amount)
}

export const getStorageKey = (year: number, month: number): string => {
  return `money-tracker-${year}-${month}`
}

export const saveMonthData = (year: number, month: number, data: MonthlyData): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(getStorageKey(year, month), JSON.stringify(data))
  }
}

export const getMonthData = (year: number, month: number): MonthlyData => {
  if (typeof window === 'undefined') {
    return getInitialData()
  }
  
  const data = localStorage.getItem(getStorageKey(year, month))
  if (!data) {
    return getInitialData()
  }
  
  return JSON.parse(data)
}

export const addTransaction = (
  year: number,
  month: number,
  transaction: Omit<Transaction, 'id'>
): void => {
  const currentData = getMonthData(year, month)
  const newTransaction = {
    ...transaction,
    id: crypto.randomUUID(),
  }
  
  const newData = {
    ...currentData,
    income: transaction.type === 'income' 
      ? currentData.income + transaction.amount 
      : currentData.income,
    expense: transaction.type === 'expense' 
      ? currentData.expense + transaction.amount 
      : currentData.expense,
    transactions: [newTransaction, ...currentData.transactions],
  }
  
  saveMonthData(year, month, newData)
}

export const deleteTransaction = (
  year: number,
  month: number,
  transactionId: string
): void => {
  const currentData = getMonthData(year, month)
  const transaction = currentData.transactions.find(t => t.id === transactionId)
  
  if (!transaction) return
  
  const newData = {
    ...currentData,
    income: transaction.type === 'income' 
      ? currentData.income - transaction.amount 
      : currentData.income,
    expense: transaction.type === 'expense' 
      ? currentData.expense - transaction.amount 
      : currentData.expense,
    transactions: currentData.transactions.filter(t => t.id !== transactionId),
  }
  
  saveMonthData(year, month, newData)
}
