import { useDroppable } from "@dnd-kit/core"
import type { ReactNode } from "react"
import type { TaskStatus } from "../types/task"

interface TaskColumnProps {
  title: string
  status: TaskStatus
  count: number
  color: string
  children: ReactNode
}

const TaskColumn = ({ title, status, count, children, color }: TaskColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  })

  return (
    <div
      className={`rounded-lg bg-gray-50 ${isOver ? "ring-2 ring-primary" : ""} overflow-hidden border border-gray-200 shadow-sm`}
    >
      <div className={`p-2 text-center ${color}`}>
        <h3 className="font-medium text-gray-900 text-xs uppercase">
          {title} ({count})
        </h3>
      </div>
      <div ref={setNodeRef} className={`p-2 min-h-[150px] ${isOver ? "bg-gray-200" : ""}`}>
        {children}
      </div>
    </div>
  )
}

export default TaskColumn

