import React, { useState, useEffect } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { 
  RiDashboardLine, 
  RiTicketLine, 
  RiUserLine, 
  RiTeamLine, 
  RiGroupLine,
} from 'react-icons/ri'
import { Header } from './Header'
import { Footer } from './Footer'
import { Sidebar } from './Sidebar'
import { useAuth } from '../contexts/AuthContext'

interface SharedLayoutProps {
  role: 'student' | 'staff' | 'ict' | 'super_admin'
  children: React.ReactNode
}

// Role configuration with navigation and styling
const roleConfig = {
  student: {
    title: 'Student Portal',
    navigation: [
      { name: 'Dashboard', href: '/student/dashboard', icon: RiDashboardLine },
      { name: 'My Issues', href: '/student/tickets', icon: RiTicketLine },
      { name: 'Profile', href: '/student/profile', icon: RiUserLine },
    ],
    user: {
      name: 'John Doe',
      id: '2024001',
      avatar: 'JD'
    }
  },
  staff: {
    title: 'Staff Portal',
    navigation: [
      { name: 'Dashboard', href: '/staff/dashboard', icon: RiDashboardLine },
      { name: 'My Issues', href: '/staff/tickets', icon: RiTicketLine },
      { name: 'Profile', href: '/staff/profile', icon: RiUserLine },
    ],
    user: {
      name: 'Alice Smith',
      id: 'Library Staff',
      avatar: 'AS'
    }
  },
  ict: {
    title: 'ICT Staff',
    navigation: [
      { name: 'Dashboard', href: '/ict/dashboard', icon: RiDashboardLine },
      { name: 'All Issues', href: '/ict/tickets', icon: RiTicketLine },
      { name: 'My Assigned', href: '/ict/assigned-tickets', icon: RiTeamLine },
      { name: 'Profile', href: '/ict/profile', icon: RiUserLine },
    ],
    user: {
      name: 'Mike Taylor',
      id: 'ICT Administrator',
      avatar: 'MT'
    }
  },
  super_admin: {
    title: 'Super Admin Portal',
    navigation: [
      { name: 'Dashboard', href: '/super-admin/dashboard', icon: RiDashboardLine },
      { name: 'All Tickets', href: '/super-admin/tickets', icon: RiTicketLine },
      { name: 'User Management', href: '/super-admin/users', icon: RiGroupLine },
      { name: 'Profile', href: '/super-admin/profile', icon: RiUserLine },
    ],
    user: {
      name: 'System Administrator',
      id: 'Super Admin',
      avatar: 'SA'
    }
  }
}

export const SharedLayout: React.FC<SharedLayoutProps> = ({ role, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouterState()
  const { logout, user } = useAuth()
  const config = roleConfig[role]

  // Check if the user's role matches the current route
  useEffect(() => {
    if (user && user.role !== role) {
      // If user role doesn't match the route, redirect to correct dashboard
      // Convert super_admin to super-admin for routing
      const routeRole = user.role === 'super_admin' ? 'super-admin' : user.role
      window.location.href = `/${routeRole}/dashboard`;
    }
  }, [user, role]);

  const isActive = (href: string) => {
    return router.location.pathname === href
  }

  const handleSignOut = () => {
    logout()
  }

  // Use actual user data if available, fallback to role config
  const displayUser = user ? {
    name: user.full_name || `${user.first_name} ${user.last_name}`,
    id: user.student_id || user.email,
    avatar: user.first_name?.[0]?.toUpperCase() + (user.last_name?.[0]?.toUpperCase() || ''),
  } : config.user;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sidebar */}
      <Sidebar
        title={config.title}
        navigation={config.navigation}
        user={displayUser}
        sidebarOpen={sidebarOpen}
        onSidebarClose={() => setSidebarOpen(false)}
        isActive={isActive}
        onSignOut={handleSignOut}
      />

      {/* Main content wrapper */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top header */}
        <Header
          title={config.title}
          userName={displayUser.name}
          userAvatar={displayUser.avatar}
          role={role}
          onMobileMenuToggle={() => setSidebarOpen(true)}
          onLogout={handleSignOut}
        />

        {/* Main content area */}
        <main className="flex-1 bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>

        {/* Sticky Footer */}
        <Footer />
      </div>
    </div>
  )
}
