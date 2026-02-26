from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from app.models.employee import Employee, Department, Position
from app.models.user import User
from app.schemas.employee import EmployeeCreate, EmployeeUpdate


def create_employee(db: Session, employee: EmployeeCreate) -> Employee:
    """Create a new employee with auto-sequenced ID and automatic User creation."""
    # 1. Create User record first
    from app.crud.user import create_user
    from app.schemas.user import UserCreate
    
    # Generate username from email if not provided
    username = employee.username or employee.email.split('@')[0]
    
    user_in = UserCreate(
        email=employee.email,
        username=username,
        full_name=employee.full_name,
        password="password123", # Default password
        role="employee"
    )
    db_user = create_user(db, user_in)
    
    # 2. Prepare Employee data
    employee_data = employee.dict(exclude={'full_name', 'email', 'username'})
    employee_data['user_id'] = db_user.id
    
    # Resolve department_id and position_id if they are strings (names)
    dept_val = employee_data.get('department_id')
    if isinstance(dept_val, str):
        from app.models.employee import Department
        dept = db.query(Department).filter(Department.name.ilike(dept_val)).first()
        if not dept:
            dept = Department(name=dept_val.upper())
            db.add(dept)
            db.flush()
        employee_data['department_id'] = dept.id
        
    pos_val = employee_data.get('position_id')
    if isinstance(pos_val, str):
        from app.models.employee import Position
        pos = db.query(Position).filter(Position.title.ilike(pos_val)).first()
        if not pos:
            pos = Position(title=pos_val.replace('_', ' ').title())
            db.add(pos)
            db.flush()
        employee_data['position_id'] = pos.id
    
    # Auto-generate employee_id: EMP-001, EMP-002, etc.
    max_id = db.query(func.max(Employee.id)).scalar() or 0
    employee_data['employee_id'] = f"EMP-{max_id + 1:03d}"
    
    db_employee = Employee(**employee_data)
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee


def get_employee_by_id(db: Session, employee_id: int) -> Employee:
    """Get employee by ID."""
    return db.query(
        Employee.id, Employee.user_id, Employee.employee_id, 
        Employee.department_id, Employee.position_id, Employee.phone,
        Employee.date_of_birth, Employee.date_of_joining, Employee.salary,
        Employee.address, Employee.city, Employee.state, Employee.country,
        Employee.postal_code, Employee.created_at, Employee.updated_at,
        User.full_name, User.email, User.username, User.is_active,
        Department.name.label("department"),
        Position.title.label("position")
    ).join(User, Employee.user_id == User.id)\
     .outerjoin(Department, Employee.department_id == Department.id)\
     .outerjoin(Position, Employee.position_id == Position.id)\
     .filter(Employee.id == employee_id).first()


def get_employee_by_user_id(db: Session, user_id: int) -> Employee:
    """Get employee by user ID."""
    return db.query(Employee).filter(Employee.user_id == user_id).first()


def get_all_employees(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    search: Optional[str] = None,
    department_id: Optional[int] = None,
    status: Optional[str] = None
):
    """Get all employees with pagination, filtering and joined info."""
    query = db.query(
        Employee.id, Employee.user_id, Employee.employee_id, 
        Employee.department_id, Employee.position_id, Employee.phone,
        Employee.date_of_birth, Employee.date_of_joining, Employee.salary,
        Employee.address, Employee.city, Employee.state, Employee.country,
        Employee.postal_code, Employee.created_at, Employee.updated_at,
        User.full_name, User.email, User.username, User.is_active,
        Department.name.label("department"),
        Position.title.label("position")
    ).join(User, Employee.user_id == User.id)\
     .outerjoin(Department, Employee.department_id == Department.id)\
     .outerjoin(Position, Employee.position_id == Position.id)
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (User.full_name.ilike(search_filter)) | 
            (User.email.ilike(search_filter)) | 
            (Employee.employee_id.ilike(search_filter))
        )
    
    if department_id:
        query = query.filter(Employee.department_id == department_id)
        
    if status == "active":
        query = query.filter(User.is_active == True)
    elif status == "inactive":
        query = query.filter(User.is_active == False)
    
    total = query.count()
    employees = query.offset(skip).limit(limit).all()
    
    return employees, total


def update_employee(db: Session, employee_id: int, employee_update: EmployeeUpdate) -> Employee:
    """Update employee information."""
    db_employee = db.query(Employee).get(employee_id)
    if db_employee:
        update_data = employee_update.dict(exclude_unset=True)
        
        # Resolve department_id and position_id if they are strings (names)
        dept_val = update_data.get('department_id')
        if isinstance(dept_val, str):
            from app.models.employee import Department
            dept = db.query(Department).filter(Department.name.ilike(dept_val)).first()
            if not dept:
                dept = Department(name=dept_val.upper())
                db.add(dept)
                db.flush()
            update_data['department_id'] = dept.id
            
        pos_val = update_data.get('position_id')
        if isinstance(pos_val, str):
            from app.models.employee import Position
            pos = db.query(Position).filter(Position.title.ilike(pos_val)).first()
            if not pos:
                pos = Position(title=pos_val.replace('_', ' ').title())
                db.add(pos)
                db.flush()
            update_data['position_id'] = pos.id
            
        for key, value in update_data.items():
            setattr(db_employee, key, value)
        db.add(db_employee)
        db.commit()
        db.refresh(db_employee)
    return db_employee


def delete_employee(db: Session, employee_id: int) -> bool:
    """Delete an employee."""
    db_employee = db.query(Employee).get(employee_id)
    if db_employee:
        db.delete(db_employee)
        db.commit()
        return True
    return False


def create_department(db: Session, name: str, description: str = None) -> Department:
    """Create a new department."""
    db_dept = Department(name=name, description=description)
    db.add(db_dept)
    db.commit()
    db.refresh(db_dept)
    return db_dept


def get_all_departments(db: Session):
    """Get all departments."""
    return db.query(Department).all()


def create_position(db: Session, title: str, description: str = None, department_id: int = None) -> Position:
    """Create a new position."""
    db_position = Position(title=title, description=description, department_id=department_id)
    db.add(db_position)
    db.commit()
    db.refresh(db_position)
    return db_position


def get_all_positions(db: Session):
    """Get all positions."""
    return db.query(Position).all()
