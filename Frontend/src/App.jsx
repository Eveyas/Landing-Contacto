import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './Authentication/AuthContext';
import Landing from './components/Landing';
import LoginPage from './Pages/LoginPage';
import DashboardPage from './Pages/DashboardPage';
import './App.css';

// Protección de rutas
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas publicas */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rutas protegidas */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            } 
          />
          
          {/* Redirección de rutas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;