import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import type { Task, TaskStatus } from "../types/task"
import TaskCard from "./TaskCard"

interface SortableTaskCardProps {
  task: Task
  onEdit: () => void
  onUpdateStatus?: (taskId: string, status: TaskStatus) => void
}

const SortableTaskCard = ({ task, onEdit, onUpdateStatus }: SortableTaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: "transform 200ms ease", // Define a fixed transition
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-manipulation mb-2">
      <TaskCard task={task} onEdit={onEdit} onUpdateStatus={onUpdateStatus} />
    </div>
  )
}

export default SortableTaskCard

