"use client"

import { Category, Transaction, MonthlyData, ChartData, Currency } from "@/types/money"
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns"

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "food", name: "Food", color: "#FF6B6B" },
  { id: "transport", name: "Transport", color: "#4ECDC4" },
  { id: "entertainment", name: "Entertainment", color: "#45B7D1" },
  { id: "shopping", name: "Shopping", color: "#96CEB4" },
  { id: "bills", name: "Bills", color: "#FFEEAD" },
  { id: "salary", name: "Salary", color: "#88D8B0" },
  { id: "investment", name: "Investment", color: "#FF6F69" },
  { id: "other", name: "Other", color: "#FFCC5C" }
]

export const getStorageKey = (year: number, month: number): string => {
  return `finance-tracker-${year}-${month}`
}

export const getInitialData = (): MonthlyData => ({
  income: 0,
  expense: 0,
  transactions: [],
  categories: DEFAULT_CATEGORIES,
  budgets: {}
})

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

export const deleteCategory = (
  year: number,
  month: number,
  categoryId: string
): void => {
  const currentData = getMonthData(year, month)
  
  // Remove the category
  const newData = {
    ...currentData,
    categories: currentData.categories.filter(c => c.id !== categoryId),
    // Remove associated budget
    budgets: Object.fromEntries(
      Object.entries(currentData.budgets).filter(([id]) => id !== categoryId)
    )
  }
  
  saveMonthData(year, month, newData)
}

export const updateCategory = (
  year: number,
  month: number,
  category: Category
): void => {
  const currentData = getMonthData(year, month)
  const newData = {
    ...currentData,
    categories: currentData.categories.map(c => 
      c.id === category.id ? category : c
    )
  }
  
  saveMonthData(year, month, newData)
}

export const addCategory = (
  year: number,
  month: number,
  category: Omit<Category, 'id'>
): void => {
  const currentData = getMonthData(year, month)
  const newCategory = {
    ...category,
    id: crypto.randomUUID()
  }
  
  const newData = {
    ...currentData,
    categories: [...currentData.categories, newCategory]
  }
  
  saveMonthData(year, month, newData)
}

export const updateBudget = (
  year: number,
  month: number,
  categoryId: string,
  amount: number
): void => {
  const currentData = getMonthData(year, month)
  const newData = {
    ...currentData,
    budgets: {
      ...currentData.budgets,
      [categoryId]: amount
    }
  }
  
  saveMonthData(year, month, newData)
}

export const getChartData = (transactions: Transaction[], categories: Category[]): ChartData[] => {
  const categoryMap = new Map(categories.map(c => [c.id, c.name]))
  const data: { [key: string]: { income: number; expense: number } } = {}
  
  transactions.forEach(t => {
    const categoryName = categoryMap.get(t.categoryId) ?? 'Other'
    if (!data[categoryName]) {
      data[categoryName] = { income: 0, expense: 0 }
    }
    if (t.type === 'income') {
      data[categoryName].income += t.amount
    } else {
      data[categoryName].expense += t.amount
    }
  })
  
  return Object.entries(data).map(([name, values]) => ({
    name,
    ...values
  }))
}

export const getCalendarData = (transactions: Transaction[]) => {
  const firstDay = startOfMonth(new Date())
  const lastDay = endOfMonth(new Date())
  
  const days = eachDayOfInterval({ start: firstDay, end: lastDay })
  const calendarData = new Map<string, Transaction[]>()
  
  days.forEach(day => {
    const dateStr = format(day, 'yyyy-MM-dd')
    calendarData.set(dateStr, [])
  })
  
  transactions.forEach(transaction => {
    const dateStr = transaction.date.split('T')[0]
    const existing = calendarData.get(dateStr) ?? []
    calendarData.set(dateStr, [...existing, transaction])
  })
  
  return calendarData
}
