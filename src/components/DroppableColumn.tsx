import { useDroppable } from "@dnd-kit/core"
import type { ReactNode } from "react"

interface DroppableColumnProps {
  id: string
  title: string
  count: number
  color: string
  children: ReactNode
}

const DroppableColumn = ({ id, title, count, children, color }: DroppableColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <div className="rounded-lg bg-gray-50 overflow-hidden border border-gray-200 shadow-sm">
      <div className={`p-2 text-center ${color}`}>
        <h3 className="font-medium text-gray-900 text-xs uppercase">
          {title} ({count})
        </h3>
      </div>
      <div
        ref={setNodeRef}
        className={`p-2 min-h-[150px] transition-colors duration-200 ${isOver ? "bg-gray-200 ring-2 ring-primary" : ""}`}
      >
        {children}
      </div>
    </div>
  )
}

export default DroppableColumn

