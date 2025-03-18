import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
  serverTimestamp,
  Timestamp,
  getDoc,
  onSnapshot,
  limit,
} from "firebase/firestore"
import { db } from "../firebase/config"
import type { Task, TaskFormData } from "../types/task"

const TASKS_COLLECTION = "tasks"

// Valid status values
const VALID_STATUSES = ["todo", "inProgress", "completed"]

// Helper function to normalize status values
const normalizeStatus = (status: string): string => {
  if (VALID_STATUSES.includes(status)) {
    return status
  }

  // If status is not valid, default to "todo"
  console.warn(`Invalid status value found: "${status}". Defaulting to "todo".`)
  return "todo"
}

// Helper function to convert Firestore data to Task object
const convertFirestoreDocToTask = (docId: string, data: any): Task => {
  // Handle potential null or undefined values
  const createdAt = data.createdAt
    ? typeof data.createdAt.toDate === "function"
      ? data.createdAt.toDate().toISOString()
      : new Date().toISOString()
    : new Date().toISOString()

  const updatedAt = data.updatedAt
    ? typeof data.updatedAt.toDate === "function"
      ? data.updatedAt.toDate().toISOString()
      : new Date().toISOString()
    : new Date().toISOString()

  const dueDate = data.dueDate
    ? typeof data.dueDate.toDate === "function"
      ? data.dueDate.toDate().toISOString()
      : null
    : null

  // Normalize the status value
  const normalizedStatus = normalizeStatus(data.status || "todo")

  return {
    id: docId,
    title: data.title || "",
    description: data.description || "",
    status: normalizedStatus,
    category: data.category || "work",
    dueDate: dueDate,
    createdAt: createdAt,
    updatedAt: updatedAt,
    userId: data.userId || "",
    attachments: data.attachments || [],
  } as Task
}

// Subscribe to tasks (real-time updates)
export const subscribeToTasks = (userId: string, callback: (tasks: Task[]) => void) => {
  console.log("Setting up real-time subscription for user:", userId)

  try {
    // Create a query that only filters by userId without any other constraints
    const tasksQuery = query(
      collection(db, TASKS_COLLECTION),
      where("userId", "==", userId),
      limit(1000), // Increased limit to ensure we get all tasks
    )

    console.log("Subscription query created:", tasksQuery)

    return onSnapshot(
      tasksQuery,
      (snapshot) => {
        console.log("Real-time snapshot received, docs:", snapshot.docs.length)

        // Log all document IDs for debugging
        snapshot.docs.forEach((doc) => {
          console.log("Document ID:", doc.id, "Data:", doc.data())
        })

        const tasks = snapshot.docs.map((doc) => {
          const data = doc.data()
          return convertFirestoreDocToTask(doc.id, data)
        })

        console.log("Processed tasks:", tasks.length)
        callback(tasks)
      },
      (error) => {
        console.error("Error in Firestore subscription:", error)
      },
    )
  } catch (error) {
    console.error("Error setting up subscription:", error)
    // Return a no-op unsubscribe function
    return () => {}
  }
}

export const getTasks = async (userId: string): Promise<Task[]> => {
  try {
    console.log("Getting tasks for user:", userId)

    // Create a query that only filters by userId without any other constraints
    const tasksQuery = query(
      collection(db, TASKS_COLLECTION),
      where("userId", "==", userId),
      limit(1000), // Increased limit to ensure we get all tasks
    )

    console.log("Query created:", tasksQuery)

    const querySnapshot = await getDocs(tasksQuery)
    console.log("Tasks fetched:", querySnapshot.docs.length)

    // Log all document IDs for debugging
    querySnapshot.docs.forEach((doc) => {
      console.log("Document ID:", doc.id, "Data:", doc.data())
    })

    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return convertFirestoreDocToTask(doc.id, data)
    })
  } catch (error) {
    console.error("Error getting tasks:", error)
    throw error
  }
}

export const getTask = async (taskId: string): Promise<Task> => {
  try {
    const taskRef = doc(db, TASKS_COLLECTION, taskId)
    const taskDoc = await getDoc(taskRef)

    if (!taskDoc.exists()) {
      throw new Error("Task not found")
    }

    const data = taskDoc.data()
    return convertFirestoreDocToTask(taskDoc.id, data)
  } catch (error) {
    console.error("Error getting task:", error)
    throw error
  }
}

export const createTask = async (taskData: TaskFormData, userId: string): Promise<Task> => {
  try {
    console.log("Creating task for user:", userId, taskData)

    // Create a proper timestamp for Firestore
    const now = serverTimestamp()
    const dueDateTimestamp = taskData.dueDate ? Timestamp.fromDate(new Date(taskData.dueDate)) : null

    // Ensure status is valid
    const normalizedStatus = normalizeStatus(taskData.status)

    // Debug the data being sent to Firestore
    console.log("Data being sent to Firestore:", {
      ...taskData,
      status: normalizedStatus,
      dueDate: dueDateTimestamp,
      createdAt: now,
      updatedAt: now,
      userId,
    })

    const docRef = await addDoc(collection(db, TASKS_COLLECTION), {
      ...taskData,
      status: normalizedStatus,
      dueDate: dueDateTimestamp,
      createdAt: now,
      updatedAt: now,
      userId,
    })

    console.log("Task created with ID:", docRef.id)

    // Return a properly formatted task object
    return {
      id: docRef.id,
      ...taskData,
      status: normalizedStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId,
      attachments: [],
    } as Task
  } catch (error) {
    console.error("Error creating task:", error)
    throw error
  }
}

export const updateTask = async (taskId: string, taskData: Partial<TaskFormData>): Promise<Task> => {
  try {
    console.log("Updating task:", taskId, taskData)
    const taskRef = doc(db, TASKS_COLLECTION, taskId)
    const taskDoc = await getDoc(taskRef)

    if (!taskDoc.exists()) {
      throw new Error("Task not found")
    }

    const updateData: any = {
      ...taskData,
      updatedAt: serverTimestamp(),
    }

    // Normalize status if it's being updated
    if (taskData.status) {
      updateData.status = normalizeStatus(taskData.status)
    }

    // Convert dueDate to Timestamp if it exists
    if (taskData.dueDate) {
      updateData.dueDate = Timestamp.fromDate(new Date(taskData.dueDate))
    }

    await updateDoc(taskRef, updateData)
    console.log("Task updated:", taskId)

    // Get the updated document
    const updatedTaskDoc = await getDoc(taskRef)
    const data = updatedTaskDoc.data()!

    return convertFirestoreDocToTask(taskId, data)
  } catch (error) {
    console.error("Error updating task:", error)
    throw error
  }
}

export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    console.log("Deleting task:", taskId)
    const taskRef = doc(db, TASKS_COLLECTION, taskId)
    const taskDoc = await getDoc(taskRef)

    if (!taskDoc.exists()) {
      throw new Error("Task not found")
    }

    await deleteDoc(taskRef)
    console.log("Task deleted:", taskId)
  } catch (error) {
    console.error("Error deleting task:", error)
    throw error
  }
}

export const deleteMultipleTasks = async (taskIds: string[]): Promise<void> => {
  try {
    console.log("Deleting multiple tasks:", taskIds)
    const batch = writeBatch(db)

    // First, get all tasks to delete
    for (const taskId of taskIds) {
      const taskRef = doc(db, TASKS_COLLECTION, taskId)
      const taskDoc = await getDoc(taskRef)

      if (taskDoc.exists()) {
        batch.delete(taskRef)
      }
    }

    await batch.commit()
    console.log("Multiple tasks deleted")
  } catch (error) {
    console.error("Error deleting multiple tasks:", error)
    throw error
  }
}

export const updateTaskStatus = async (taskId: string, status: string): Promise<Task> => {
  try {
    console.log("Updating task status:", taskId, status)
    const taskRef = doc(db, TASKS_COLLECTION, taskId)

    // First get the current task data
    const taskDoc = await getDoc(taskRef)
    if (!taskDoc.exists()) {
      throw new Error("Task not found")
    }

    const currentData = taskDoc.data()
    console.log("Current task data:", currentData)

    // Normalize the status
    const normalizedStatus = normalizeStatus(status)

    // Update the task with the new status
    await updateDoc(taskRef, {
      status: normalizedStatus,
      updatedAt: serverTimestamp(),
    })

    console.log("Task status updated:", taskId, normalizedStatus)

    // Get the updated document to return
    const updatedTaskDoc = await getDoc(taskRef)
    if (!updatedTaskDoc.exists()) {
      throw new Error("Updated task not found")
    }

    const data = updatedTaskDoc.data()
    console.log("Updated task data:", data)

    // Return the updated task
    return convertFirestoreDocToTask(taskId, data)
  } catch (error) {
    console.error("Error updating task status:", error)
    throw error
  }
}

// Function to fix all tasks with incorrect status values
export const fixTaskStatuses = async (userId: string): Promise<void> => {
  try {
    console.log("Starting task status fix for user:", userId)

    // Get all tasks for the user
    const tasksQuery = query(collection(db, TASKS_COLLECTION), where("userId", "==", userId))

    const querySnapshot = await getDocs(tasksQuery)
    console.log(`Found ${querySnapshot.docs.length} tasks to check`)

    const batch = writeBatch(db)
    let fixCount = 0

    // Check each task and fix if needed
    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data()
      const status = data.status

      if (!VALID_STATUSES.includes(status)) {
        console.log(`Fixing task ${docSnapshot.id} with invalid status: "${status}"`)
        batch.update(doc(db, TASKS_COLLECTION, docSnapshot.id), {
          status: "todo",
          updatedAt: serverTimestamp(),
        })
        fixCount++
      }
    }

    if (fixCount > 0) {
      await batch.commit()
      console.log(`Fixed ${fixCount} tasks with invalid status values`)
    } else {
      console.log("No tasks needed fixing")
    }
  } catch (error) {
    console.error("Error fixing task statuses:", error)
    throw error
  }
}

// Add this new function to the file
export const updateMultipleTaskStatuses = async (taskIds: string[], status: string): Promise<void> => {
  try {
    console.log("Updating status for multiple tasks:", taskIds, "to", status)
    const batch = writeBatch(db)

    // Normalize the status
    const normalizedStatus = normalizeStatus(status)

    // First, get all tasks to update
    for (const taskId of taskIds) {
      const taskRef = doc(db, TASKS_COLLECTION, taskId)
      const taskDoc = await getDoc(taskRef)

      if (taskDoc.exists()) {
        batch.update(taskRef, {
          status: normalizedStatus,
          updatedAt: serverTimestamp(),
        })
      }
    }

    await batch.commit()
    console.log("Multiple tasks status updated to:", normalizedStatus)
  } catch (error) {
    console.error("Error updating multiple task statuses:", error)
    throw error
  }
}

