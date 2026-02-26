import React, { useState, useEffect } from 'react'
import {
  Calendar,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { AttendanceService } from '@lib/api/index'
import { Input } from '@components/ui/input'
import TimePicker from '@components/attendance/TimePicker'
import TimeDisplay from '@components/attendance/TimeDisplay'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@components/ui/dialog'
import { Button } from '@components/ui/button'

// Status configuration
const statusConfig: Record<string, {
  label: string
  activeBg: string
  dot: string
}> = {
  present: {
    label: 'Present',
    activeBg: 'bg-emerald-600',
    dot: 'bg-emerald-500',
  },
  absent: {
    label: 'Absent',
    activeBg: 'bg-red-600',
    dot: 'bg-red-500',
  },
  leave: {
    label: 'On Leave',
    activeBg: 'bg-amber-600',
    dot: 'bg-amber-500',
  },
}

// Types
interface AttendanceRecord {
  id: number | null
  employeeId: number
  name: string
  department: string
  status: keyof typeof statusConfig
  checkIn: string
  checkOut: string
  hours: string
  date: string
}

interface EmployeeHistoryRecord {
  date: string
  status: keyof typeof statusConfig
  checkIn: string
  checkOut: string
  hours: string
}

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}




// Utility to calculate hours between check-in and check-out
const calculateHours = (checkIn: string, checkOut: string): string => {
  if (!checkIn || !checkOut || checkIn === '-' || checkOut === '-' || checkIn === '—' || checkOut === '—') return '—'

  try {
    const [h1, m1] = checkIn.split(':').map(Number)
    const [h2, m2] = checkOut.split(':').map(Number)

    if (isNaN(h1) || isNaN(m1) || isNaN(h2) || isNaN(m2)) return '—'

    let diffMinutes = (h2 * 60 + m2) - (h1 * 60 + m1)

    if (diffMinutes < 0) return '—' // Invalid sequence

    const h = Math.floor(diffMinutes / 60)
    const m = diffMinutes % 60

    if (h === 0 && m === 0) return '—'
    return `${h}h ${m}m`
  } catch (e) {
    return '—'
  }
}

// Pagination Component
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


