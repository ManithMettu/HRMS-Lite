#!/usr/bin/env python3
"""Initialize database and create default admin user."""

from app.db.database import Base, engine, SessionLocal
from app.models.user import User
from app.core.constants import ROLE_ADMIN
import uuid

def init_db():
    """Create all tables."""
    Base.metadata.create_all(bind=engine)
    print("Database tables created.")

def create_admin_user():
    """Create default admin user if not exists."""
    db = SessionLocal()
    try:
        # Check if admin already exists
        admin = db.query(User).filter(User.email == "admin@gmail.com").first()
        if admin:
            print("Admin user already exists.")
            return

        # Create admin user
        admin_user = User(
            email="admin@gmail.com",
            username="admin",
            hashed_password="$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPjYQgGxMWL6e",  # password123
            full_name="System Administrator",
            is_active=True,
            role=ROLE_ADMIN
        )

        db.add(admin_user)
        db.commit()
        print("Default admin user created:")
        print("Email: admin@gmail.com")
        print("Password: password123")
        print("Role: admin")

    except Exception as e:
        db.rollback()
        print(f"Error creating admin user: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
    create_admin_user()