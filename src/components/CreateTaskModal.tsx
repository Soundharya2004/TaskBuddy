"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog } from "@headlessui/react"
import { FiX, FiCalendar, FiBold, FiItalic, FiList, FiAlignLeft } from "react-icons/fi"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import type { TaskFormData, TaskStatus } from "../types/task"

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateTask: (taskData: TaskFormData) => void
  initialStatus?: TaskStatus
}

const CreateTaskModal = ({ isOpen, onClose, onCreateTask, initialStatus = "todo" }: CreateTaskModalProps) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<TaskStatus>(initialStatus)
  const [category, setCategory] = useState<"work" | "personal">("work")
  const [dueDate, setDueDate] = useState<Date | null>(null)

  // Update status when initialStatus changes
  useEffect(() => {
    setStatus(initialStatus)
  }, [initialStatus])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!title.trim()) {
      alert("Please enter a task title")
      return
    }

    console.log("Creating task with data:", {
      title,
      description,
      status,
      category,
      dueDate: dueDate ? dueDate.toISOString() : null,
    })

    const taskData: TaskFormData = {
      title,
      description,
      status,
      category,
      dueDate: dueDate ? dueDate.toISOString() : null,
    }

    onCreateTask(taskData)

    // Reset form
    setTitle("")
    setDescription("")
    setStatus(initialStatus)
    setCategory("work")
    setDueDate(null)
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-0 md:p-4">
        <Dialog.Panel className="w-full h-full md:h-auto md:max-w-md md:rounded-lg bg-white md:shadow-xl overflow-auto">
          <div className="sticky top-0 bg-white z-10 p-4 border-b flex items-center justify-between">
            <Dialog.Title className="text-lg font-medium text-gray-900">Create Task</Dialog.Title>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 rounded-full p-1 hover:bg-gray-100"
              onClick={onClose}
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4">
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Task title"
                  className="w-full border-0 border-b border-gray-200 pb-2 focus:border-primary focus:ring-0 text-lg font-medium"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <textarea
                  placeholder="Description"
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

              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Status*</label>
                <select
                  className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
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
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                onClick={onClose}
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
              >
                CREATE
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default CreateTaskModal

