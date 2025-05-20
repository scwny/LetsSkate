import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Header } from './components/header'
import { Landing, About, Events } from './pages'
import { Login } from './pages/Login'
import { PrivateRoute } from './components/PrivateRoute'
import { Profile } from './pages/members/Profile'
import { AdminDashboard } from './pages/admin/Dashboard'
import './index.css'


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <main className="max-w-3xl mx-auto mt-8 p-6 space-y-6">
          <Routes>
            <Route path="/"       element={<Landing />} />
            <Route path="/about"  element={<About />} />
            <Route path="/events" element={<Events />} />
            <Route path="/login"  element={<Login />} />
            <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }/>
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  )
}