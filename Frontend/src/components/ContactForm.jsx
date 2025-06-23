import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/contactForm.css';

const ContactForm = () => {
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: '',
    mensaje: ''
  });

  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const timerRef = useRef(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!form.nombre || !form.apellidos || !form.correo || !form.telefono || !form.mensaje) {
      setStatus({ type: 'error', message: 'Todos los campos son obligatorios.' });
      setIsSubmitting(false);
      return;
    }
    
    try {
      const res = await axios.post('http://localhost:3000/api/contact', form);
      setStatus({ type: 'success', message: 'Mensaje enviado con éxito' });
      setShowSuccessModal(true);
      setForm({ nombre: '', apellidos: '', correo: '', telefono: '', mensaje: '' });
      
      timerRef.current = setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
      
    } catch (error) {
      setStatus({ type: 'error', message: 'Error al enviar el mensaje' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="minimal-form-container">
      <div className="image-circle">
        <img src="https://images.pexels.com/photos/7709181/pexels-photo-7709181.jpeg" alt="Background" />
      </div>
      <form onSubmit={handleSubmit} className="minimal-form">
        <div className="form-row">
          <div className="input-group">
            <div className="inputBox">
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <span>Nombre</span>
            </div>
          </div>
          <div className="input-group">
            <div className="inputBox">
              <input
                type="text"
                name="apellidos"
                value={form.apellidos}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <span>Apellidos</span>
            </div>
          </div>
        </div>
        
        <div className="form-row">
          <div className="input-group">
            <div className="inputBox">
              <input
                type="email"
                name="correo"
                value={form.correo}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <span>Correo</span>
            </div>
          </div>
          <div className="input-group">
            <div className="inputBox">
              <input
                type="tel"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <span>Teléfono</span>
            </div>
          </div>
        </div>
        
        <div className="input-group">
          <div className="inputBox">
            <textarea
              name="mensaje"
              value={form.mensaje}
              onChange={handleChange}
              required
              placeholder=" "
            ></textarea>
            <span>Mensaje</span>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="enter"
          disabled={isSubmitting}
        > 
          {isSubmitting ? 'Enviando...' : 'Enviar'} ➤ 
        </button>
        
        {status && status.type === 'error' && (
          <div className={`minimal-status ${status.type}`}>
            {status.message}
          </div>
        )}
      </form>

      {showSuccessModal && (
        <div className="success-modal">
          <div className="modal-content">
            <div className="check-icon">✓</div>
            <p>Mensaje enviado con éxito</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactForm;