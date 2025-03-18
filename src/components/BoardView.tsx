"use client"

import { useState } from "react"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import type { Task, TaskStatus } from "../types/task"
import SortableTaskCard from "./SortableTaskCard"
import DroppableColumn from "./DroppableColumn"

interface BoardViewProps {
  tasks: Task[]
  isLoading: boolean
  onEditTask: (task: Task) => void
  onUpdateTaskStatus: (taskId: string, status: string) => void
  searchQuery: string
}

const BoardView = ({ tasks, isLoading, onEditTask, onUpdateTaskStatus }: BoardViewProps) => {
  const [activeId, setActiveId] = useState<string | null>(null)

  // Find the active task
  const activeTask = activeId ? tasks.find((task) => task.id === activeId) : null

  // Group tasks by status
  const todoTasks = tasks.filter((task) => task.status === "todo")
  const inProgressTasks = tasks.filter((task) => task.status === "inProgress")
  const completedTasks = tasks.filter((task) => task.status === "completed")

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Require the mouse to move by 10 pixels before activating
      activationConstraint: {
        distance: 10,
      },
    }),
  )

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as string)
    console.log("Drag started:", active.id)
  }

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    console.log("Drag ended:", active.id, "over:", over?.id)

    // If dropped over a droppable area
    if (over && active.id !== over.id) {
      const taskId = active.id as string
      const newStatus = over.id as TaskStatus

      console.log(`Moving task ${taskId} to ${newStatus}`)
      onUpdateTaskStatus(taskId, newStatus)
    }

    setActiveId(null)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-t-4 border-primary border-solid rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* TO-DO Column */}
        <DroppableColumn id="todo" title="TO-DO" count={todoTasks.length} color="bg-pink-100">
          {todoTasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onEdit={() => onEditTask(task)}
              onUpdateStatus={onUpdateTaskStatus}
            />
          ))}
          {todoTasks.length === 0 && <div className="text-center py-8 text-gray-500 text-sm">No Tasks in To-Do</div>}
        </DroppableColumn>

        {/* IN-PROGRESS Column */}
        <DroppableColumn id="inProgress" title="IN-PROGRESS" count={inProgressTasks.length} color="bg-blue-100">
          {inProgressTasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onEdit={() => onEditTask(task)}
              onUpdateStatus={onUpdateTaskStatus}
            />
          ))}
          {inProgressTasks.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">No Tasks in Progress</div>
          )}
        </DroppableColumn>

        {/* COMPLETED Column */}
        <DroppableColumn id="completed" title="COMPLETED" count={completedTasks.length} color="bg-green-100">
          {completedTasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onEdit={() => onEditTask(task)}
              onUpdateStatus={onUpdateTaskStatus}
            />
          ))}
          {completedTasks.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">No Completed Tasks</div>
          )}
        </DroppableColumn>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask ? (
          <div className="bg-white rounded-lg shadow-md p-3 border border-gray-200 w-full max-w-xs">
            <h4
              className={`font-medium text-gray-900 mb-1 ${activeTask.status === "completed" ? "line-through text-gray-500" : ""}`}
            >
              {activeTask.title}
            </h4>
            <div
              className={`text-xs text-gray-500 line-clamp-2 mb-1 ${activeTask.status === "completed" ? "line-through" : ""}`}
            >
              {activeTask.description}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default BoardView

