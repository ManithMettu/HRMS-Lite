import React from 'react'
import { LogIn, LogOut } from 'lucide-react'

interface TimeDisplayProps {
    type: 'checkIn' | 'checkOut'
    value: string
    className?: string
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ type, value, className }) => {
    const isEmpty = !value || value === '-' || value === '—'
    const Icon = type === 'checkIn' ? LogIn : LogOut
    const iconColor = type === 'checkIn' ? 'text-emerald-500' : 'text-rose-500'

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className={`w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center ${iconColor}/10`}>
                <Icon size={14} className={iconColor} />
            </div>
            <span className={`text-sm font-medium ${isEmpty ? 'text-secondary-300' : 'text-secondary-700'}`}>
                {isEmpty ? '—' : value}
            </span>
        </div>
    )
}

export default TimeDisplay
