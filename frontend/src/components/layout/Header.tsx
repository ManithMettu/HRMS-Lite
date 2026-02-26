import React from 'react'
import { User, LogOut, Home, ChevronRight, Menu } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSidebar } from '@context/SidebarContext'
import { useAuth } from '@hooks/useAuth'
import { Button } from '@components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu'

const Header: React.FC = () => {
  const { isExpanded, isMobile, toggleSidebar } = useSidebar()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean)

    if (paths.length === 0) {
      return (
        <div className="flex items-center gap-2">
          <Home size={18} className="text-secondary-900" />
          {!isMobile && <span className="text-sm font-medium text-secondary-900">Dashboard</span>}
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-secondary-900 hover:text-white transition-all duration-200 group"
        >
          <Home size={18} className="text-secondary-900 group-hover:text-white transition-colors" />
          {!isMobile && <span className="text-sm font-medium">Home</span>}
        </button>

        {paths.map((path, index) => {
          // Capitalize first letter and format the path
          const formattedPath = path
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')

          // Build the cumulative path for navigation
          const cumulativePath = '/' + paths.slice(0, index + 1).join('/')

          if (isMobile && index < paths.length - 1) return null

          return (
            <React.Fragment key={path}>
              <ChevronRight size={14} className="text-muted-foreground" />
              {index === paths.length - 1 ? (
                <span className="text-sm font-semibold text-secondary-900 truncate max-w-[120px] px-2">
                  {formattedPath}
                </span>
              ) : (
                <button
                  onClick={() => navigate(cumulativePath)}
                  className="text-sm text-muted-foreground hover:bg-secondary-900 hover:text-white px-2 py-1 rounded-lg transition-all duration-200 whitespace-nowrap"
                >
                  {formattedPath}
                </button>
              )}
            </React.Fragment>
          )
        })}
      </div>
    )
  }

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-background border-b border-border flex items-center justify-between px-4 md:px-6 shadow-sm z-40 transition-all duration-300 ${isMobile ? 'left-0' : isExpanded ? 'left-[260px]' : 'left-[76px]'
        }`}
    >
      {/* Left section - Menu Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-1 hover:bg-secondary-900 hover:text-white group transition-all duration-200"
          >
            <Menu size={20} className="group-hover:text-white" />
          </Button>
        )}
        <div className="flex items-center gap-4">
          {generateBreadcrumbs()}
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-secondary-900 group transition-all duration-200"
            >
              <div className="w-8 h-8 bg-secondary-900/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <User size={16} className="text-secondary-900 group-hover:text-white" />
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-display">
              <div className="flex flex-col space-y-1 text-ellipsis overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.full_name || user?.username}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200 cursor-pointer"
            >
              <LogOut size={16} className="mr-2" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default Header