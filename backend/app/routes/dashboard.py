from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
from typing import List

from app.db.database import get_db
from app.schemas.dashboard import DashboardStats, StatItem, TrendDetail, WeeklyAttendanceChartData
from app.models.employee import Employee, Position
from app.models.attendance import Attendance

router = APIRouter()

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_employees = db.query(Employee).count()
    
    today = date.today()
    present_today = db.query(Attendance).filter(
        Attendance.date == today, 
        Attendance.status == 'present'
    ).count()
    
    on_leave = db.query(Attendance).filter(
        Attendance.date == today, 
        Attendance.status == 'leave'
    ).count()
    
    open_roles = db.query(Position).count() # simplistic, maybe add status to Position
    
    return DashboardStats(
        totalEmployees=StatItem(
            value=total_employees,
            trendDetail=TrendDetail(direction='up', value='+2%')
        ),
        presentToday=StatItem(
            value=present_today,
            trendDetail=TrendDetail(direction='up', value='+5%')
        ),
        onLeave=StatItem(
            value=on_leave,
            trendDetail=TrendDetail(direction='down', value='-1%')
        ),
        openRoles=StatItem(
            value=open_roles,
            trendDetail=TrendDetail(direction='up', value='+1')
        )
    )

@router.get("/weekly-attendance", response_model=List[WeeklyAttendanceChartData])
def get_weekly_attendance(db: Session = Depends(get_db)):
    today = date.today()
    start_of_week = today - timedelta(days=today.weekday())
    
    data = []
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    
    for i in range(7):
        current_date = start_of_week + timedelta(days=i)
        count = db.query(Attendance).filter(
            Attendance.date == current_date,
            Attendance.status == 'present'
        ).count()
        data.append(WeeklyAttendanceChartData(day=days[i], value=count))
        
    return data
