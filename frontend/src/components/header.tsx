import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Header() {
  const { isAuthenticated } = useAuth()

  return (
    <header className="flex items-center justify-between bg-gray-800 text-white px-6 py-4">
      <h1 className="text-2xl font-semibold">LetsSkate</h1>
      <nav className="flex space-x-4">
        <Link to="/" className="hover:bg-gray-700 px-3 py-2 rounded">Home</Link>
        <Link to="/about" className="hover:bg-gray-700 px-3 py-2 rounded">About</Link>
        <Link to="/events" className="hover:bg-gray-700 px-3 py-2 rounded">Events</Link>
        {isAuthenticated && (
          <>
            <Link to="/profile" className="hover:bg-gray-700 px-3 py-2 rounded">Profile</Link>
            <Link to="/admin" className="hover:bg-gray-700 px-3 py-2 rounded">Admin</Link>
          </>
        )}
        <Link to="/login" className="hover:bg-gray-700 px-3 py-2 rounded">Login</Link>
      </nav>
    </header>
  )
}
