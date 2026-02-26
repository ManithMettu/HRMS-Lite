export interface User {
  id: number
  email: string
  username: string
  full_name?: string
  role: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Employee {
  id: number
  user_id: number
  employee_id: string
  email?: string
  username?: string
  full_name?: string
  department_id?: number
  department?: string
  position_id?: number
  position?: string
  is_active?: boolean
  status?: string
  phone?: string
  date_of_birth?: string
  date_of_joining: string
  address?: string
  city?: string
  state?: string
  country?: string
  postal_code?: string
  created_at: string
  updated_at: string
}

export interface Department {
  id: number
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Position {
  id: number
  title: string
  description?: string
  department_id?: number
  created_at: string
  updated_at: string
}

export interface Attendance {
  id: number
  employee_id: number
  date: string
  status: 'present' | 'absent' | 'leave' | 'half_day'
  check_in_time?: string
  check_out_time?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface LeaveRequest {
  id: number
  employee_id: number
  leave_type_id: number
  start_date: string
  end_date: string
  reason?: string
  status: 'pending' | 'approved' | 'rejected'
  approved_by?: number
  approval_date?: string
  approval_notes?: string
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user?: User
}
