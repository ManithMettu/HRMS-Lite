import { Employee, Department, Position } from '../../types'
import axiosInstance from '../api'

// Enums & Payloads
export interface CreateEmployeePayload extends Omit<Employee, 'id' | 'created_at' | 'updated_at' | 'user_id'> { }
export interface UpdateEmployeePayload extends Partial<CreateEmployeePayload> { }

export interface EmployeeFilters {
    search?: string
    department?: string
    status?: string
    page?: number
    limit?: number
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    limit: number
    totalPages: number
}

class EmployeeService {
    /**
     * Fetch paginated list of employees with optional filters
     */
    static async getEmployees(filters?: EmployeeFilters): Promise<PaginatedResponse<Employee>> {
        const response = await axiosInstance.get('/api/employees', { params: filters })
        return response.data
    }

    /**
     * Fetch a single employee by ID
     */
    static async getEmployeeById(id: string | number): Promise<Employee> {
        const response = await axiosInstance.get(`/api/employees/${id}`)
        return response.data
    }

    /**
     * Create a new employee
     */
    static async createEmployee(data: CreateEmployeePayload): Promise<Employee> {
        const response = await axiosInstance.post('/api/employees', data)
        return response.data
    }

    /**
     * Update an existing employee
     */
    static async updateEmployee(id: string | number, data: UpdateEmployeePayload): Promise<Employee> {
        const response = await axiosInstance.put(`/api/employees/${id}`, data)
        return response.data
    }

    /**
     * Delete an employee
     */
    static async deleteEmployee(id: string | number): Promise<void> {
        await axiosInstance.delete(`/api/employees/${id}`)
    }

    /**
     * Fetch all departments
     */
    static async getDepartments(): Promise<Department[]> {
        const response = await axiosInstance.get('/api/departments')
        return response.data
    }

    /**
     * Fetch all positions
     */
    static async getPositions(): Promise<Position[]> {
        const response = await axiosInstance.get('/api/positions')
        return response.data
    }
}

export default EmployeeService
