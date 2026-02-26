import React, { useState, useEffect } from 'react'
import {
  Users,
  UserCheck,
  Calendar,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  UserPlus,
  ClipboardCheck,
  ChevronRight,
  BarChart3,
} from 'lucide-react'
import { motion } from 'framer-motion'

// Animated Counter Hook
const useAnimatedCounter = (target: number, duration = 1200) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const increment = target / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return count
}

// Stat Card Component
const StatCard: React.FC<{
  title: string
  value: number
  suffix?: string
  icon: React.ReactNode
  gradient: string
  trend?: { direction: 'up' | 'down'; value: string }
  delay?: number
}> = ({ title, value, suffix = '', icon, gradient, trend, delay = 0 }) => {
  const animatedValue = useAnimatedCounter(value)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="dashboard-stat-card group relative overflow-hidden rounded-2xl p-6 bg-white border border-gray-100 cursor-default"
    >
      {/* Subtle gradient accent line at top */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${gradient}`} />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-secondary-500 text-[13px] font-medium tracking-wide uppercase">
            {title}
          </p>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-display font-bold text-secondary-900">
              {animatedValue}
            </span>
            {suffix && (
              <span className="text-xl font-display font-bold text-secondary-900">{suffix}</span>
            )}
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 mt-3 text-xs font-semibold ${trend.direction === 'up' ? 'text-emerald-600' : 'text-red-500'
                }`}
            >
              {trend.direction === 'up' ? <ArrowUp size={13} /> : <ArrowDown size={13} />}
              <span>{trend.value}</span>
            </div>
          )}
        </div>

        <div className="transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
      </div>
    </motion.div>
  )
}



// Quick Action Button
const QuickActionButton: React.FC<{
  icon: React.ReactNode
  label: string
  description: string
  gradient: string
  delay?: number
}> = ({ icon, label, description, delay = 0 }) => (
  <motion.button
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.98 }}
    className="w-full group flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200"
  >
    {/* Removed the background gradient div - now just the icon */}
    <div className="w-11 h-11 flex items-center justify-center flex-shrink-0 text-secondary-600 group-hover:text-secondary-900 transition-colors duration-200">
      {icon}
    </div>
    <div className="flex-1 text-left">
      <p className="text-sm font-semibold text-secondary-900">{label}</p>
      <p className="text-xs text-secondary-400 mt-0.5">{description}</p>
    </div>
    <ChevronRight
      size={16}
      className="text-secondary-300 group-hover:text-secondary-500 group-hover:translate-x-1 transition-all duration-200"
    />
  </motion.button>
)

// Attendance Mini Chart

const AttendanceChart: React.FC<{ tall?: boolean, data: { day: string, value: number }[] }> = ({ tall = false, data }) => (
  <div className={`flex items-end gap-4 ${tall ? 'h-52' : 'h-28'} mt-4`}>
    {data.map((d, i) => (
      <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
        <span className="text-[11px] font-bold text-secondary-500">{d.value}%</span>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${d.value}%` }}
          transition={{ duration: 0.7, delay: 0.1 * i, ease: 'easeOut' }}
          className={`w-full rounded-xl ${d.value >= 90
            ? 'bg-gradient-to-t from-emerald-500 to-emerald-400'
            : d.value >= 85
              ? 'bg-gradient-to-t from-blue-500 to-blue-400'
              : 'bg-gradient-to-t from-amber-500 to-amber-400'
            }`}
          style={{ maxHeight: '100%' }}
        />
        <span className="text-[11px] font-semibold text-secondary-400">{d.day}</span>
      </div>
    ))}
  </div>
)

// Dashboard Page
import { DashboardService, DashboardStats } from '@lib/api/index'

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [weeklyData, setWeeklyData] = useState<{ day: string, value: number }[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, weekly] = await Promise.all([
          DashboardService.getStats(),
          DashboardService.getWeeklyAttendance()
        ])
        setStats(statsData)
        setWeeklyData(weekly)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      }
    }
    fetchDashboardData()
  }, [])



  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1.5 h-6 md:w-2 md:h-8 rounded-full bg-gradient-to-b from-blue-500 to-violet-500" />
          <h1 className="text-2xl md:text-3xl font-display font-bold text-secondary-900">
            Welcome back!
          </h1>
        </div>
        <p className="text-secondary-500 ml-4 md:ml-5 text-[14px] md:text-[15px]">
          Here's what's happening in your organization today.
        </p>
      </motion.div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Total Employees"
          value={stats?.totalEmployees?.value || 0}
          icon={<Users size={24} className="text-blue-500" />}
          gradient="bg-gradient-to-r from-blue-500 to-blue-600"
          trend={stats?.totalEmployees?.trendDetail}
          delay={0}
        />
        <StatCard
          title="Present Today"
          value={stats?.presentToday?.value || 0}
          icon={<UserCheck size={24} className="text-emerald-500" />}
          gradient="bg-gradient-to-r from-emerald-500 to-teal-500"
          trend={stats?.presentToday?.trendDetail}
          delay={0.1}
        />
        <StatCard
          title="On Leave"
          value={stats?.onLeave?.value || 0}
          icon={<Calendar size={24} className="text-amber-500" />}
          gradient="bg-gradient-to-r from-amber-500 to-orange-500"
          trend={stats?.onLeave?.trendDetail}
          delay={0.2}
        />
        <StatCard
          title="Open Roles"
          value={stats?.openRoles?.value || 0}
          icon={<TrendingUp size={24} className="text-violet-500" />}
          gradient="bg-gradient-to-r from-violet-500 to-purple-500"
          trend={stats?.openRoles?.trendDetail}
          delay={0.3}
        />
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ——— Weekly Attendance (large) ——— */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <BarChart3 size={20} className="text-blue-500" />
              <div>
                <h2 className="text-[15px] font-display font-semibold text-secondary-900">
                  Weekly Attendance
                </h2>
                <p className="text-xs text-secondary-400">Team presence this week</p>
              </div>
            </div>

          </div>
          <div className="overflow-x-auto pb-2 sidebar-scrollbar">
            <div className="min-w-[450px] md:min-w-0">
              <AttendanceChart tall data={weeklyData} />
            </div>
          </div>
          <div className="flex items-center gap-5 mt-5 text-[11px] font-medium text-secondary-400">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> ≥ 90%
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" /> 85–89%
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" /> &lt; 85%
            </div>
          </div>
        </motion.div>

        {/* ——— Quick Actions ——— */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <ChevronRight size={20} className="text-emerald-500" />
            <div>
              <h2 className="text-[15px] font-display font-semibold text-secondary-900">
                Quick Actions
              </h2>
              <p className="text-xs text-secondary-400">Frequently used shortcuts</p>
            </div>
          </div>
          <div className="space-y-3">
            <QuickActionButton
              icon={<UserPlus size={18} />}
              label="Add Employee"
              description="Register new team member"
              gradient="from-blue-500 to-blue-600"
              delay={0.35}
            />
            <QuickActionButton
              icon={<ClipboardCheck size={18} />}
              label="Mark Attendance"
              description="Record today's attendance"
              gradient="from-emerald-500 to-teal-500"
              delay={0.4}
            />

          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard