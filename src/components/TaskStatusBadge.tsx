import type { TaskStatus } from "../types/task"

interface TaskStatusBadgeProps {
  status: TaskStatus
}

const TaskStatusBadge = ({ status }: TaskStatusBadgeProps) => {
  let badgeClass = ""
  let label = ""

  switch (status) {
    case "todo":
      badgeClass = "bg-gray-100 text-gray-800"
      label = "To Do"
      break
    case "inProgress":
      badgeClass = "bg-blue-100 text-blue-800"
      label = "In Progress"
      break
    case "completed":
      badgeClass = "bg-green-100 text-green-800"
      label = "Completed"
      break
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
      {label}
    </span>
  )
}

export default TaskStatusBadge