// Employee History Panel
const EmployeeHistoryPanel: React.FC<{
  employee: { id: number; name: string; department: string } | null
  onClose: () => void
}> = ({ employee, onClose }) => {
  const [history, setHistory] = useState<EmployeeHistoryRecord[]>([])

  useEffect(() => {
    if (employee) {
      const d = new Date()
      const endDate = d.toISOString().split('T')[0]
      d.setDate(d.getDate() - 14)
      const startDate = d.toISOString().split('T')[0]
      AttendanceService.getEmployeeHistory(employee.id, startDate, endDate)
        .then((res: any) => {
          // The service returns the data array directly
          const data = Array.isArray(res) ? res : (res.data || [])
          const formatted = data.map((record: any) => {
            const checkIn = record.check_in_time ? record.check_in_time.substring(0, 5) : '-'
            const checkOut = record.check_out_time ? record.check_out_time.substring(0, 5) : '-'
            return {
              date: record.date.split('T')[0],
              status: record.status as keyof typeof statusConfig,
              checkIn,
              checkOut,
              hours: calculateHours(checkIn, checkOut)
            }
          })
          setHistory(formatted)
        })
        .catch(console.error)
    }
  }, [employee])

  if (!employee) return null

  return (
    <Dialog open={!!employee} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Eye size={20} className="text-blue-500" />
            Attendance History
          </DialogTitle>
          <DialogDescription>
            {employee.name} — {employee.department}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col -mx-6">
          <div className="overflow-x-auto sidebar-scrollbar px-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-3 text-[11px] font-semibold text-secondary-400 uppercase tracking-wider">Date</th>
                  <th className="py-3 text-[11px] font-semibold text-secondary-400 uppercase tracking-wider">Status</th>
                  <th className="py-3 text-[11px] font-semibold text-secondary-400 uppercase tracking-wider text-center">Check In/Out</th>
                  <th className="py-3 text-[11px] font-semibold text-secondary-400 uppercase tracking-wider text-right">Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {history.length > 0 ? (
                  history.map((record) => {
                    const cfg = statusConfig[record.status]
                    const d = new Date(record.date)
                    const dateFormatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

                    return (
                      <tr key={record.date} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3">
                          <span className="text-sm font-medium text-secondary-900">{dateFormatted}</span>
                        </td>
                        <td className="py-3">
                          <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider text-white shadow-sm w-20 ${cfg?.activeBg}`}>
                            {cfg?.label}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <div className="flex items-center justify-center gap-4">
                            <TimeDisplay type="checkIn" value={record.checkIn} />
                            <TimeDisplay type="checkOut" value={record.checkOut} />
                          </div>
                        </td>
                        <td className="py-3 text-right">
                          <span className="text-sm font-medium text-secondary-700">{record.hours}</span>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-secondary-400 text-sm italic">
                      No records found for this period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Main Attendance Component
const Attendance: React.FC = () => {
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const [selectedDate, setSelectedDate] = useState(todayStr)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Modal state for history
  const [viewingEmployee, setViewingEmployee] = useState<{ id: number; name: string; department: string } | null>(null)

  // Fetch attendance data
  useEffect(() => {
    const fetchAttendanceData = async () => {
      setLoading(true)
      try {
        const response: any = await AttendanceService.getAttendanceRecords({ date: selectedDate })
        const mappedData: AttendanceRecord[] = (response.data || response || []).map((record: any) => {
          const checkIn = record.check_in_time ? record.check_in_time.substring(0, 5) : '-'
          const checkOut = record.check_out_time ? record.check_out_time.substring(0, 5) : '-'
          return {
            id: record.id,
            employeeId: record.employee_id,
            name: record.employee?.full_name || record.employee?.username || `Employee #${record.employee_id}`,
            department: record.employee?.department || 'N/A',
            status: record.status as keyof typeof statusConfig,
            checkIn,
            checkOut,
            hours: calculateHours(checkIn, checkOut),
            date: record.date.split('T')[0]
          }
        })
        setAttendanceData(mappedData)
      } catch (error) {
        console.error('Error fetching attendance data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAttendanceData()
  }, [selectedDate])

  const statusFilters = ['All', 'Present', 'Absent', 'On Leave']

  // Filter by selected date first
  const dateFilteredData = attendanceData.filter(r => r.date === selectedDate)

  const filteredData = dateFilteredData.filter(r => {
    const matchSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchFilter =
      activeFilter === 'All' ||
      statusConfig[r.status]?.label === activeFilter
    return matchSearch && matchFilter
  })

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, activeFilter, selectedDate])

  // Date navigation
  const navigateDate = (days: number) => {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() + days)
    const newDate = d.toISOString().split('T')[0]
    if (newDate <= todayStr) {
      setSelectedDate(newDate)
    }
  }

  const handleDateChange = (date: string) => {
    if (date <= todayStr) {
      setSelectedDate(date)
    }
  }

  const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const isToday = selectedDate === todayStr
  const canEdit = selectedDate === todayStr

  // Handle status change
  const handleStatusChange = async (record: AttendanceRecord, newStatus: keyof typeof statusConfig) => {
    if (!canEdit) return

    const oldStatus = record.status

    // Optimistic update
    setAttendanceData(prev =>
      prev.map(r =>
        r.employeeId === record.employeeId
          ? {
            ...r,
            status: newStatus,
            checkIn: newStatus === 'absent' || newStatus === 'leave' ? '-' : r.checkIn,
            checkOut: newStatus === 'absent' || newStatus === 'leave' ? '-' : r.checkOut,
          }
          : r
      )
    )

    try {
      if (record.id) {
        // Update existing
        await AttendanceService.updateAttendance(record.id, { status: newStatus })
      } else {
        // Create new
        const res = await AttendanceService.markAttendance({
          employee_id: record.employeeId,
          date: selectedDate,
          status: newStatus
        })
        // Update the ID so we can update it later
        setAttendanceData(prev => prev.map(r => r.employeeId === record.employeeId ? { ...r, id: res.id } : r))
      }
    } catch (error) {
      console.error('Failed to update attendance status:', error)
      // Rollback
      setAttendanceData(prev => prev.map(r => r.employeeId === record.employeeId ? { ...r, status: oldStatus } : r))
    }
  }

  // Handle check in/out change
  const handleTimeChange = async (record: AttendanceRecord, field: 'checkIn' | 'checkOut', value: string) => {
    if (!canEdit) return

    const oldVal = record[field]

    // Optimistic update
    setAttendanceData(prev =>
      prev.map(r => {
        if (r.employeeId === record.employeeId) {
          const newVal = { ...r, [field]: value }
          return { ...newVal, hours: calculateHours(newVal.checkIn, newVal.checkOut) }
        }
        return r
      })
    )

    // Only save if it's a valid 5-character time like HH:MM
    if (value.length === 5 && value.includes(':')) {
      try {
        const payloadField = field === 'checkIn' ? 'check_in_time' : 'check_out_time'
        if (record.id) {
          await AttendanceService.updateAttendance(record.id, { [payloadField]: value })
        } else {
          const res = await AttendanceService.markAttendance({
            employee_id: record.employeeId,
            date: selectedDate,
            status: record.status,
            [payloadField]: value
          })
          setAttendanceData(prev => prev.map(r => r.employeeId === record.employeeId ? { ...r, id: res.id } : r))
        }
      } catch (error) {
        console.error('Failed to update attendance time:', error)
        // Rollback
        setAttendanceData(prev => prev.map(r => r.employeeId === record.employeeId ? { ...r, [field]: oldVal } : r))
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary-900" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1.5 h-6 md:w-2 md:h-8 rounded-full bg-gradient-to-b from-emerald-500 to-teal-500" />
            <h1 className="text-2xl md:text-3xl font-display font-bold text-secondary-900">Attendance</h1>
          </div>
          <p className="text-secondary-500 ml-4 md:ml-5 text-[14px] md:text-[15px]">Track & manage daily attendance records</p>
        </div>
      </motion.div>

      {/* Date Picker & Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="bg-white rounded-2xl border border-gray-100 p-4"
      >
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          {/* Date navigation */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => navigateDate(-1)}
              className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <ChevronLeft size={16} className="text-secondary-500" />
            </button>

            <div className="flex items-center gap-2.5 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 min-w-[240px]">
              <Calendar size={16} className="text-secondary-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                max={todayStr}
                className="bg-transparent text-sm font-semibold text-secondary-900 border-none outline-none cursor-pointer flex-1"
              />
            </div>

            <button
              onClick={() => navigateDate(1)}
              disabled={selectedDate === todayStr}
              className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} className="text-secondary-500" />
            </button>

            {!isToday && (
              <button
                onClick={() => setSelectedDate(todayStr)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              >
                Today
              </button>
            )}
          </div>

          <div className="hidden md:block w-px h-8 bg-gray-200" />

          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-300" />
            <Input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-colors text-sm"
            />
          </div>

          {/* Status filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <Filter size={14} className="text-secondary-300 flex-shrink-0" />
            {statusFilters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${activeFilter === f
                  ? 'bg-secondary-900 text-white shadow-sm'
                  : 'bg-gray-100 text-secondary-500 hover:bg-gray-200'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-secondary-400 mt-3 font-medium">
          {isToday ? 'Today — ' : ''}{formattedDate}
          {!canEdit && <span className="ml-2 text-amber-600">(View only)</span>}
        </p>
      </motion.div>

      {/* Attendance Table - Adjusted Column Widths */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
      >
        <div className="overflow-x-auto sidebar-scrollbar">
          <div className="min-w-[1000px]">
            {/* Table Header - Adjusted column spans */}
            <div className="grid grid-cols-12 gap-2 px-4 py-3.5 bg-gray-50/80 border-b border-gray-100 text-[11px] font-semibold text-secondary-400 uppercase tracking-wider">
              <div className="col-span-2">Employee</div>
              <div className="col-span-1">Dept</div>
              <div className="col-span-3">Status</div>
              <div className="col-span-2">Check In</div>
              <div className="col-span-2">Check Out</div>
              <div className="col-span-1 text-center">Hours</div>
              <div className="col-span-1 text-right">History</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-50">
              {currentItems.length > 0 ? (
                currentItems.map((record: AttendanceRecord, i: number) => {
                  return (
                    <motion.div
                      key={record.employeeId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 + i * 0.04 }}
                      className="grid grid-cols-12 gap-2 px-4 py-4 items-center border-b border-gray-50/50"
                    >
                      {/* Employee - col-span-2 */}
                      <div className="col-span-2">
                        <p className="text-sm font-semibold text-secondary-900 truncate">{record.name}</p>
                      </div>

                      {/* Department - col-span-1 */}
                      <div className="col-span-1">
                        <span className="text-xs text-secondary-500">{record.department}</span>
                      </div>

                      {/* Status - Horizontal Radio Buttons - col-span-3 */}
                      <div className="col-span-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {Object.entries(statusConfig).map(([key, cfg]) => (
                            <label
                              key={key}
                              className={`
                                flex items-center justify-center px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all duration-200 min-w-[70px]
                                ${!canEdit ? 'cursor-not-allowed opacity-60' : 'hover:bg-gray-50'}
                                ${record.status === key
                                  ? `${cfg.activeBg} text-white shadow-md transform scale-105`
                                  : 'bg-white text-secondary-400 border border-gray-100'
                                }
                              `}
                            >
                              <input
                                type="radio"
                                name={`status-${record.id}`}
                                value={key}
                                checked={record.status === key}
                                onChange={() => handleStatusChange(record, key as keyof typeof statusConfig)}
                                disabled={!canEdit}
                                className="hidden"
                              />
                              <span>
                                {cfg.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Check In - col-span-2 */}
                      <div className="col-span-2">
                        {record.status === 'absent' || record.status === 'leave' ? (
                          <span className="text-sm text-secondary-300">—</span>
                        ) : (
                          <div className="flex items-center gap-1">
                            {canEdit ? (
                              <TimePicker
                                value={record.checkIn}
                                onChange={(val: string) => handleTimeChange(record, 'checkIn', val)}
                              />
                            ) : (
                              <TimeDisplay type="checkIn" value={record.checkIn} />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Check Out - col-span-2 */}
                      <div className="col-span-2">
                        {record.status === 'absent' || record.status === 'leave' ? (
                          <span className="text-sm text-secondary-300">—</span>
                        ) : (
                          <div className="flex items-center gap-1">
                            {canEdit ? (
                              <TimePicker
                                value={record.checkOut}
                                onChange={(val: string) => handleTimeChange(record, 'checkOut', val)}
                              />
                            ) : (
                              <TimeDisplay type="checkOut" value={record.checkOut} />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Hours - col-span-1 */}
                      <div className="col-span-1 text-center">
                        <span className={`text-xs font-medium ${record.hours === '-' || record.hours === '—'
                          ? 'text-secondary-300'
                          : 'text-secondary-800'
                          }`}>
                          {record.hours}
                        </span>
                      </div>

                      {/* History - col-span-1 */}
                      <div className="col-span-1 text-right">
                        <button
                          onClick={() => setViewingEmployee({
                            id: record.employeeId,
                            name: record.name,
                            department: record.department,
                          })}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-secondary-400 hover:text-blue-600 hover:bg-blue-50 transition-colors ml-auto"
                          title="View History"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </motion.div>
                  )
                })
              ) : (
                <div className="px-6 py-16 text-center">
                  <Search size={40} className="mx-auto text-secondary-200 mb-3" />
                  <p className="text-sm font-semibold text-secondary-500">No records found for this date</p>
                  <p className="text-xs text-secondary-400 mt-1">Try selecting a different date</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table Footer */}
        <div className="px-4 py-3.5 bg-gray-50/80 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-secondary-400 font-medium">
            Showing {currentItems.length} of {filteredData.length} records
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </motion.div >

      {/* Employee History Modal */}
      < EmployeeHistoryPanel
        employee={viewingEmployee}
        onClose={() => setViewingEmployee(null)}
      />
    </div >
  )
}

export default Attendance