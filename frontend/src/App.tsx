import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Hello } from './components/Hello';
import { Login } from './pages/Login';
import { PrivateRoute } from './components/PrivateRoute';

function ProtectedPage() {
  return <div className="p-6">🔒 This is protected content!</div>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <nav className="p-4 bg-gray-100 space-x-4">
          <Link to="/">Home</Link>
          <Link to="/protected">Protected</Link>
          <Link to="/login">Login</Link>
        </nav>
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
      </BrowserRouter>
    </AuthProvider>
  );
}
