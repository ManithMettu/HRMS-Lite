from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from datetime import date
from typing import Optional, List

from app.db.database import get_db
from app.schemas.attendance import AttendanceResponse, MarkAttendancePayload, UpdateAttendancePayload
from app.models.attendance import Attendance
from app.models.employee import Employee
from app.crud.employee import get_all_employees
from sqlalchemy.orm import joinedload

router = APIRouter()

@router.get("/", response_model=List[AttendanceResponse])
def get_attendance_records(
    date: Optional[date] = None,
    startDate: Optional[date] = None,
    endDate: Optional[date] = None,
    employee_id: Optional[int] = None,
    status_: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db)
):
    if date and not (startDate or endDate or employee_id or status_):
        # Daily view: Return ALL employees merged with their attendance for this date
        employees, _ = get_all_employees(db, limit=1000)
        attendance_records = db.query(Attendance).filter(Attendance.date == date).all()
        attendance_map = {a.employee_id: a for a in attendance_records}
        
        results = []
        for emp in employees:
            emp_data = emp._asdict()
            if emp.id in attendance_map:
                # Get attendance data as dict
                a = attendance_map[emp.id]
                a_data = {
                    "id": a.id,
                    "employee_id": a.employee_id,
                    "date": a.date,
                    "status": a.status,
                    "check_in_time": a.check_in_time,
                    "check_out_time": a.check_out_time,
                    "notes": a.notes,
                    "created_at": a.created_at,
                    "updated_at": a.updated_at,
                    "employee": emp_data
                }
                results.append(a_data)
            else:
                results.append({
                    "id": None,
                    "employee_id": emp.id,
                    "date": date,
                    "status": "absent",
                    "employee": emp_data,
                    "check_in_time": None,
                    "check_out_time": None,
                    "notes": None
                })
        return results

    # Standard filtered view
    query = db.query(Attendance)
    if date:
        query = query.filter(Attendance.date == date)
    if startDate:
        query = query.filter(Attendance.date >= startDate)
    if endDate:
        query = query.filter(Attendance.date <= endDate)
    if employee_id:
        query = query.filter(Attendance.employee_id == employee_id)
    if status_:
        query = query.filter(Attendance.status == status_)
    
    records = query.all()
    results = []
    for r in records:
        from app.crud.employee import get_employee_by_id
        emp = get_employee_by_id(db, r.employee_id)
        emp_data = emp._asdict() if emp else None
        
        a_data = {
            "id": r.id,
            "employee_id": r.employee_id,
            "date": r.date,
            "status": r.status,
            "check_in_time": r.check_in_time,
            "check_out_time": r.check_out_time,
            "notes": r.notes,
            "created_at": r.created_at,
            "updated_at": r.updated_at,
            "employee": emp_data
        }
        results.append(a_data)
    return results

@router.get("/{id}", response_model=AttendanceResponse)
def get_attendance_by_id(id: int, db: Session = Depends(get_db)):
    attendance = db.query(Attendance).options(joinedload(Attendance.employee)).filter(Attendance.id == id).first()
    if not attendance:
        raise HTTPException(status_code=404, detail="Attendance not found")
    return attendance

@router.post("/", response_model=AttendanceResponse)
def mark_attendance(data: MarkAttendancePayload, db: Session = Depends(get_db)):
    existing = db.query(Attendance).filter(
        Attendance.employee_id == data.employee_id, 
        Attendance.date == data.date
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Attendance for this date already logged")
        
    new_attendance = Attendance(**data.dict())
    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)
    return new_attendance

@router.put("/{id}", response_model=AttendanceResponse)
def update_attendance(id: int, data: UpdateAttendancePayload, db: Session = Depends(get_db)):
    attendance = db.query(Attendance).filter(Attendance.id == id).first()
    if not attendance:
        raise HTTPException(status_code=404, detail="Attendance not found")
        
    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(attendance, key, value)
        
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    return attendance

@router.get("/employee/{employeeId}", response_model=List[AttendanceResponse])
def get_employee_history(
    employeeId: int, 
    startDate: date, 
    endDate: date, 
    db: Session = Depends(get_db)
):
    query = db.query(Attendance).filter(
        Attendance.employee_id == employeeId,
        Attendance.date >= startDate,
        Attendance.date <= endDate
    )
    return query.all()
