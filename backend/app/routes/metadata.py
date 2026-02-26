from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.schemas.employee import DepartmentResponse, PositionResponse
from app.crud.employee import get_all_departments, get_all_positions

router = APIRouter()

@router.get("/departments", response_model=List[DepartmentResponse])
def list_departments(db: Session = Depends(get_db)):
    """List all departments."""
    return get_all_departments(db)

@router.get("/positions", response_model=List[PositionResponse])
def list_positions(db: Session = Depends(get_db)):
    """List all positions."""
    return get_all_positions(db)
