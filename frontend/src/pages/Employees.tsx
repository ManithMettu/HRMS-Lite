import React, { useState, useEffect } from 'react'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Filter,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { motion } from 'framer-motion'
import EmployeeForm from '@components/employees/EmployeeForm'
import { EmployeeService, Employee } from '@lib/api/index'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu'

// Department badge colors
const deptColors: Record<string, string> = {
  IT: 'bg-blue-50 text-blue-700 border-blue-200',
  HR: 'bg-violet-50 text-violet-700 border-violet-200',
  Finance: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Sales: 'bg-amber-50 text-amber-700 border-amber-200',
  Marketing: 'bg-rose-50 text-rose-700 border-rose-200',
}

const getDeptColor = (dept: string) => deptColors[dept] || 'bg-gray-50 text-gray-700 border-gray-200'

// Pagination Component
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between sm:justify-end gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 rounded-lg bg-gray-100 text-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum: number
          if (totalPages <= 5) {
            pageNum = i + 1
          } else if (currentPage <= 3) {
            pageNum = i + 1
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i
          } else {
            pageNum = currentPage - 2 + i
          }

          return (
            <button
              key={i}
              onClick={() => onPageChange(pageNum)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                ? 'bg-secondary-900 text-white'
                : 'text-secondary-600 hover:bg-gray-100'
                }`}
            >
              {pageNum}
            </button>
          )
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 rounded-lg bg-gray-100 text-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}

// Employees Page
const Employees: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [activeFilter, setActiveFilter] = useState<string>('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<string[]>(['All'])
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    fetchEmployees()
  }, [currentPage, searchTerm, activeFilter])

  const fetchEmployees = async () => {
    try {
      const dep_res = await EmployeeService.getDepartments()
      setDepartments(['All', ...dep_res.map(d => d.name)])

      const data = await EmployeeService.getEmployees({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        department: activeFilter === 'All' ? undefined : activeFilter
      })
      setEmployees(data.data || [])
      setTotalPages(data.totalPages || 0)
    } catch (error) {
      console.error('Failed to fetch employees', error)
    }
  }



  const handleSaveEmployee = async (data: any) => {
    try {
      if (selectedEmployee?.id) {
        await EmployeeService.updateEmployee(selectedEmployee.id, data)
      } else {
        await EmployeeService.createEmployee(data)
      }
      setShowForm(false)
      fetchEmployees()
    } catch (error) {
      console.error('Failed to save employee:', error)
      // Ideally show a toast notification here
    }
  }

  const handleDeleteEmployee = async (id: string | number) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      try {
        await EmployeeService.deleteEmployee(id)
        fetchEmployees()
      } catch (error) {
        console.error('Failed to delete employee:', error)
      }
    }
  }

  const currentItems = employees // Backed by remote pagination now

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, activeFilter])


  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1.5 h-6 md:w-2 md:h-8 rounded-full bg-gradient-to-b from-blue-500 to-violet-500" />
            <h1 className="text-2xl md:text-3xl font-display font-bold text-secondary-900">Employees</h1>
          </div>
          <p className="text-secondary-500 ml-4 md:ml-5 text-[14px] md:text-[15px]">Manage your employee database</p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
          <Button
            onClick={() => { setSelectedEmployee(null); setShowForm(true) }}
            size="lg"
            className="w-full sm:w-auto bg-secondary-900 hover:bg-secondary-800 shadow-md shadow-secondary-900/20 text-white rounded-xl px-6 transition-all duration-200"
          >
            <Plus size={18} className="mr-2" />
            Add Employee
          </Button>
        </motion.div>
      </motion.div>

      {/* ── Search & Filter Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="bg-white rounded-2xl border border-gray-100 p-4"
      >
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-300" />
            <Input
              type="text"
              placeholder="Search by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-colors"
            />
          </div>

          {/* Department filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <Filter size={15} className="text-secondary-300 flex-shrink-0" />
            {departments.map(dept => (
              <button
                key={dept}
                onClick={() => setActiveFilter(dept)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${activeFilter === dept
                  ? 'bg-secondary-900 text-white shadow-sm'
                  : 'bg-gray-100 text-secondary-500 hover:bg-gray-200'
                  }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Employee Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
      >
        <div className="overflow-x-auto sidebar-scrollbar">
          <div className="min-w-[800px]">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-gray-50/80 border-b border-gray-100 text-[11px] font-semibold text-secondary-400 uppercase tracking-wider">
              <div className="col-span-3">Employee</div>
              <div className="col-span-3">Email</div>
              <div className="col-span-2">Department</div>
              <div className="col-span-2">Position</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {/* Table body */}
            <div className="divide-y divide-gray-50">
              {currentItems.length > 0 ? (
                currentItems.map((emp, i) => (
                  <motion.div
                    key={emp.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                    className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50/50 transition-colors group"
                  >
                    <div className="col-span-3">
                      <p className="text-sm font-semibold text-secondary-900">{emp.full_name || emp.username || 'Unknown Employee'}</p>
                    </div>

                    {/* Email */}
                    <div className="col-span-3 flex items-center gap-2">

                      <p className="text-sm text-secondary-600 truncate">{emp.email || 'N/A'}</p>
                    </div>

                    {/* Department */}
                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${getDeptColor(emp.department || emp.department_id?.toString() || 'Unknown')}`}>
                        {emp.department || emp.department_id || 'Unknown'}
                      </span>
                    </div>

                    {/* Position */}
                    <div className="col-span-2">
                      <p className="text-sm text-secondary-600">{emp.position || emp.position_id || 'N/A'}</p>
                    </div>

                    {/* Status */}
                    <div className="col-span-1">
                      <span className={`text-xs font-semibold ${emp.is_active !== false ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {emp.is_active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    {/* Actions - Three Dots Menu with only Edit & Delete */}
                    <div className="col-span-1 flex items-center justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary-400 hover:text-white hover:bg-secondary-900 transition-all duration-200">
                            <MoreVertical size={16} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                          {/* Edit Option */}
                          <DropdownMenuItem
                            onClick={() => { setSelectedEmployee(emp); setShowForm(true) }}
                            className="cursor-pointer hover:bg-secondary-900 hover:text-white group transition-all duration-200"
                          >
                            <Edit size={15} className="mr-2 text-amber-500 group-hover:text-white transition-colors" />
                            <span>Edit</span>
                          </DropdownMenuItem>

                          {/* Delete Option */}
                          <DropdownMenuItem
                            onClick={() => handleDeleteEmployee(emp.id)}
                            className="text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200 cursor-pointer"
                          >
                            <Trash2 size={15} className="mr-2" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="px-6 py-16 text-center">
                  <Search size={40} className="mx-auto text-secondary-200 mb-3" />
                  <p className="text-sm font-semibold text-secondary-500">No employees found</p>
                  <p className="text-xs text-secondary-400 mt-1">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table footer */}
        <div className="px-6 py-3.5 bg-gray-50/80 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-secondary-400 font-medium">
            Showing <span className="font-bold text-secondary-600">{currentItems.length}</span> employees
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </motion.div>

      {/* Employee Form Modal */}
      {showForm && (
        <EmployeeForm
          employee={selectedEmployee}
          onClose={() => setShowForm(false)}
          onSave={handleSaveEmployee}
        />
      )}
    </div>
  )
}

export default Employees