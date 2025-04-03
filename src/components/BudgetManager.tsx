"use client"

import { Category, MonthlyData, Currency } from "@/types/money"
import { useBudget } from "@/hooks/useBudget"
import BudgetItem from "./BudgetItem"

interface BudgetManagerProps {
  monthData: MonthlyData
  year: number
  month: number
}

export default function BudgetManager({ monthData, year, month }: BudgetManagerProps) {
  const {
    editingCategory,
    setEditingCategory,
    budgetAmount,
    setBudgetAmount,
    handleSaveBudget,
    getCategoryExpenses
  } = useBudget(monthData, year, month)

  const currency = (monthData.transactions[0]?.currency as Currency) ?? 'PKR'

  return (
    <div className="bg-secondary p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Budget Management</h2>
      <div className="space-y-4">
        {monthData.categories.map((category: Category) => {
          const budget = monthData.budgets[category.id] ?? 0
          const expenses = getCategoryExpenses(category.id)

          return (
            <BudgetItem
              key={category.id}
              category={category}
              budget={budget}
              expenses={expenses}
              currency={currency}
              isEditing={editingCategory === category.id}
              budgetAmount={budgetAmount}
              onEdit={() => {
                setEditingCategory(category.id)
                setBudgetAmount(budget.toString())
              }}
              onSave={() => handleSaveBudget(category.id)}
              onBudgetChange={setBudgetAmount}
            />
          )
        })}
      </div>
    </div>
  )
}
