import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Authentication/AuthContext';
import '../styles/loginForm.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Credenciales inválidas');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="minimal-form-container login-container">
      <div className="image-circle">
        <img 
           src="https://images.pexels.com/photos/7709181/pexels-photo-7709181.jpeg" 
           alt="Background" 
        />
      </div>
      
      <form onSubmit={handleSubmit} className="minimal-form login-form">
        <h2 className="login-title">
            Panel de Administración.
            Ingresa tus credenciales válidas
        </h2>
        
        <div className="input-group">
          <div className="inputBox">
            <input
              id="username"
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder=" "
            />
            <span>Usuario</span>
          </div>
        </div>
        
        <div className="input-group">
          <div className="inputBox">
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=" "
            />
            <span>Contraseña</span>
          </div>
        </div>
        
        {error && (
          <div className="minimal-status error">
            {error}
          </div>
        )}
        
        <button 
          type="submit" 
          className="enter"
          disabled={isSubmitting}
        > 
          {isSubmitting ? 'Ingresando...' : 'Ingresar'} ➤ 
        </button>
      </form>
    </div>
  );
};

export default LoginPage;