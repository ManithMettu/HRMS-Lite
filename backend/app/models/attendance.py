from sqlalchemy import Column, String, Integer, DateTime, Date, ForeignKey, Text, Time, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.database import Base


class Attendance(Base):
    """Attendance tracking model."""
    
    __tablename__ = "attendance"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    date = Column(Date, nullable=False)
    status = Column(String(50), nullable=False)  # present, absent, leave, half_day
    check_in_time = Column(Time, nullable=True)
    check_out_time = Column(Time, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    employee = relationship("Employee", back_populates="attendance_records")
    
    __table_args__ = (
        UniqueConstraint('employee_id', 'date', name='unique_employee_date'),
    )


from sqlalchemy import UniqueConstraint
