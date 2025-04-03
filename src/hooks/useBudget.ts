"use client"

import { useState } from "react"
import { MonthlyData } from "@/types/money"
import { updateBudget } from "@/lib/finance"

export const useBudget = (monthData: MonthlyData, year: number, month: number) => {
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [budgetAmount, setBudgetAmount] = useState("")

  const handleSaveBudget = (categoryId: string) => {
    const amount = parseFloat(budgetAmount)
    if (!isNaN(amount) && amount > 0) {
      updateBudget(year, month, categoryId, amount)
      setEditingCategory(null)
      setBudgetAmount("")
    }
  }

  const getCategoryExpenses = (categoryId: string) => {
    return monthData.transactions
      .filter(t => t.categoryId === categoryId && t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)
  }

  return {
    editingCategory,
    setEditingCategory,
    budgetAmount,
    setBudgetAmount,
    handleSaveBudget,
    getCategoryExpenses
  }
}
