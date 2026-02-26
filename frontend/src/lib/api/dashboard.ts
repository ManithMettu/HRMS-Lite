import axiosInstance from '../api'

// Enums & Payloads
export interface DashboardStats {
    totalEmployees: {
        value: number
        trendDetail: { direction: 'up' | 'down'; value: string }
    }
    presentToday: {
        value: number
        trendDetail: { direction: 'up' | 'down'; value: string }
    }
    onLeave: {
        value: number
        trendDetail: { direction: 'up' | 'down'; value: string }
    }
    openRoles: {
        value: number
        trendDetail: { direction: 'up' | 'down'; value: string }
    }
}

export interface WeeklyAttendanceChartData {
    day: string
    value: number
}

class DashboardService {
    /**
     * Fetch high-level statistics for the dashboard
     */
    static async getStats(): Promise<DashboardStats> {
        const response = await axiosInstance.get('/api/dashboard/stats')
        return response.data
    }

    /**
     * Fetch data for the weekly attendance bar chart
     */
    static async getWeeklyAttendance(): Promise<WeeklyAttendanceChartData[]> {
        const response = await axiosInstance.get('/api/dashboard/weekly-attendance')
        return response.data
    }
}

export default DashboardService
