import { FiSearch } from "react-icons/fi"

interface EmptyStateProps {
  message: string
  suggestion: string
  isSearchResult?: boolean
}

const EmptyState = ({ message, suggestion, isSearchResult = false }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow">
      <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        {isSearchResult ? (
          <FiSearch className="h-12 w-12 text-gray-400" />
        ) : (
          <div className="h-12 w-12 text-gray-400">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="4" fill="#F3F4F6" />
              <path
                d="M12 8V16M8 12H16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{message}</h3>
      <p className="text-sm text-gray-500">{suggestion}</p>
    </div>
  )
}

export default EmptyState

