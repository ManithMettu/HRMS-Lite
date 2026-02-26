import React from 'react'
import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

const NotFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="text-6xl font-display font-bold text-primary-600 mb-4">404</div>
        <h1 className="text-3xl font-display font-bold text-secondary-900 mb-2">Page Not Found</h1>
        <p className="text-secondary-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Home size={18} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default NotFound
