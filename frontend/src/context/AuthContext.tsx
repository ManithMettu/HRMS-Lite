import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, AuthResponse } from '../types/index'
import { AuthService } from '@lib/api/index'

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string, fullName: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      try {
        const response = await AuthService.getCurrentUser()
        setUser(response)
        setToken(storedToken)
      } catch (error) {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
      }
    }
    setIsLoading(false)
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Normal API login
      const response = await AuthService.login({ email, password })
      const data: AuthResponse = response

      localStorage.setItem('token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
      setToken(data.access_token)
      if (data.user) {
        setUser(data.user)
      } else {
        // If user data is not in login response, fetch it
        await checkAuth()
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, username: string, password: string, fullName: string) => {
    setIsLoading(true)
    try {
      const response = await AuthService.register({ email, username, password, full_name: fullName })
      const data: User = response
      setUser(data)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
