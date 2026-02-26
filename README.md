# HRMS - Human Resource Management System

A comprehensive, mobile-responsive Human Resource Management System built for modern organizations. This project features a robust FastAPI backend with PostgreSQL and a premium React-based frontend.

## 🚀 Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS (Primary color: `#181e30`)
- **Components**: Shadcn UI, Lucide React (Icons), Framer Motion (Animations)
- **State Management**: Zustand, React Context API
- **Networking**: Axios with JWT interceptors
- **Forms**: React Hook Form + Zod validation

### Backend
- **Framework**: FastAPI (Python 3.12+)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Migrations**: Alembic
- **Security**: JWT Authentication (Access & Refresh tokens), Password hashing with Bcrypt
- **Schemas**: Pydantic v2

---

## 🔧 Installation & Setup

### Backend Setup
1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```
2. **Create and activate virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
4. **Environment Variables**:
   Create a `.env` file in the `backend/` directory:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/hrms_db
   SECRET_KEY=your_secret_key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```
5. **Run Migrations**:
   ```bash
   alembic upgrade head
   ```
6. **Start the server**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

### Frontend Setup
1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Environment Variables**:
   Create a `.env` file in the `frontend/` directory:
   ```env
   VITE_API_URL=http://localhost:8000
   ```
4. **Start development server**:
   ```bash
   npm run dev
   ```

---

## 📝 Assumptions & Limitations

### Assumptions
- **User Roles**: The current implementation assumes a singleton administrator role for management tasks (Employees, Attendance).
- **ID Generation**: Employee IDs are generated sequentially (e.g., `EMP-001`) to maintain organizational order.
- **Time Tracking**: Attendance hours are calculated based on a 24-hour clock.

### Limitations
- **Deployment**: The frontend is optimized for Vercel (see `vercel.json` for SPA routing), while the backend requires a persistent Python environment.
- **Data Persistence**: Requires a running PostgreSQL instance for all core features.
- **File Uploads**: Profiles currently use placeholders or generated signatures rather than physical file storage.

---

## 🛠️ Key Features
- **Responsive Navigation**: Adaptive sidebar and mobile drawer.
- **Dynamic Attendance**: Real-time hours calculation and status management.
- **Secure Auth**: Token rotation and protected routes.
- **Reporting**: Weekly attendance charts and organizational stats.
