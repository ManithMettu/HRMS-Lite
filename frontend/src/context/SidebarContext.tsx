import React, { createContext, useContext, useState, useEffect } from 'react'

interface SidebarContextType {
  isExpanded: boolean
  isMobile: boolean
  toggleSidebar: () => void
  collapseSidebar: () => void
  expandSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false)
  const [isExpanded, setIsExpanded] = useState(() => {
    // Check localStorage for saved state, default to true
    const saved = localStorage.getItem('sidebar-expanded')
    return saved !== null ? JSON.parse(saved) : true
  })

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setIsExpanded(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Save state to localStorage whenever it changes, but only if not on mobile
    if (!isMobile) {
      localStorage.setItem('sidebar-expanded', JSON.stringify(isExpanded))
    }
  }, [isExpanded, isMobile])

  const toggleSidebar = () => setIsExpanded((prev: boolean) => !prev)
  const collapseSidebar = () => setIsExpanded(false)
  const expandSidebar = () => setIsExpanded(true)

  return (
    <SidebarContext.Provider value={{ isExpanded, isMobile, toggleSidebar, collapseSidebar, expandSidebar }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
