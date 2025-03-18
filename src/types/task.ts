export type TaskStatus = "todo" | "inProgress" | "completed"
export type TaskCategory = "work" | "personal"

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  category: TaskCategory
  dueDate: string | null
  createdAt: string
  updatedAt: string
  userId: string
  attachments?: string[]
}

export interface TaskFormData {
  title: string
  description: string
  status: TaskStatus
  category: TaskCategory
  dueDate: string | null
}

