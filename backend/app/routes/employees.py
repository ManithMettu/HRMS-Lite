from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.db.database import get_db
from app.schemas.employee import (
    EmployeeResponse, EmployeeCreate, EmployeeUpdate,
    DepartmentResponse, PositionResponse, EmployeePaginatedResponse
)
from app.crud.employee import (
    create_employee, get_employee_by_id, get_all_employees,
    update_employee, delete_employee, create_department,
    get_all_departments, create_position, get_all_positions
)

router = APIRouter()


@router.post("/", response_model=EmployeeResponse)
def create_new_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    """Create a new employee."""
    db_employee = create_employee(db, employee)
    if not db_employee:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create employee"
        )
    # Return full details by calling get_employee_by_id
    return get_employee_by_id(db, db_employee.id)


@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    """Get employee by ID."""
    employee = get_employee_by_id(db, employee_id)
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    return employee


@router.get("/", response_model=EmployeePaginatedResponse)
def list_employees(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=1000),
    search: Optional[str] = None,
    department: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List all employees with pagination and filtering."""
    skip = (page - 1) * limit
    employees, total = get_all_employees(
        db, skip=skip, limit=limit, 
        search=search, 
        department_id=department, 
        status=status
    )
    
    total_pages = (total + limit - 1) // limit if total > 0 else 0
    
    return {
        "data": employees,
        "total": total,
        "page": page,
        "limit": limit,
        "totalPages": total_pages
    }


@router.put("/{employee_id}", response_model=EmployeeResponse)
def update_employee_info(employee_id: int, employee_update: EmployeeUpdate, db: Session = Depends(get_db)):
    """Update employee information."""
    employee = update_employee(db, employee_id, employee_update)
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    # Return full details by calling get_employee_by_id
    return get_employee_by_id(db, employee.id)


@router.delete("/{employee_id}")
def delete_employee_record(employee_id: int, db: Session = Depends(get_db)):
    """Delete an employee."""
    success = delete_employee(db, employee_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    return {"message": "Employee deleted successfully"}


# Department endpoints
@router.post("/departments/", response_model=DepartmentResponse)
def create_new_department(name: str, description: str = None, db: Session = Depends(get_db)):
    """Create a new department."""
    department = create_department(db, name, description)
    return department


@router.get("/departments/", response_model=list[DepartmentResponse])
def list_departments(db: Session = Depends(get_db)):
    """List all departments."""
    return get_all_departments(db)


# Position endpoints
@router.post("/positions/", response_model=PositionResponse)
def create_new_position(title: str, description: str = None, department_id: int = None, db: Session = Depends(get_db)):
    """Create a new position."""
    position = create_position(db, title, description, department_id)
    return position


@router.get("/positions/", response_model=list[PositionResponse])
def list_positions(db: Session = Depends(get_db)):
    """List all positions."""
    return get_all_positions(db)
