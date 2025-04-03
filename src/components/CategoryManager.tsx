"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2, AlertCircle, Check } from "lucide-react"
import { Category } from "@/types/money"
import { addCategory, deleteCategory } from "@/lib/finance"

interface CategoryManagerProps {
  categories: Category[]
  year: number
  month: number
  onUpdate: () => void
}

export default function CategoryManager({ categories, year, month, onUpdate }: CategoryManagerProps) {
  const [newCategory, setNewCategory] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null)

  const handleAddCategory = () => {
    // Validate input
    if (!newCategory.trim()) {
      setError("Category name cannot be empty")
      return
    }

    if (categories.some(c => c.name.toLowerCase() === newCategory.trim().toLowerCase())) {
      setError("Category already exists")
      return
    }

    // Generate a random color
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD", "#88D8B0", "#FF6F69", "#FFCC5C"]
    const randomColor = colors[Math.floor(Math.random() * colors.length)]

    // Add category
    addCategory(year, month, {
      name: newCategory.trim(),
      color: randomColor
    })

    // Reset state and show success message
    setNewCategory("")
    setError(null)
    setSuccess("Category added successfully")
    setTimeout(() => setSuccess(null), 3000)
    onUpdate()
  }

  const confirmDelete = (categoryId: string) => {
    setDeletingCategory(categoryId)
  }

  const handleDelete = (categoryId: string) => {
    deleteCategory(year, month, categoryId)
    setDeletingCategory(null)
    onUpdate()
  }

  return (
    <div className="bg-secondary p-6 rounded-lg space-y-6">
      <h2 className="text-xl font-semibold">Manage Categories</h2>

      {/* Add Category Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => {
              setNewCategory(e.target.value)
              setError(null)
            }}
            placeholder="Enter category name"
            className="flex-1 p-2 rounded bg-background border"
            aria-label="New category name"
          />
          <button
            onClick={handleAddCategory}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90 transition-opacity"
            aria-label="Add category"
          >
            <Plus size={20} />
            Add
          </button>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-sm text-destructive"
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-sm text-green-500"
            >
              <Check size={16} />
              <span>{success}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Categories List */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            layout
            className="flex items-center justify-between p-3 bg-background rounded"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span>{category.name}</span>
            </div>
            
            {deletingCategory === category.id ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-sm text-destructive hover:underline"
                  aria-label={`Confirm delete ${category.name}`}
                >
                  Confirm
                </button>
                <button
                  onClick={() => setDeletingCategory(null)}
                  className="text-sm hover:underline"
                  aria-label="Cancel delete"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => confirmDelete(category.id)}
                className="text-destructive hover:opacity-70 transition-opacity"
                aria-label={`Delete ${category.name}`}
              >
                <Trash2 size={20} />
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
