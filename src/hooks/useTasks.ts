"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState, useCallback, useRef } from "react"
import { useAuth } from "./useAuth"
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  deleteMultipleTasks,
  updateTaskStatus,
  subscribeToTasks,
  fixTaskStatuses,
} from "../services/taskService"
import type { Task, TaskFormData, TaskStatus } from "../types/task"

export const useTasks = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Use a ref to track if we've already fixed task statuses
  const hasFixedStatuses = useRef(false)

  // Function to fetch tasks
  const fetchTasks = useCallback(async () => {
    if (!user) return

    try {
      console.log("Manually fetching tasks for user:", user.uid)
      setIsLoading(true)
      const fetchedTasks = await getTasks(user.uid)
      console.log("Manually fetched tasks:", fetchedTasks.length, fetchedTasks)

      // Use a functional update to ensure we're working with the latest state
      setTasks(fetchedTasks)
      setIsLoading(false)
    } catch (err) {
      console.error("Error manually fetching tasks:", err)
      setError(err as Error)
      setIsLoading(false)
    }
  }, [user])

  // Function to fix task statuses
  const fixTaskStatusesFunction = useCallback(async () => {
    if (!user || hasFixedStatuses.current) return

    try {
      console.log("Fixing task statuses for user:", user.uid)
      setIsLoading(true)
      await fixTaskStatuses(user.uid)
      hasFixedStatuses.current = true
      // After fixing, fetch the tasks again
      await fetchTasks()
    } catch (err) {
      console.error("Error fixing task statuses:", err)
      setError(err as Error)
      setIsLoading(false)
    }
  }, [user, fetchTasks])

  useEffect(() => {
    if (!user) {
      console.log("No user logged in, clearing tasks")
      setTasks([])
      setIsLoading(false)
      return () => {}
    }

    console.log("User authenticated, fetching tasks for:", user.uid)
    setIsLoading(true)

    // Fix task statuses first, then fetch tasks
    fixTaskStatusesFunction()
      .then(() => {
        console.log("Task statuses fixed, now fetching tasks")
      })
      .catch((err) => {
        console.error("Error in fix and fetch sequence:", err)
      })

    // Subscribe to real-time updates
    const unsubscribe = subscribeToTasks(user.uid, (updatedTasks) => {
      console.log("Real-time update received, tasks:", updatedTasks.length, updatedTasks)
      setTasks(updatedTasks)
      setIsLoading(false)
    })

    return () => {
      console.log("Cleaning up subscriptions")
      unsubscribe()
    }
  }, [user, fixTaskStatusesFunction])

  const createTaskMutation = useMutation(
    (data: { taskData: TaskFormData }) => createTask(data.taskData, user?.uid || ""),
    {
      onMutate: async (newTaskData) => {
        // Cancel any outgoing refetches
        await queryClient.cancelQueries(["tasks", user?.uid])

        // Snapshot the previous value
        const previousTasks = [...tasks]

        // Optimistically update to the new value
        const optimisticTask: Task = {
          id: `temp-${Date.now()}`,
          ...newTaskData.taskData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: user?.uid || "",
          attachments: [],
        }

        setTasks((prev) => [optimisticTask, ...prev])

        // Return a context object with the snapshotted value
        return { previousTasks }
      },
      onSuccess: (newTask) => {
        console.log("Task created successfully:", newTask)
        // We don't need to manually fetch tasks here as the subscription will update the state
      },
      onError: (error: any, _, context: any) => {
        console.error("Error creating task:", error)
        // If the mutation fails, use the context returned from onMutate to roll back
        if (context?.previousTasks) {
          setTasks(context.previousTasks)
        }
      },
    },
  )

  const updateTaskMutation = useMutation(
    (data: { taskId: string; taskData: Partial<TaskFormData> }) => updateTask(data.taskId, data.taskData),
    {
      onMutate: async (updateData) => {
        // Cancel any outgoing refetches
        await queryClient.cancelQueries(["tasks", user?.uid])

        // Snapshot the previous value
        const previousTasks = [...tasks]

        // Optimistically update to the new value
        setTasks((prev) =>
          prev.map((task) =>
            task.id === updateData.taskId
              ? { ...task, ...updateData.taskData, updatedAt: new Date().toISOString() }
              : task,
          ),
        )

        // Return a context object with the snapshotted value
        return { previousTasks }
      },
      onSuccess: (updatedTask) => {
        console.log("Task updated successfully:", updatedTask)
        // We don't need to manually fetch tasks here as the subscription will update the state
      },
      onError: (error: any, _, context: any) => {
        console.error("Error updating task:", error)
        // If the mutation fails, use the context returned from onMutate to roll back
        if (context?.previousTasks) {
          setTasks(context.previousTasks)
        }
      },
    },
  )

  const deleteTaskMutation = useMutation((taskId: string) => deleteTask(taskId), {
    onMutate: async (taskId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(["tasks", user?.uid])

      // Snapshot the previous value
      const previousTasks = [...tasks]

      // Optimistically update to the new value
      setTasks((prev) => prev.filter((task) => task.id !== taskId))

      // Return a context object with the snapshotted value
      return { previousTasks }
    },
    onSuccess: (_, taskId) => {
      console.log("Task deleted successfully:", taskId)
      // We don't need to manually fetch tasks here as the subscription will update the state
    },
    onError: (error: any, _, context: any) => {
      console.error("Error deleting task:", error)
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTasks) {
        setTasks(context.previousTasks)
      }
    },
  })

  const deleteMultipleTasksMutation = useMutation((taskIds: string[]) => deleteMultipleTasks(taskIds), {
    onMutate: async (taskIds) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(["tasks", user?.uid])

      // Snapshot the previous value
      const previousTasks = [...tasks]

      // Optimistically update to the new value
      setTasks((prev) => prev.filter((task) => !taskIds.includes(task.id)))

      // Return a context object with the snapshotted value
      return { previousTasks }
    },
    onSuccess: (_, taskIds) => {
      console.log("Multiple tasks deleted successfully:", taskIds)
      // We don't need to manually fetch tasks here as the subscription will update the state
    },
    onError: (error: any, _, context: any) => {
      console.error("Error deleting multiple tasks:", error)
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTasks) {
        setTasks(context.previousTasks)
      }
    },
  })

  const updateTaskStatusMutation = useMutation(
    (data: { taskId: string; status: string }) => updateTaskStatus(data.taskId, data.status),
    {
      onMutate: async ({ taskId, status }) => {
        // Cancel any outgoing refetches
        await queryClient.cancelQueries(["tasks", user?.uid])

        // Snapshot the previous value
        const previousTasks = [...tasks]

        // Find the task to update
        const taskToUpdate = tasks.find((task) => task.id === taskId)

        if (!taskToUpdate) {
          console.error("Task not found for status update:", taskId)
          return { previousTasks }
        }

        console.log("Optimistically updating task status:", taskId, "from", taskToUpdate.status, "to", status)

        // Optimistically update to the new value
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId ? { ...task, status: status as TaskStatus, updatedAt: new Date().toISOString() } : task,
          ),
        )

        // Return a context object with the snapshotted value
        return { previousTasks }
      },
      onSuccess: (updatedTask) => {
        console.log("Task status updated successfully:", updatedTask)
        // We don't need to manually fetch tasks here as the subscription will update the state
      },
      onError: (error: any, variables, context: any) => {
        console.error(
          "Error updating task status:",
          error,
          "for task:",
          variables.taskId,
          "to status:",
          variables.status,
        )
        // If the mutation fails, use the context returned from onMutate to roll back
        if (context?.previousTasks) {
          setTasks(context.previousTasks)
        }
      },
    },
  )

  return {
    tasks,
    isLoading,
    isError: !!error,
    error,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    deleteMultipleTasks: deleteMultipleTasksMutation.mutate,
    updateTaskStatus: updateTaskStatusMutation.mutate,
    refreshTasks: fetchTasks,
    fixTaskStatuses: fixTaskStatusesFunction,
  }
}

