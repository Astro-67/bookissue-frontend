import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { 
  RiUserAddLine,
  RiTeamLine,
  RiShieldUserLine,
  RiEditLine,
  RiDeleteBinLine,
  RiEyeLine
} from 'react-icons/ri'

function SuperAdminStaff() {
  const [selectedRole, setSelectedRole] = useState<string>('all')

  // Mock staff data - this would come from an API
  const staffMembers = [
    {
      id: 1,
      email: 'alice.smith@university.edu',
      first_name: 'Alice',
      last_name: 'Smith',
      role: 'staff',
      department: 'Library Services',
      permissions: ['manage_tickets', 'view_reports'],
      is_active: true,
      last_login: '2024-01-20T10:30:00Z'
    },
    {
      id: 2,
      email: 'mike.taylor@university.edu',
      first_name: 'Mike',
      last_name: 'Taylor',
      role: 'ict',
      department: 'IT Services',
      permissions: ['manage_tickets', 'assign_tickets', 'manage_users'],
      is_active: true,
      last_login: '2024-01-20T14:15:00Z'
    },
    {
      id: 3,
      email: 'sarah.jones@university.edu',
      first_name: 'Sarah',
      last_name: 'Jones',
      role: 'staff',
      department: 'Library Services',
      permissions: ['manage_tickets'],
      is_active: false,
      last_login: '2024-01-18T09:00:00Z'
    }
  ]

  const filteredStaff = selectedRole === 'all' 
    ? staffMembers 
    : staffMembers.filter(s => s.role === selectedRole)

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'staff':
        return RiTeamLine
      case 'ict':
        return RiShieldUserLine
      default:
        return RiTeamLine
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'staff':
        return 'bg-green-100 text-green-800'
      case 'ict':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="mt-2 text-gray-600">
            Manage staff members, their roles, and permissions
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RiUserAddLine className="mr-2 h-4 w-4" />
            Add New Staff Member
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <RiTeamLine className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Staff
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {staffMembers.filter(s => s.role === 'staff').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <RiShieldUserLine className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    ICT Staff
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {staffMembers.filter(s => s.role === 'ict').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {staffMembers.filter(s => s.is_active).length}
                  </span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    of {staffMembers.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Table */}
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
                <option value="staff">Library Staff</option>
                <option value="ict">ICT Staff</option>
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Search Staff
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

        {/* Staff Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role & Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff.map((staff) => {
                const RoleIcon = getRoleIcon(staff.role)
                return (
                  <tr key={staff.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {staff.first_name[0]}{staff.last_name[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {staff.first_name} {staff.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {staff.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <RoleIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(staff.role)}`}>
                            {staff.role.toUpperCase()}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">
                            {staff.department}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {staff.permissions.map((permission) => (
                          <span
                            key={permission}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-1 mb-1"
                          >
                            {permission.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        staff.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {staff.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(staff.last_login).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <RiEyeLine className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
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

        {filteredStaff.length === 0 && (
          <div className="px-6 py-12 text-center">
            <RiTeamLine className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No staff found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No staff members match the selected criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/super-admin/staff')({
  component: SuperAdminStaff,
})
