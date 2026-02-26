from sqlalchemy import Column, String, DateTime, Date, ForeignKey, Text, Float, Integer
from datetime import datetime

from app.db.database import Base


class Payroll(Base):
    """Payroll/Salary slip model."""
    
    __tablename__ = "payroll"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    month = Column(String(7), nullable=False)  # YYYY-MM format
    basic_salary = Column(Float, nullable=False)
    bonus = Column(Float, default=0)
    deductions = Column(Float, default=0)
    net_salary = Column(Float, nullable=False)
    payment_date = Column(Date, nullable=True)
    payment_method = Column(String(50), nullable=True)  # bank_transfer, check, cash
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
