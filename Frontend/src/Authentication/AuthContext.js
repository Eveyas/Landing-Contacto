import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);
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
        const response = await axios.get('http://localhost:3000/api/auth/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrentUser(response.data.user);
      } catch (error) {
        localStorage.removeItem('token');
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  const login = async (username, password) => {
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      username, password
    });
    
    localStorage.setItem('token', response.data.token);
    setCurrentUser(response.data.user);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};