"use client"

import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"
import { Category, Currency } from "@/types/money"
import { formatCurrency } from "@/lib/utils"

interface BudgetItemProps {
  category: Category
  budget: number
  expenses: number
  currency: Currency
  isEditing: boolean
  budgetAmount: string
  onEdit: () => void
  onSave: () => void
  onBudgetChange: (value: string) => void
}

export default function BudgetItem({
  category,
  budget,
  expenses,
  currency,
  isEditing,
  budgetAmount,
  onEdit,
  onSave,
  onBudgetChange
}: BudgetItemProps) {
  const progress = budget > 0 ? (expenses / budget) * 100 : 0
  const isOverBudget = progress > 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background p-4 rounded"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
        <div>
          <h3 className="font-semibold">{category.name}</h3>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(expenses)} / {formatCurrency(budget)}
          </p>
        </div>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={budgetAmount}
              onChange={(e) => onBudgetChange(e.target.value)}
              className="w-24 p-1 rounded bg-secondary"
              placeholder="Amount"
            />
            <button
              onClick={onSave}
              className="px-2 py-1 bg-primary text-primary-foreground rounded text-sm"
            >
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={onEdit}
            className="text-sm text-primary hover:underline"
          >
            Set Budget
          </button>
        )}
      </div>
      <div className="h-2 bg-secondary rounded overflow-hidden">
        <div
          className={`h-full transition-all ${
            isOverBudget ? "bg-destructive" : "bg-primary"
          }`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      {isOverBudget && (
        <div className="flex items-center gap-2 mt-2 text-sm text-destructive">
          <AlertTriangle size={16} />
          <span>Over budget!</span>
        </div>
      )}
    </motion.div>
  )
}
