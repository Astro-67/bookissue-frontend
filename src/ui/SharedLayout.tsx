import React, { useState } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { 
  RiDashboardLine, 
  RiTicketLine, 
  RiAddLine, 
  RiUserLine, 
  RiTeamLine, 
  RiBookLine, 
  RiBarChartBoxLine, 
  RiAlertLine, 
  RiGroupLine, 
  RiSettingsLine
} from 'react-icons/ri'
import { Header } from './Header'
import { Footer } from './Footer'
import { Sidebar } from './Sidebar'

interface SharedLayoutProps {
  role: 'student' | 'staff' | 'ict'
  children: React.ReactNode
}

// Role configuration with navigation and styling
const roleConfig = {
  student: {
    title: 'Student Portal',
    navigation: [
      { name: 'Dashboard', href: '/student/dashboard', icon: RiDashboardLine },
      { name: 'My Issues', href: '/student/tickets', icon: RiTicketLine },
      { name: 'Submit Issue', href: '/student/tickets/new', icon: RiAddLine },
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
      { name: 'All Issues', href: '/staff/tickets', icon: RiTicketLine },
      { name: 'My Assigned', href: '/staff/tickets/assigned', icon: RiTeamLine },
      { name: 'Book Management', href: '/staff/books', icon: RiBookLine },
      { name: 'Reports', href: '/staff/reports', icon: RiBarChartBoxLine },
    ],
    user: {
      name: 'Alice Smith',
      id: 'Library Staff',
      avatar: 'AS'
    }
  },
  ict: {
    title: 'ICT Admin',
    navigation: [
      { name: 'Dashboard', href: '/ict/dashboard', icon: RiDashboardLine },
      { name: 'All Issues', href: '/ict/tickets', icon: RiTicketLine },
      { name: 'Critical Issues', href: '/ict/tickets/critical', icon: RiAlertLine },
      { name: 'User Management', href: '/ict/users', icon: RiGroupLine },
      { name: 'System Settings', href: '/ict/settings', icon: RiSettingsLine },
      { name: 'Analytics', href: '/ict/analytics', icon: RiBarChartBoxLine },
    ],
    user: {
      name: 'Mike Taylor',
      id: 'ICT Administrator',
      avatar: 'MT'
    }
  }
}

export const SharedLayout: React.FC<SharedLayoutProps> = ({ role, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouterState()
  const config = roleConfig[role]

  const isActive = (href: string) => {
    return router.location.pathname === href
  }

  const handleSignOut = () => {
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        title={config.title}
        navigation={config.navigation}
        user={config.user}
        sidebarOpen={sidebarOpen}
        onSidebarClose={() => setSidebarOpen(false)}
        isActive={isActive}
        onSignOut={handleSignOut}
      />

      {/* Main content wrapper */}
      <div className="lg:pl-64">
        {/* Top header */}
        <Header
          title={config.title}
          userName={config.user.name}
          userAvatar={config.user.avatar}
          onMobileMenuToggle={() => setSidebarOpen(true)}
        />

        {/* Main content area */}
        <main className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}
