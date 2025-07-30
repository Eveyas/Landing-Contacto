import React, { useState } from 'react';
import '../styles/loginForm.css';

const LoginPage = ({ onLogin, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const success = onLogin(username, password);
      if (!success) {
        setError('Credenciales inválidas');
      }
    } catch (err) {
      setError('Error en el servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

   return (
    <div className="login-container">
      <div className="login-form-section">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">
            Panel de Administración
            <span>Ingresa tus credenciales válidas</span>
          </h2>
        
        <div className="login-input-group">
          <div className="login-inputBox">
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
        
        <div className="login-input-group">
          <div className="login-inputBox">
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
          <div className="login-minimal-status login-error">
            {error}
          </div>
        )}
        
        <button 
          type="submit" 
          className="login-enter"
          disabled={isSubmitting}
        > 
          {isSubmitting ? 'Ingresando...' : 'Ingresar'} 
        </button>
        
        <button 
          type="button" 
          className="login-back"
          onClick={onBack}
          style={{ 
            marginTop: '10px',
            background: '#777',
            width: '100%',
            padding: '12px'
          }}
        >
          Volver al formulario
        </button>
      </form>
    </div>
      <div className="login-image-section">
        <img 
          src="https://images.pexels.com/photos/38568/apple-imac-ipad-workplace-38568.jpeg" 
          alt="login" 
          className="login-image"
        />
        <div className="login-image-overlay"></div>
      </div>
    </div>
  );
};

export default LoginPage;
