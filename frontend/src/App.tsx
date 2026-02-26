
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@context/AuthContext'
import { SidebarProvider } from '@context/SidebarContext'
import ErrorBoundary from '@components/common/ErrorBoundary'
import ProtectedRoute from '@components/ProtectedRoute'
import MainLayout from '@components/layout/MainLayout'
import Login from '@pages/Login'
import Dashboard from '@pages/Dashboard'
import Employees from '@pages/Employees'
import Attendance from '@pages/Attendance'

import NotFound from '@pages/NotFound'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <SidebarProvider>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<Dashboard />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/attendance" element={<Attendance />} />

                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </SidebarProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App
