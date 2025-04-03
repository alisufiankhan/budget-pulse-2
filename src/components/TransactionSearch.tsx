"use client"

import { useState, useEffect } from "react"
import { Calendar } from "lucide-react"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { Transaction, TransactionStatus, Category } from "@/types/money"

interface TransactionSearchProps {
  transactions: Transaction[]
  categories: Category[]
  onFilterChange: (filtered: Transaction[]) => void
}

export default function TransactionSearch({
  transactions,
  categories,
  onFilterChange,
}: TransactionSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedStatus, setSelectedStatus] = useState<TransactionStatus | "">("")
  const [amountRange, setAmountRange] = useState({ min: "", max: "" })
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  useEffect(() => {
    const filtered = transactions.filter((transaction) => {
      // Text search
      const matchesSearch = transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

      // Category filter
      const matchesCategory = selectedCategory
        ? transaction.categoryId === selectedCategory
        : true

      // Status filter
      const matchesStatus = selectedStatus
        ? transaction.status === selectedStatus
        : true

      // Amount range filter
      const matchesAmount =
        (!amountRange.min || transaction.amount >= parseFloat(amountRange.min)) &&
        (!amountRange.max || transaction.amount <= parseFloat(amountRange.max))

      // Date range filter
      const matchesDate =
        !dateRange?.from ||
        !dateRange?.to ||
        (new Date(transaction.date) >= dateRange.from &&
          new Date(transaction.date) <= dateRange.to)

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesAmount &&
        matchesDate
      )
    })

    onFilterChange(filtered)
  }, [
    searchTerm,
    selectedCategory,
    selectedStatus,
    amountRange,
    dateRange,
    transactions,
    onFilterChange,
  ])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 rounded bg-background border"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 rounded bg-background border"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as TransactionStatus)}
          className="p-2 rounded bg-background border"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="cleared">Cleared</option>
          <option value="reconciled">Reconciled</option>
        </select>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          <input
            type="number"
            placeholder="Min amount"
            value={amountRange.min}
            onChange={(e) =>
              setAmountRange((prev) => ({ ...prev, min: e.target.value }))
            }
            className="w-32 p-2 rounded bg-background border"
          />
          <span>to</span>
          <input
            type="number"
            placeholder="Max amount"
            value={amountRange.max}
            onChange={(e) =>
              setAmountRange((prev) => ({ ...prev, max: e.target.value }))
            }
            className="w-32 p-2 rounded bg-background border"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="flex items-center gap-2 p-2 rounded bg-background border"
          >
            <Calendar size={20} />
            {dateRange?.from ? (
              <>
                {format(dateRange.from, "MMM d, yyyy")}
                {dateRange.to && ` - ${format(dateRange.to, "MMM d, yyyy")}`}
              </>
            ) : (
              "Select dates"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
