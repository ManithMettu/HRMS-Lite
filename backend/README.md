# HRMS Backend - FastAPI

This is the backend API for the Human Resource Management System (HRMS) built with FastAPI and PostgreSQL.

## Setup

1. Create a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run database migrations (if using Alembic):
```bash
alembic upgrade head
```

5. Run the server:
```bash
python run.py
```

The API will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

## Project Structure

- `app/main.py` - FastAPI application entry point
- `app/core/` - Configuration and security
- `app/models/` - SQLAlchemy ORM models
- `app/schemas/` - Pydantic request/response schemas
- `app/crud/` - Database operations
- `app/routes/` - API endpoints
- `app/db/` - Database configuration

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get access token
- `GET /api/auth/me` - Get current user info

### Employees
- `GET /api/employees/` - List all employees
- `POST /api/employees/` - Create new employee
- `GET /api/employees/{id}` - Get employee details
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee

### Departments
- `GET /api/employees/departments/` - List departments
- `POST /api/employees/departments/` - Create department

### Positions
- `GET /api/employees/positions/` - List positions
- `POST /api/employees/positions/` - Create position
