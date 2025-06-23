import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">
              Help
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">
              Support
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">
              Privacy
            </a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center md:text-left text-base text-gray-500">
              &copy; 2025 BookIssue Tracker System. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
