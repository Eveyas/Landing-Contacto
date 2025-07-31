import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Configuración robusta de la URL de API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${API_URL}/api/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000 // Timeout de 5 segundos
        });
        setCurrentUser(response.data.user);
        setApiError(null);
      } catch (error) {
        console.error('Error verificando token:', error);
        localStorage.removeItem('token');
        if (error.code === 'ECONNABORTED') {
          setApiError('El servidor no responde. Por favor, inténtalo más tarde.');
        } else if (error.response) {
          setApiError(error.response.data.message || 'Error de autenticación');
        } else {
          setApiError('Error de conexión con el servidor');
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        username,
        password
      }, {
        timeout: 10000 // Timeout de 10 segundos para login
      });
      
      localStorage.setItem('token', response.data.token);
      setCurrentUser(response.data.user);
      setApiError(null);
      return response.data;
    } catch (error) {
      console.error('Error en login:', error);
      let errorMessage = 'Error en el inicio de sesión';
      
      if (error.response) {
        errorMessage = error.response.data.error || error.response.data.message || errorMessage;
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Tiempo de espera agotado. El servidor no responde.';
      } else if (error.message.includes('Network Error')) {
        errorMessage = 'No se puede conectar al servidor. Verifica tu conexión.';
      }
      
      setApiError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setApiError(null);
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser,
    loading,
    apiError,
    clearError: () => setApiError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};