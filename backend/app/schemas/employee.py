from pydantic import BaseModel
from typing import Optional, List, Union
from datetime import datetime, date


class DepartmentBase(BaseModel):
    name: str
    description: Optional[str] = None


class DepartmentResponse(DepartmentBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class PositionBase(BaseModel):
    title: str
    description: Optional[str] = None
    department_id: Optional[int] = None


class PositionResponse(PositionBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class EmployeeBase(BaseModel):
    employee_id: Optional[str] = None
    department_id: Optional[Union[int, str]] = None
    position_id: Optional[Union[int, str]] = None
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None
    date_of_joining: date
    salary: Optional[float] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None


class EmployeeCreate(EmployeeBase):
    full_name: str
    email: str
    username: Optional[str] = None


class EmployeeUpdate(BaseModel):
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None
    department_id: Optional[Union[int, str]] = None
    position_id: Optional[Union[int, str]] = None
    salary: Optional[float] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None


class EmployeeResponse(EmployeeBase):
    id: int
    user_id: int
    full_name: Optional[str] = None
    email: Optional[str] = None
    username: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    status: Optional[str] = "active"
    is_active: bool = True
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class EmployeePaginatedResponse(BaseModel):
    data: List[EmployeeResponse]
    total: int
    page: int
    limit: int
    totalPages: int
