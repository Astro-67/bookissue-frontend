import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { 
  RiUserAddLine,
  RiUserLine,
  RiDeleteBinLine,
  RiEditLine,
  RiShieldUserLine,
  RiTeamLine,
  RiUserStarLine
} from 'react-icons/ri'

function SuperAdminUsers() {
  const [selectedRole, setSelectedRole] = useState<string>('all')

  // Mock users data - this would come from an API
  const users = [
    {
      id: 1,
      email: 'john.doe@university.edu',
      first_name: 'John',
      last_name: 'Doe',
      role: 'student',
      student_id: 'STU001',
      department: 'Computer Science',
      is_active: true,
      created_at: '2024-01-15'
    },
    {
      id: 2,
      email: 'alice.smith@university.edu',
      first_name: 'Alice',
      last_name: 'Smith',
      role: 'staff',
      department: 'Library',
      is_active: true,
      created_at: '2024-01-10'
    },
    {
      id: 3,
      email: 'mike.taylor@university.edu',
      first_name: 'Mike',
      last_name: 'Taylor',
      role: 'ict',
      department: 'IT Services',
      is_active: true,
      created_at: '2024-01-05'
    }
  ]

  const filteredUsers = selectedRole === 'all' 
    ? users 
    : users.filter(u => u.role === selectedRole)

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student':
        return RiUserLine
      case 'staff':
        return RiTeamLine
      case 'ict':
        return RiShieldUserLine
      case 'super_admin':
        return RiUserStarLine
      default:
        return RiUserLine
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'student':
        return 'bg-blue-100 text-blue-800'
      case 'staff':
        return 'bg-green-100 text-green-800'
      case 'ict':
        return 'bg-purple-100 text-purple-800'
      case 'super_admin':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-2 text-gray-600">
            Manage all system users, roles, and permissions
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RiUserAddLine className="mr-2 h-4 w-4" />
            Add New User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700">
                Filter by Role
              </label>
              <select
                id="role-filter"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="staff">Staff</option>
                <option value="ict">ICT</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Search Users
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by name or email..."
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const RoleIcon = getRoleIcon(user.role)
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.first_name[0]}{user.last_name[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                          {user.student_id && (
                            <div className="text-xs text-gray-400">
                              ID: {user.student_id}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <RoleIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                          {user.role.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.department || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <RiEditLine className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <RiDeleteBinLine className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="px-6 py-12 text-center">
            <RiUserLine className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No users match the selected criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/super-admin/users')({
  component: SuperAdminUsers,
})
