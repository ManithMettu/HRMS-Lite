from pydantic import BaseModel
from typing import List

class TrendDetail(BaseModel):
    direction: str  # 'up' | 'down'
    value: str

class StatItem(BaseModel):
    value: int
    trendDetail: TrendDetail

class DashboardStats(BaseModel):
    totalEmployees: StatItem
    presentToday: StatItem
    onLeave: StatItem
    openRoles: StatItem

class WeeklyAttendanceChartData(BaseModel):
    day: str
    value: int
