"use client"

import { Fragment } from "react"
import { Menu, Transition } from "@headlessui/react"
import { useAuth } from "../hooks/useAuth"
import { FiSearch, FiList, FiGrid, FiX, FiLogOut, FiChevronDown } from "react-icons/fi"

interface HeaderProps {
  view: "list" | "board"
  setView: (view: "list" | "board") => void
  onCreateTask: () => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: "all" | "work" | "personal"
  setSelectedCategory: (category: "all" | "work" | "personal") => void
  selectedDueDate: "all" | "today" | "week" | "month"
  setSelectedDueDate: (dueDate: "all" | "today" | "week" | "month") => void
}

const Header = ({
  view,
  setView,
  onCreateTask,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedDueDate,
  setSelectedDueDate,
}: HeaderProps) => {
  const { user, signOut } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
      console.log("User logged out successfully")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 pb-2 rounded-b-lg shadow-sm">
      <div className="container mx-auto px-4">
        {/* First row: Logo and Profile */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
            >
              <rect width="24" height="24" rx="4" fill="#6366F1" />
              <path
                d="M16 9L10.5 14.5L8 12"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h1 className="text-lg font-medium">TaskBuddy</h1>
          </div>

          <div className="flex items-center">
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-2 rounded-full hover:bg-gray-100 p-1 transition-colors">
                {user?.photoURL ? (
                  <img className="h-8 w-8 rounded-full" src={user.photoURL || "/placeholder.svg"} alt="User profile" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </div>
                )}
                <span className="ml-2 text-sm font-medium hidden md:block">{user?.displayName || user?.email}</span>
                <FiChevronDown className="h-4 w-4 text-gray-500 hidden md:block" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-gray-100" : ""
                        } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                        onClick={handleLogout}
                      >
                        <FiLogOut className="mr-2 h-4 w-4" />
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>

        {/* Second row: View Switcher */}
        <div className="flex items-center mb-3">
          <div className="flex border border-gray-200 rounded-md overflow-hidden">
            <button
              className={`px-3 py-1.5 text-sm ${view === "list" ? "bg-gray-100 font-medium" : "bg-white"}`}
              onClick={() => setView("list")}
            >
              <FiList className="inline mr-1" />
              List
            </button>
            <button
              className={`px-3 py-1.5 text-sm ${view === "board" ? "bg-gray-100 font-medium" : "bg-white"}`}
              onClick={() => setView("board")}
            >
              <FiGrid className="inline mr-1" />
              Board
            </button>
          </div>
        </div>

        {/* Third row: Filters, Search, and Add Task */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-500">Filter by:</div>
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center px-2 py-1 text-sm border border-gray-300 rounded-md">
                <span>Category</span>
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-0 z-10 mt-1 w-40 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active || selectedCategory === "all" ? "bg-gray-100" : ""
                          } block w-full text-left px-4 py-2 text-sm rounded-md`}
                          onClick={() => setSelectedCategory("all")}
                        >
                          All
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active || selectedCategory === "work" ? "bg-gray-100" : ""
                          } block w-full text-left px-4 py-2 text-sm rounded-md`}
                          onClick={() => setSelectedCategory("work")}
                        >
                          Work
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active || selectedCategory === "personal" ? "bg-gray-100" : ""
                          } block w-full text-left px-4 py-2 text-sm rounded-md`}
                          onClick={() => setSelectedCategory("personal")}
                        >
                          Personal
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center px-2 py-1 text-sm border border-gray-300 rounded-md">
                <span>Due Date</span>
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-0 z-10 mt-1 w-40 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active || selectedDueDate === "all" ? "bg-gray-100" : ""
                          } block w-full text-left px-4 py-2 text-sm rounded-md`}
                          onClick={() => setSelectedDueDate("all")}
                        >
                          All
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active || selectedDueDate === "today" ? "bg-gray-100" : ""
                          } block w-full text-left px-4 py-2 text-sm rounded-md`}
                          onClick={() => setSelectedDueDate("today")}
                        >
                          Today
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active || selectedDueDate === "week" ? "bg-gray-100" : ""
                          } block w-full text-left px-4 py-2 text-sm rounded-md`}
                          onClick={() => setSelectedDueDate("week")}
                        >
                          This Week
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active || selectedDueDate === "month" ? "bg-gray-100" : ""
                          } block w-full text-left px-4 py-2 text-sm rounded-md`}
                          onClick={() => setSelectedDueDate("month")}
                        >
                          This Month
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-8 py-1.5 w-full md:w-64 border border-gray-300 rounded-md text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearchQuery("")}
                >
                  <FiX className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <button
              className="flex items-center px-4 py-1.5 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
              onClick={onCreateTask}
            >
              ADD TASK
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

