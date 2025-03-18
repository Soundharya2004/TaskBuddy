"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useTasks } from "../hooks/useTasks"
import Header from "../components/Header"
import ListView from "../components/ListView"
import BoardView from "../components/BoardView"
import CreateTaskModal from "../components/CreateTaskModal"
import EditTaskModal from "../components/EditTaskModal"
import type { Task, TaskFormData, TaskStatus } from "../types/task"

const Dashboard = () => {
  const [view, setView] = useState<"list" | "board">("list")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<"all" | "work" | "personal">("all")
  const [selectedDueDate, setSelectedDueDate] = useState<"all" | "today" | "week" | "month">("all")
  const [initialStatus, setInitialStatus] = useState<TaskStatus>("todo")

  const {
    tasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    deleteMultipleTasks,
    updateTaskStatus,
    refreshTasks,
    fixTaskStatuses,
    updateMultipleTaskStatuses,
  } = useTasks()

  // Fix task statuses and refresh tasks when the component mounts
  useEffect(() => {
    const initializeTasks = async () => {
      try {
        // First fix any tasks with incorrect status values
        await fixTaskStatuses()
        // Then refresh the tasks to get the latest data
        await refreshTasks()
      } catch (error) {
        console.error("Error initializing tasks:", error)
      }
    }

    initializeTasks()
  }, [fixTaskStatuses, refreshTasks])

  const handleOpenCreateModal = useCallback((status: TaskStatus = "todo") => {
    setInitialStatus(status)
    setIsCreateModalOpen(true)
  }, [])

  const handleCreateTask = useCallback(
    (taskData: TaskFormData) => {
      console.log("Creating task with data:", taskData)
      createTask({ taskData })
      setIsCreateModalOpen(false)
    },
    [createTask],
  )

  const handleUpdateTask = useCallback(
    (taskId: string, taskData: Partial<TaskFormData>) => {
      console.log("Updating task:", taskId, taskData)
      updateTask({ taskId, taskData })
      setIsEditModalOpen(false)
      setCurrentTask(null)
    },
    [updateTask],
  )

  const handleDeleteTask = useCallback(
    (taskId: string) => {
      console.log("Deleting task:", taskId)
      deleteTask(taskId)
      setIsEditModalOpen(false)
      setCurrentTask(null)
    },
    [deleteTask],
  )

  const handleEditTask = useCallback((task: Task) => {
    console.log("Editing task:", task)
    setCurrentTask(task)
    setIsEditModalOpen(true)
  }, [])

  const handleDeleteMultipleTasks = useCallback(
    (taskIds: string[]) => {
      console.log("Deleting multiple tasks:", taskIds)
      deleteMultipleTasks(taskIds)
    },
    [deleteMultipleTasks],
  )

  const handleUpdateTaskStatus = useCallback(
    (taskId: string, status: string) => {
      console.log("Dashboard: Updating task status:", taskId, status)
      updateTaskStatus({ taskId, status })
    },
    [updateTaskStatus],
  )

  const handleUpdateMultipleTaskStatuses = useCallback(
    (taskIds: string[], status: string) => {
      console.log("Dashboard: Updating multiple task statuses:", taskIds, "to", status)
      updateMultipleTaskStatuses({ taskIds, status })
    },
    [updateMultipleTaskStatuses],
  )

  // Filter tasks based on search query, category, and due date
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        searchQuery === "" ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "all" || task.category === selectedCategory

      let matchesDueDate = true
      if (selectedDueDate !== "all" && task.dueDate) {
        const today = new Date()
        const dueDate = new Date(task.dueDate)

        if (selectedDueDate === "today") {
          matchesDueDate =
            dueDate.getDate() === today.getDate() &&
            dueDate.getMonth() === today.getMonth() &&
            dueDate.getFullYear() === today.getFullYear()
        } else if (selectedDueDate === "week") {
          const weekFromNow = new Date()
          weekFromNow.setDate(today.getDate() + 7)
          matchesDueDate = dueDate <= weekFromNow && dueDate >= today
        } else if (selectedDueDate === "month") {
          const monthFromNow = new Date()
          monthFromNow.setMonth(today.getMonth() + 1)
          matchesDueDate = dueDate <= monthFromNow && dueDate >= today
        }
      }

      return matchesSearch && matchesCategory && matchesDueDate
    })
  }, [tasks, searchQuery, selectedCategory, selectedDueDate])

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        view={view}
        setView={setView}
        onCreateTask={() => handleOpenCreateModal()}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedDueDate={selectedDueDate}
        setSelectedDueDate={setSelectedDueDate}
      />

      <main className="container mx-auto px-4 py-6">
        {view === "list" ? (
          <ListView
            tasks={filteredTasks}
            isLoading={isLoading}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onDeleteMultipleTasks={handleDeleteMultipleTasks}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onUpdateMultipleTaskStatuses={handleUpdateMultipleTaskStatuses}
            onCreateTask={handleOpenCreateModal}
            searchQuery={searchQuery}
          />
        ) : (
          <BoardView
            tasks={filteredTasks}
            isLoading={isLoading}
            onEditTask={handleEditTask}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            searchQuery={searchQuery}
          />
        )}
      </main>

      {isCreateModalOpen && (
        <CreateTaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateTask={handleCreateTask}
          initialStatus={initialStatus}
        />
      )}

      {isEditModalOpen && currentTask && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setCurrentTask(null)
          }}
          task={currentTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      )}
    </div>
  )
}

export default Dashboard

