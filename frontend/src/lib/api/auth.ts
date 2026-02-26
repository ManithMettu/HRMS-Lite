import { User, AuthResponse } from '../../types'
import axiosInstance from '../api'

export interface LoginPayload {
    email?: string
    username?: string
    password?: string
}

export interface RegisterPayload {
    email: string
    password?: string
    username: string
    full_name?: string
}

class AuthService {
    /**
     * Login user to get access token
     */
    static async login(data: LoginPayload): Promise<AuthResponse> {
        // Form data for OAuth2 usually requires x-www-form-urlencoded
        const formData = new URLSearchParams()
        if (data.username) formData.append('username', data.username)
        if (data.email) formData.append('email', data.email) // If API supports it
        if (data.password) formData.append('password', data.password)

        const response = await axiosInstance.post('/api/auth/login', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
        return response.data
    }

    /**
     * Register a new user
     */
    static async register(data: RegisterPayload): Promise<User> {
        const response = await axiosInstance.post('/api/auth/register', data)
        return response.data
    }

    /**
     * Get current authenticated user details
     */
    static async getCurrentUser(): Promise<User> {
        const response = await axiosInstance.get('/api/auth/me')
        return response.data
    }

    /**
     * Logout user (typically handled client-side by clearing token, but can call endpoint if token blacklisting exists)
     */
    static async logout(): Promise<void> {
        await axiosInstance.post('/api/auth/logout')
    }
}

export default AuthService
