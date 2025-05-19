// src/App.tsx
import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Hello } from './components/hello'
import { Login } from './pages/Login'
import { PrivateRoute } from './components/PrivateRoute'
import './index.css'  // make sure this is here!

function ProtectedPage() {
  return (
    <div className="border border-gray-300 rounded-lg p-6 bg-gray-50 text-center">
      <h2 className="text-2xl font-bold mb-2">Welcome, member!</h2>
      <p className="text-gray-700">🔒 This is protected content.</p>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* ——— Header/Nav ——— */}
        <header className="flex items-center justify-between bg-gray-800 text-white px-6 py-4">
          <h1 className="text-2xl font-semibold">LetsSkate</h1>
          <nav className="flex space-x-4">
            <Link
              to="/"
              className="hover:bg-gray-700 px-3 py-2 rounded transition"
            >Home</Link>
            <Link
              to="/protected"
              className="hover:bg-gray-700 px-3 py-2 rounded transition"
            >Protected</Link>
            <Link
              to="/login"
              className="hover:bg-gray-700 px-3 py-2 rounded transition"
            >Login</Link>
          </nav>
        </header>

        {/* ——— Main Content ——— */}
        <main className="max-w-3xl mx-auto mt-8 p-6 space-y-6">
          <Routes>
            <Route path="/" element={<Hello />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/protected"
              element={
                <PrivateRoute>
                  <ProtectedPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  )
}
