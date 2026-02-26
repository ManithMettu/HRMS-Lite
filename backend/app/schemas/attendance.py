from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date, time
from app.schemas.employee import EmployeeResponse


class MarkAttendancePayload(BaseModel):
    employee_id: int
    date: date
    status: Optional[str] = "absent"
    check_in_time: Optional[time] = None
    check_out_time: Optional[time] = None
    notes: Optional[str] = None


class UpdateAttendancePayload(BaseModel):
    employee_id: Optional[int] = None
    date: Optional[date] = None
    status: Optional[str] = None
    check_in_time: Optional[time] = None
    check_out_time: Optional[time] = None
    notes: Optional[str] = None


class AttendanceResponse(MarkAttendancePayload):
    id: Optional[int] = None
    employee: Optional[EmployeeResponse] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

