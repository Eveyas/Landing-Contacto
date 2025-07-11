import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/contactForm.css';

const ContactForm = () => {
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: '',
    mensaje: '',
    aceptaTerminos: false
  });

  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const timerRef = useRef(null);
  const recaptchaRef = useRef(null);
  const recaptchaWidgetId = useRef(null);

  // Clave del recaptchaSiteKey
  const recaptchaSiteKey = "6LcvK3QrAAAAANU2Ng7wTyzrsjlKY8COG0ubD1NN";

  useEffect(() => {
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => {
        setRecaptchaReady(true);
        renderRecaptcha();
      });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.grecaptcha.ready(() => {
        setRecaptchaReady(true);
        renderRecaptcha();
      });
    };
    script.onerror = () => {
      console.error('Error cargando reCAPTCHA');
      setStatus({ 
        type: 'error', 
        message: 'Error al cargar la protección de seguridad. Recarga la página.' 
      });
    };
    
    document.body.appendChild(script);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (recaptchaWidgetId.current && window.grecaptcha) {
        window.grecaptcha.reset(recaptchaWidgetId.current);
      }
    };
  }, []);

  const renderRecaptcha = () => {
    if (!window.grecaptcha || !recaptchaRef.current) return;
    
    try {
      recaptchaWidgetId.current = window.grecaptcha.render(recaptchaRef.current, {
        sitekey: recaptchaSiteKey,
        theme: 'light',
        size: 'normal'
      });
    } catch (error) {
      console.error('Error renderizando reCAPTCHA:', error);
      setStatus({ 
        type: 'error', 
        message: 'Error al cargar la verificación de seguridad' 
      });
    }
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setStatus(null);
    
    // Validación de campos
    if (!form.nombre || !form.apellidos || !form.correo || !form.telefono || !form.mensaje) {
      setStatus({ type: 'error', message: 'Todos los campos son obligatorios.' });
      setIsSubmitting(false);
      return;
    }

    if (!form.aceptaTerminos) {
      setStatus({ type: 'error', message: 'Debes aceptar los términos y condiciones.' });
      setIsSubmitting(false);
      return;
    }

    if (!recaptchaReady || !window.grecaptcha) {
      setStatus({ 
        type: 'error', 
        message: 'La protección de seguridad aún no está cargada. Intenta de nuevo.' 
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const recaptchaValue = window.grecaptcha.getResponse(recaptchaWidgetId.current);
      if (!recaptchaValue) {
        setStatus({ 
          type: 'error', 
          message: 'Por favor, completa la verificación de seguridad.' 
        });
        setIsSubmitting(false);
        return;
      }

      // Envio de datos al backend
      const API_URL = process.env.REACT_APP_API_URL;
      await axios.post(`${API_URL}/api/contact`, {
        ...form,
        recaptchaResponse: recaptchaValue
      });

      setStatus({ type: 'success', message: 'Mensaje enviado con éxito' });
      setShowSuccessModal(true);
      setForm({ 
        nombre: '', 
        apellidos: '', 
        correo: '', 
        telefono: '', 
        mensaje: '',
        aceptaTerminos: false 
      });
      
      // Reseteo de reCAPTCHA
      window.grecaptcha.reset(recaptchaWidgetId.current);
      
      timerRef.current = setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error al enviar:', error);
      let errorMessage = 'Error al enviar el mensaje';
      
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }
      
      setStatus({ type: 'error', message: errorMessage });
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
        
        {/* Términos y condiciones */}
        <div className="input-group terms-container">
          <label>
            <input
              type="checkbox"
              name="aceptaTerminos"
              checked={form.aceptaTerminos}
              onChange={handleChange}
              required
            />
            Acepto los <a 
              href="https://policies.google.com/terms" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              términos y condiciones
            </a> y la <a 
              href="https://policies.google.com/privacy" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              política de privacidad
            </a>
          </label>
        </div>
        
        {/* reCAPTCHA v2 */}
        <div 
          ref={recaptchaRef}
          style={{ 
            marginTop: '5px 0 10px',
            display: 'flex', 
            justifyContent: 'center',
            minHeight: '78px',
            alignSelf: 'flex-start',
            marginLeft: '5px',
          }}
        ></div>
        
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
