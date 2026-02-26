# HRMS Frontend - React + Vite

This is the frontend application for the Human Resource Management System (HRMS) built with React 19, TypeScript, and Vite.

## Features

- **Modern & Professional Design**: Blue/slate color palette with clean typography
- **Expandable Sidebar**: Smooth animations with expand/collapse functionality
- **Responsive Design**: Mobile-first approach, works on all screen sizes
- **Employee Management**: View and manage employee records
- **Attendance Tracking**: Track daily attendance
- **Leave Management**: Request and manage leaves
- **Dashboard**: Overview and quick stats
- **Tailwind CSS**: Utility-first CSS framework

## Setup

1. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your backend API URL:
```
VITE_API_URL=http://localhost:8000
```

4. Start development server:
```bash
npm run dev
# or
pnpm dev
```

The app will be available at `http://localhost:5173`

## Build

```bash
npm run build
# or
pnpm build
```

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx      # Expandable sidebar with navigation
│   │   ├── Header.tsx       # Top navigation header
│   │   └── MainLayout.tsx   # Main layout wrapper
│   └── ui/                  # Reusable UI components
├── pages/
│   ├── Dashboard.tsx        # Dashboard overview
│   ├── Employees.tsx        # Employee management
│   ├── Attendance.tsx       # Attendance tracking
│   ├── Login.tsx            # Login page
│   └── NotFound.tsx         # 404 page
├── context/
│   └── SidebarContext.tsx   # Sidebar state management
├── hooks/
│   └── useSidebar.ts        # Sidebar hook
├── lib/
│   ├── api.ts               # API client
│   └── utils.ts             # Utility functions
├── types/
│   └── index.ts             # TypeScript types
├── styles/
│   └── globals.css          # Global styles
├── App.tsx                  # Main app component
└── main.tsx                 # Entry point
```

## Sidebar Features

- **Responsive**: Expands/collapses based on user preference
- **Mobile-Friendly**: Hidden by default on mobile, toggle with hamburger menu
- **Smooth Animations**: 300ms CSS transitions
- **Hover Tooltips**: Shows labels when collapsed
- **Persistent State**: Remembers user preference in localStorage
- **Active State Indicators**: Highlights current page

## Environment Variables

- `VITE_API_URL`: Backend API base URL (default: http://localhost:8000)

## Technologies

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router v6
- Axios
- Lucide React (icons)
- Framer Motion (animations)
- Zustand (state management)
