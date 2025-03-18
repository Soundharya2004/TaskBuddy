"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog } from "@headlessui/react"
import { FiX, FiCalendar, FiBold, FiItalic, FiList, FiAlignLeft } from "react-icons/fi"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import type { Task, TaskFormData } from "../types/task"
import { format } from "date-fns"

interface EditTaskModalProps {
  isOpen: boolean
  onClose: () => void
  task: Task
  onUpdateTask: (taskId: string, taskData: Partial<TaskFormData>) => void
  onDeleteTask: (taskId: string) => void
}

const EditTaskModal = ({ isOpen, onClose, task, onUpdateTask, onDeleteTask }: EditTaskModalProps) => {
  const [activeTab, setActiveTab] = useState<"details" | "activity">("details")
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const [status, setStatus] = useState(task.status)
  const [category, setCategory] = useState(task.category)
  const [dueDate, setDueDate] = useState<Date | null>(task.dueDate ? new Date(task.dueDate) : null)

  useEffect(() => {
    setTitle(task.title)
    setDescription(task.description)
    setStatus(task.status)
    setCategory(task.category)
    setDueDate(task.dueDate ? new Date(task.dueDate) : null)
  }, [task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const taskData: Partial<TaskFormData> = {
      title,
      description,
      status,
      category,
      dueDate: dueDate ? dueDate.toISOString() : null,
    }

    onUpdateTask(task.id, taskData)
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      onDeleteTask(task.id)
    }
  }

  // Mock activity data - in a real app, this would come from the task history
  const activities = [
    { action: "You created this task", timestamp: new Date(task.createdAt) },
    { action: `You changed status from in progress to complete`, timestamp: new Date(task.updatedAt) },
  ]

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-0 md:p-4">
        <Dialog.Panel className="w-full h-full md:h-auto md:max-w-md md:rounded-lg bg-white md:shadow-xl overflow-auto">
          <div className="sticky top-0 bg-white z-10 p-4 border-b flex items-center justify-between">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 rounded-full p-1 hover:bg-gray-100"
              onClick={onClose}
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          <div className="flex border-b">
            <button
              className={`flex-1 py-2 text-center text-sm font-medium ${
                activeTab === "details" ? "border-b-2 border-primary text-primary" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("details")}
            >
              DETAILS
            </button>
            <button
              className={`flex-1 py-2 text-center text-sm font-medium ${
                activeTab === "activity" ? "border-b-2 border-primary text-primary" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("activity")}
            >
              ACTIVITY
            </button>
          </div>

          {activeTab === "details" ? (
            <form onSubmit={handleSubmit} className="p-4">
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    className="w-full border-0 border-b border-gray-200 pb-2 focus:border-primary focus:ring-0 text-lg font-medium"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <textarea
                    rows={3}
                    className="w-full border-0 focus:ring-0 text-sm text-gray-700 resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />

                  <div className="flex items-center border-t pt-2">
                    <button
                      type="button"
                      className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                    >
                      <FiBold className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                    >
                      <FiItalic className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                    >
                      <FiList className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                    >
                      <FiAlignLeft className="h-4 w-4" />
                    </button>
                    <div className="ml-auto text-xs text-gray-400">{description.length}/1000 characters</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task Category*</label>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      className={`px-3 py-1 text-sm rounded-full ${
                        category === "work" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"
                      }`}
                      onClick={() => setCategory("work")}
                    >
                      Work
                    </button>
                    <button
                      type="button"
                      className={`px-3 py-1 text-sm rounded-full ${
                        category === "personal" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"
                      }`}
                      onClick={() => setCategory("personal")}
                    >
                      Personal
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due on*</label>
                  <div className="relative">
                    <DatePicker
                      selected={dueDate}
                      onChange={(date) => setDueDate(date)}
                      className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm"
                      placeholderText="DD/MM/YYYY"
                      dateFormat="dd/MM/yyyy"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FiCalendar className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task Status*</label>
                  <select
                    className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                  >
                    <option value="todo">To Do</option>
                    <option value="inProgress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-600 rounded-md hover:bg-red-50"
                  onClick={handleDelete}
                >
                  DELETE
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  onClick={onClose}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                >
                  UPDATE
                </button>
              </div>
            </form>
          ) : (
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-4">You created this task</h3>

              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div className="text-sm text-gray-700">{activity.action}</div>
                    <div className="text-xs text-gray-500">{format(activity.timestamp, "MMM dd, yyyy h:mm a")}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default EditTaskModal

