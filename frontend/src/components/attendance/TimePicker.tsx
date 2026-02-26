import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@components/ui/select'

interface TimePickerProps {
    value: string
    onChange: (value: string) => void
    disabled?: boolean
    className?: string
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, disabled, className }) => {
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
    const minutes = ['00', '15', '30', '45']

    const [currentH, currentM] = value !== '-' && value !== '—' && value.includes(':')
        ? value.split(':')
        : ['09', '00']

    return (
        <div className={`flex items-center gap-1.5 ${className}`}>
            <Select
                disabled={disabled}
                value={currentH}
                onValueChange={(h) => onChange(`${h}:${currentM}`)}
            >
                <SelectTrigger className="w-[64px] h-8 text-[11px] font-medium bg-white/50 focus:bg-white transition-colors border-gray-200">
                    <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent>
                    {hours.map(h => (
                        <SelectItem key={h} value={h} className="text-xs">{h}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <span className="text-secondary-400 font-bold text-[10px]">:</span>

            <Select
                disabled={disabled}
                value={currentM}
                onValueChange={(m) => onChange(`${currentH}:${m}`)}
            >
                <SelectTrigger className="w-[64px] h-8 text-[11px] font-medium bg-white/50 focus:bg-white transition-colors border-gray-200">
                    <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                    {minutes.map(m => (
                        <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export default TimePicker
