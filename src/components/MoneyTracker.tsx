"use client"

import { useState, useEffect } from "react"
import Charts from "./Charts"
import BudgetManager from "./BudgetManager"
import TransactionSearch from "./TransactionSearch"
import CategoryManager from "./CategoryManager"
import { format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { useDropzone } from "react-dropzone"
import { 
  BarChart3, 
  PlusCircle, 
  Trash2,
  ArrowUpCircle,
  ArrowDownCircle
} from "lucide-react"
import { 
  addTransaction, 
  deleteTransaction, 
  formatCurrency, 
  getMonthData
} from "@/lib/utils"
import { Transaction, TransactionStatus, TransactionType, Category, Currency } from "@/types/money"
import { DEFAULT_CATEGORIES } from "@/lib/finance"

const categories = [
  "Food",
  "Transport",
  "Entertainment",
  "Shopping",
  "Bills",
  "Salary",
  "Investment",
  "Other"
]

export default function MoneyTracker() {
  const currentDate = new Date()
  const [year, setYear] = useState(currentDate.getFullYear())
  const [month, setMonth] = useState(currentDate.getMonth())
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    categoryId: "food",
    type: "expense" as TransactionType,
    status: "due" as TransactionStatus,
    currency: 'PKR',
    notes: "",
    receipt: undefined as string | undefined
  })

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"]
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      const reader = new FileReader()
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          receipt: reader.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  })

  const monthData = getMonthData(year, month)
  const [filteredTransactions, setFilteredTransactions] = useState(monthData.transactions)

  useEffect(() => {
    setFilteredTransactions(monthData.transactions)
  }, [monthData.transactions])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.amount || !formData.description) return

    addTransaction(year, month, {
      amount: parseFloat(formData.amount),
      description: formData.description,
      categoryId: formData.categoryId,
      type: formData.type,
      date: new Date().toISOString(),
      status: formData.status,
      currency: formData.currency,
      notes: formData.notes
    })

    setFormData({
      amount: "",
      description: "",
      categoryId: "food",
      type: "expense",
      status: "pending",
      currency: "USD",
      notes: "",
      receipt: undefined
    })
  }

  const handleDelete = (id: string) => {
    deleteTransaction(year, month, id)
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Money Tracker</h1>
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className="bg-secondary p-2 rounded"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {format(new Date(2024, i), "MMMM")}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="bg-secondary p-2 rounded"
          >
            {Array.from({ length: 5 }, (_, i) => (
              <option key={i} value={2024 - 2 + i}>
                {2024 - 2 + i}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-secondary p-6 rounded-lg">
          <div className="flex items-center gap-2">
            <ArrowUpCircle className="text-green-500" />
            <h2 className="text-xl font-semibold">Income</h2>
          </div>
          <p className="text-2xl font-bold text-green-500 mt-2">
            {formatCurrency(monthData.income)}
          </p>
        </div>
        <div className="bg-secondary p-6 rounded-lg">
          <div className="flex items-center gap-2">
            <ArrowDownCircle className="text-red-500" />
            <h2 className="text-xl font-semibold">Expenses</h2>
          </div>
          <p className="text-2xl font-bold text-red-500 mt-2">
            {formatCurrency(monthData.expense)}
          </p>
        </div>
        <div className="bg-secondary p-6 rounded-lg">
          <div className="flex items-center gap-2">
            <BarChart3 className="text-blue-500" />
            <h2 className="text-xl font-semibold">Balance</h2>
          </div>
          <p className="text-2xl font-bold text-blue-500 mt-2">
            {formatCurrency(monthData.income - monthData.expense)}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-secondary p-6 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Amount</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full p-2 rounded bg-background"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 rounded bg-background"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Category</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full p-2 rounded bg-background"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as "income" | "expense" })}
              className="w-full p-2 rounded bg-background"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90 transition-opacity"
        >
          <PlusCircle size={20} />
          Add Transaction
        </button>
      </form>

      <Charts transactions={monthData.transactions} categories={monthData.categories} />
      
      <CategoryManager 
        categories={monthData.categories}
        year={year}
        month={month}
        onUpdate={() => {
          // Force re-render by updating state
          setMonth(month)
        }}
      />
      
      <BudgetManager monthData={monthData} year={year} month={month} />

      <div className="bg-secondary p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Transactions</h2>
        <div className="mb-4">
          <TransactionSearch
            transactions={monthData.transactions}
            categories={monthData.categories}
            onFilterChange={(filtered) => setFilteredTransactions(filtered)}
          />
        </div>
        <div className="space-y-4">
          <AnimatePresence>
            {filteredTransactions.map((transaction: Transaction) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex items-center justify-between p-4 bg-background rounded"
              >
                <div>
                  <p className="font-semibold">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {DEFAULT_CATEGORIES.find((c: Category) => c.id === transaction.categoryId)?.name ?? 'Other'} • {format(new Date(transaction.date), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={transaction.type === "income" ? "text-green-500" : "text-red-500"}>
                    {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                  </span>
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="text-destructive hover:opacity-70 transition-opacity"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
