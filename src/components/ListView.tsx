"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { FiEdit2, FiCalendar, FiChevronUp, FiChevronDown } from "react-icons/fi"
import type { Task, TaskStatus } from "../types/task"
import TaskCategoryBadge from "./TaskCategoryBadge"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core"
import { useDroppable } from "@dnd-kit/core"
import { useDraggable } from "@dnd-kit/core"

interface ListViewProps {
  tasks: Task[]
  isLoading: boolean
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
  onDeleteMultipleTasks: (taskIds: string[]) => void
  onUpdateTaskStatus: (taskId: string, status: string) => void
  onCreateTask: (status: TaskStatus) => void
  searchQuery: string
}

// Droppable area component
const DroppableArea = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <div ref={setNodeRef} className={`bg-gray-50 rounded-b-lg ${isOver ? "bg-gray-200 ring-2 ring-primary" : ""}`}>
      {children}
    </div>
  )
}

// Draggable task item component
const DraggableTaskItem = ({
  task,
  selectedTasks,
  onSelectTask,
  onEditTask,
  onUpdateStatus,
}: {
  task: Task
  selectedTasks: string[]
  onSelectTask: (id: string) => void
  onEditTask: (task: Task) => void
  onUpdateStatus: (taskId: string, status: TaskStatus) => void
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`p-3 hover:bg-gray-100 border-b border-gray-100 ${isDragging ? "opacity-50" : ""}`}
      {...listeners}
      {...attributes}
    >
      <div className="flex items-start">
        <div className="mr-3 pt-1">
          <input
            type="checkbox"
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            checked={selectedTasks.includes(task.id)}
            onChange={() => onSelectTask(task.id)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div className="flex-1 min-w-0 grid grid-cols-4 gap-4" onClick={() => onEditTask(task)}>
          <div>
            <div
              className={`text-sm font-medium text-gray-900 ${task.status === "completed" ? "line-through text-gray-500" : ""}`}
            >
              {task.title}
            </div>
            <p className={`text-xs text-gray-500 line-clamp-1 ${task.status === "completed" ? "line-through" : ""}`}>
              {task.description}
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {task.dueDate && (
              <div className="inline-flex items-center">
                <FiCalendar className="mr-1 h-3 w-3" />
                {format(new Date(task.dueDate), "dd MMM, yyyy")}
              </div>
            )}
          </div>
          <div>
            <select
              className={`text-xs rounded-full px-2 py-0.5 ${
                task.status === "todo"
                  ? "bg-pink-100 text-pink-800"
                  : task.status === "inProgress"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
              }`}
              value={task.status}
              onChange={(e) => {
                e.stopPropagation()
                console.log("Changing status from list view:", task.id, e.target.value)
                onUpdateStatus(task.id, e.target.value as TaskStatus)
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <option value="todo">To Do</option>
              <option value="inProgress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <TaskCategoryBadge category={task.category} />
          </div>
        </div>
        <div className="ml-2 flex items-center">
          <button
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200"
            onClick={(e) => {
              e.stopPropagation()
              onEditTask(task)
            }}
          >
            <FiEdit2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

const ListView = ({
  tasks,
  isLoading,
  onEditTask,
  onDeleteTask,
  onDeleteMultipleTasks,
  onUpdateTaskStatus,
  onCreateTask,
  searchQuery,
}: ListViewProps) => {
  console.log("ListView rendering with tasks:", tasks.length, "Loading:", isLoading)
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    todo: true,
    inProgress: true,
    completed: true,
  })
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor),
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const taskId = active.id as string
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      setActiveTask(task)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const taskId = active.id as string
      const newStatus = over.id as TaskStatus

      console.log(`Moving task ${taskId} to ${newStatus}`)
      onUpdateTaskStatus(taskId, newStatus)
    }

    setActiveTask(null)
  }

  const handleSelectTask = (taskId: string) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter((id) => id !== taskId))
    } else {
      setSelectedTasks([...selectedTasks, taskId])
    }
  }

  const handleDeleteSelected = () => {
    if (selectedTasks.length > 0) {
      onDeleteMultipleTasks(selectedTasks)
      setSelectedTasks([])
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    })
  }

  // Group tasks by status
  const todoTasks = tasks.filter((task) => task.status === "todo")
  const inProgressTasks = tasks.filter((task) => task.status === "inProgress")
  const completedTasks = tasks.filter((task) => task.status === "completed")

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-t-4 border-primary border-solid rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-4 px-4 py-2 font-medium text-sm text-gray-600 border-b rounded-lg">
          <div>Task name</div>
          <div>Due on</div>
          <div>Task Status</div>
          <div>Task Category</div>
        </div>

        {/* Todo Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <button
            className={`w-full flex items-center justify-between p-3 text-left font-medium bg-pink-100 text-gray-800 rounded-t-lg`}
            onClick={() => toggleSection("todo")}
          >
            <div className="flex items-center">
              <span>Todo ({todoTasks.length})</span>
            </div>
            {expandedSections.todo ? <FiChevronUp /> : <FiChevronDown />}
          </button>

          {expandedSections.todo && (
            <DroppableArea id="todo">
              {todoTasks.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No Tasks in To-Do</div>
              ) : (
                <>
                  {todoTasks.map((task) => (
                    <DraggableTaskItem
                      key={task.id}
                      task={task}
                      selectedTasks={selectedTasks}
                      onSelectTask={handleSelectTask}
                      onEditTask={onEditTask}
                      onUpdateStatus={onUpdateTaskStatus}
                    />
                  ))}
                </>
              )}

              {/* Add Task button within Todo section */}
              <div className="p-3 hover:bg-gray-100">
                <button
                  className="w-full flex items-center justify-center py-2 text-sm text-primary hover:text-secondary rounded-md hover:bg-white"
                  onClick={() => onCreateTask("todo")}
                >
                  <span className="mr-1">+</span> ADD TASK
                </button>
              </div>
            </DroppableArea>
          )}
        </div>

        {/* In Progress Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <button
            className={`w-full flex items-center justify-between p-3 text-left font-medium bg-blue-100 text-gray-800 rounded-t-lg`}
            onClick={() => toggleSection("inProgress")}
          >
            <div className="flex items-center">
              <span>In-Progress ({inProgressTasks.length})</span>
            </div>
            {expandedSections.inProgress ? <FiChevronUp /> : <FiChevronDown />}
          </button>

          {expandedSections.inProgress && (
            <DroppableArea id="inProgress">
              {inProgressTasks.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No Tasks in Progress</div>
              ) : (
                <>
                  {inProgressTasks.map((task) => (
                    <DraggableTaskItem
                      key={task.id}
                      task={task}
                      selectedTasks={selectedTasks}
                      onSelectTask={handleSelectTask}
                      onEditTask={onEditTask}
                      onUpdateStatus={onUpdateTaskStatus}
                    />
                  ))}
                </>
              )}

              {/* Add Task button within In Progress section */}
              <div className="p-3 hover:bg-gray-100">
                <button
                  className="w-full flex items-center justify-center py-2 text-sm text-primary hover:text-secondary rounded-md hover:bg-white"
                  onClick={() => onCreateTask("inProgress")}
                >
                  <span className="mr-1">+</span> ADD TASK
                </button>
              </div>
            </DroppableArea>
          )}
        </div>

        {/* Completed Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <button
            className={`w-full flex items-center justify-between p-3 text-left font-medium bg-green-100 text-gray-800 rounded-t-lg`}
            onClick={() => toggleSection("completed")}
          >
            <div className="flex items-center">
              <span>Completed ({completedTasks.length})</span>
            </div>
            {expandedSections.completed ? <FiChevronUp /> : <FiChevronDown />}
          </button>

          {expandedSections.completed && (
            <DroppableArea id="completed">
              {completedTasks.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No Completed Tasks</div>
              ) : (
                <>
                  {completedTasks.map((task) => (
                    <DraggableTaskItem
                      key={task.id}
                      task={task}
                      selectedTasks={selectedTasks}
                      onSelectTask={handleSelectTask}
                      onEditTask={onEditTask}
                      onUpdateStatus={onUpdateTaskStatus}
                    />
                  ))}
                </>
              )}

              {/* Add Task button within Completed section */}
              <div className="p-3 hover:bg-gray-100">
                <button
                  className="w-full flex items-center justify-center py-2 text-sm text-primary hover:text-secondary rounded-md hover:bg-white"
                  onClick={() => onCreateTask("completed")}
                >
                  <span className="mr-1">+</span> ADD TASK
                </button>
              </div>
            </DroppableArea>
          )}
        </div>

        {/* Multi-select action bar */}
        {selectedTasks.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex items-center justify-between z-50 rounded-t-lg shadow-lg">
            <div className="text-sm font-medium">{selectedTasks.length} tasks selected</div>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1.5 text-sm bg-gray-200 text-gray-800 rounded-md"
                onClick={() => setSelectedTasks([])}
              >
                Cancel
              </button>
              <button className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md" onClick={handleDeleteSelected}>
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Drag overlay */}
        <DragOverlay>
          {activeTask && (
            <div className="p-3 bg-white border border-gray-300 rounded-lg shadow-md">
              <div
                className={`text-sm font-medium text-gray-900 ${activeTask.status === "completed" ? "line-through" : ""}`}
              >
                {activeTask.title}
              </div>
              <p
                className={`text-xs text-gray-500 line-clamp-1 ${activeTask.status === "completed" ? "line-through" : ""}`}
              >
                {activeTask.description}
              </p>
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  )
}

export default ListView

