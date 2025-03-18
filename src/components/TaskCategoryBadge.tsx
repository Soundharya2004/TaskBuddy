import type { TaskCategory } from "../types/task"

interface TaskCategoryBadgeProps {
  category: TaskCategory
}

const TaskCategoryBadge = ({ category }: TaskCategoryBadgeProps) => {
  let badgeClass = ""

  switch (category) {
    case "work":
      badgeClass = "bg-blue-50 text-blue-700"
      break
    case "personal":
      badgeClass = "bg-purple-50 text-purple-700"
      break
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </span>
  )
}

export default TaskCategoryBadge

