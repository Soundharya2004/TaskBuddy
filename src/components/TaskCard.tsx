"use client"
import { format } from "date-fns"
import type React from "react"

import { FiCalendar, FiEdit2 } from "react-icons/fi"
import type { Task, TaskStatus } from "../types/task"
import TaskCategoryBadge from "./TaskCategoryBadge"

interface TaskCardProps {
  task: Task
  onEdit: () => void
  onUpdateStatus?: (taskId: string, status: TaskStatus) => void
}

const TaskCard = ({ task, onEdit, onUpdateStatus }: TaskCardProps) => {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation()
    if (onUpdateStatus) {
      console.log("Changing status from dropdown:", task.id, e.target.value)
      onUpdateStatus(task.id, e.target.value as TaskStatus)
    }
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("Edit button clicked for task:", task.id)
    onEdit()
  }

  return (
    <div
      className="bg-white rounded-lg shadow-sm p-3 cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
      onClick={() => onEdit()}
    >
      <div className="flex justify-between items-start">
        <h4
          className={`font-medium text-gray-900 mb-1 ${task.status === "completed" ? "line-through text-gray-500" : ""}`}
        >
          {task.title}
        </h4>
        <div className="flex items-center">
          <select
            className={`mr-2 text-xs rounded-full px-2 py-0.5 ${
              task.status === "todo"
                ? "bg-pink-100 text-pink-800"
                : task.status === "inProgress"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
            }`}
            value={task.status}
            onChange={handleStatusChange}
            onClick={(e) => e.stopPropagation()}
          >
            <option value="todo">To Do</option>
            <option value="inProgress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <button
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
            onClick={handleEditClick}
          >
            <FiEdit2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <div className={`text-xs text-gray-500 line-clamp-2 mb-1 ${task.status === "completed" ? "line-through" : ""}`}>
          {task.description}
        </div>

        <div className="flex justify-between items-center">
          <TaskCategoryBadge category={task.category} />

          {task.dueDate && (
            <div className="flex items-center text-xs text-gray-500">
              <FiCalendar className="mr-1 h-3 w-3" />
              {format(new Date(task.dueDate), "dd MMM, yyyy")}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskCard

