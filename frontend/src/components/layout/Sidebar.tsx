import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {

  Home,
  Users,
  Calendar,
  ChevronLeft,

} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSidebar } from '@context/SidebarContext'


const Sidebar: React.FC = () => {
  const { isExpanded, isMobile, toggleSidebar, collapseSidebar } = useSidebar()
  const location = useLocation()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/employees', label: 'Employees', icon: Users },
    { path: '/attendance', label: 'Attendance', icon: Calendar },
  ]

  const isActive = (path: string) => location.pathname === path

  const sidebarVariants = {
    expanded: { x: 0, width: 260 },
    collapsed: { x: isMobile ? -260 : 0, width: isMobile ? 260 : 76 },
  }

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobile && isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={collapseSidebar}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[45]"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={isExpanded ? 'expanded' : 'collapsed'}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`sidebar-container fixed left-0 top-0 h-screen flex flex-col z-50 ${isMobile ? 'shadow-2xl' : ''
          }`}
      >
        {/* Gradient Background Layer */}
        <div className="absolute inset-0 sidebar-gradient" />

        {/* Glassmorphism Overlay */}
        <div className="absolute inset-0 sidebar-glass" />

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 sidebar-pattern opacity-[0.03]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">

          {/* ── Logo & Toggle ── */}
          <div className="flex items-center h-[72px] px-5 border-b border-white/[0.08]">
            <div className="flex items-center gap-3 flex-1 min-w-0">

              <AnimatePresence>
                {(isExpanded || isMobile) && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <h1 className="text-[15px] font-bold text-white tracking-wide font-display">
                      HRMS
                    </h1>
                    <p className="text-[10px] text-blue-300/70 font-medium tracking-widest uppercase">
                      Lite
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleSidebar}
              className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center transition-colors flex-shrink-0"
              title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <motion.div
                animate={{ rotate: isExpanded ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronLeft size={16} className="text-white/60" />
              </motion.div>
            </motion.button>
          </div>

          {/* ── Navigation ── */}
          <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto sidebar-scrollbar">
            <AnimatePresence>
              {(isExpanded || isMobile) && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em] px-3 mb-3"
                >
                  Main Menu
                </motion.p>
              )}
            </AnimatePresence>

            {navItems.map(({ path, label, icon: Icon }) => {
              const active = isActive(path)
              const showLabel = isExpanded || isMobile
              return (
                <Link
                  key={path}
                  to={path}
                  onMouseEnter={() => !isMobile && setHoveredItem(path)}
                  onMouseLeave={() => !isMobile && setHoveredItem(null)}
                  onClick={() => isMobile && collapseSidebar()}
                  className={`sidebar-nav-item group relative flex items-center gap-3 rounded-xl transition-all duration-200 ${showLabel ? 'px-3 py-2.5' : 'px-0 py-2.5 justify-center'
                    } ${active
                      ? 'sidebar-nav-active'
                      : 'hover:bg-white/[0.06]'
                    }`}
                >
                  {/* Active indicator bar */}
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-gradient-to-b from-blue-400 to-violet-400 rounded-r-full"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}

                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 flex-shrink-0 ${active
                      ? 'bg-gradient-to-br from-blue-500/20 to-violet-500/20 text-blue-400 shadow-sm shadow-blue-500/10'
                      : 'text-white/50 group-hover:text-white/80'
                      }`}
                  >
                    <Icon size={20} />
                  </motion.div>

                  {/* Label */}
                  <AnimatePresence>
                    {showLabel && (
                      <motion.span
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.15 }}
                        className={`text-[13px] font-medium whitespace-nowrap ${active ? 'text-white' : 'text-white/50 group-hover:text-white/80'
                          }`}
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Tooltip (collapsed state) */}
                  {!showLabel && hoveredItem === path && (
                    <motion.div
                      initial={{ opacity: 0, x: -4, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg shadow-xl shadow-black/30 pointer-events-none z-[100] whitespace-nowrap border border-white/10"
                    >
                      {label}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45 border-l border-b border-white/10" />
                    </motion.div>
                  )}
                </Link>
              )
            })}
          </nav>

        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar
