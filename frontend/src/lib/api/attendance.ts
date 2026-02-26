import { Attendance } from '../../types'
import axiosInstance from '../api'

// Enums & Payloads
export enum AttendanceStatus {
    PRESENT = 'present',
    ABSENT = 'absent',
    LEAVE = 'leave',
    LATE = 'late', // extended from base type
    HALF_DAY = 'half_day'
}

export interface MarkAttendancePayload {
    employee_id: string | number
    date: string
    status: AttendanceStatus | string
    check_in_time?: string
    check_out_time?: string
    notes?: string
}

export interface UpdateAttendancePayload extends Partial<MarkAttendancePayload> { }

export interface AttendanceFilters {
    date?: string
    startDate?: string
    endDate?: string
    employee_id?: string | number
    status?: string
}

class AttendanceService {
    /**
     * Fetch attendance records with optional filters (date range, specific employee, status)
     */
    static async getAttendanceRecords(filters?: AttendanceFilters): Promise<Attendance[]> {
        const response = await axiosInstance.get('/api/attendance', { params: filters })
        return response.data
    }

    /**
     * Fetch a specific attendance record by ID
     */
    static async getAttendanceById(id: string | number): Promise<Attendance> {
        const response = await axiosInstance.get(`/api/attendance/${id}`)
        return response.data
    }

    /**
     * Mark attendance for an employee
     */
    static async markAttendance(data: MarkAttendancePayload): Promise<Attendance> {
        const response = await axiosInstance.post('/api/attendance', data)
        return response.data
    }

    /**
     * Update an existing attendance record (e.g., adding checkout time)
     */
    static async updateAttendance(id: string | number, data: UpdateAttendancePayload): Promise<Attendance> {
        const response = await axiosInstance.put(`/api/attendance/${id}`, data)
        return response.data
    }

    /**
     * Fetch employee's attendance history
     */
    static async getEmployeeHistory(employeeId: string | number, startDate: string, endDate: string): Promise<Attendance[]> {
        const response = await axiosInstance.get(`/api/attendance/employee/${employeeId}`, {
            params: { startDate, endDate }
        })
        return response.data
    }
}

export default AttendanceService
