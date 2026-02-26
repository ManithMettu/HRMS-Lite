from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.database import Base, engine
from app.routes import auth, employees, attendance, dashboard

# Create database tables
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: Could not create database tables on startup. Proceeding... error: {e}")

# Initialize FastAPI app
app = FastAPI(
    title="HRMS API",
    description="Human Resource Management System API",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins + ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "https://hrms-lite-e7g7.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routes import auth, employees, attendance, dashboard, metadata

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(employees.router, prefix="/api/employees", tags=["employees"])
app.include_router(attendance.router, prefix="/api/attendance", tags=["attendance"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(metadata.router, prefix="/api", tags=["metadata"])


@app.get("/")
def read_root():
    """Root endpoint."""
    return {
        "message": "Welcome to HRMS API",
        "version": "1.0.0",
        "docs": "/docs"
    }


from sqlalchemy import text
from app.db.database import SessionLocal

@app.get("/health")
def health_check():
    """Health check endpoint with database connectivity test."""
    db_status = "unknown"
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db_status = "connected"
        db.close()
    except Exception as e:
        db_status = f"unreachable: {str(e)}"
    
    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "database": db_status
    }
