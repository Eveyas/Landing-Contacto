import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_URL = process.env.REACT_APP_API_URL;
// const API_URL = process.env.NODE_ENV === 'production'
//   ? 'https://landing-contacto-back.onrender.com'
//   : 'http://localhost:3000';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
         const response = await axios.get(`${API_URL}/api/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrentUser(response.data.user);
      } catch (error) {
        console.error('Token inválido o expirado');
        localStorage.removeItem('token');
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  const login = async (username, password) => {
     try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        username,
        password
      });
      
    localStorage.setItem('token', response.data.token);
      setCurrentUser(response.data.user);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error en el inicio de sesión');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
