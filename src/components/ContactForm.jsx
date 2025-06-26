import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { z } from 'zod';
import ReCAPTCHA from 'react-google-recaptcha';
import '../styles/contactForm.css';

const ContactForm = () => {
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: '',
    mensaje: ''
  });

  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
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

    // Validación de términos
    if (!aceptaTerminos) {
      setStatus({ type: 'error', message: 'Debes aceptar los términos y condiciones.' });
      setIsSubmitting(false);
      return;
    }

    // Validación de reCAPTCHA
    if (!recaptchaToken) {
      setStatus({ type: 'error', message: 'Confirma que no eres un robot.' });
      setIsSubmitting(false);
      return;
    }

    // Validación con Zod
    const schema = z.object({
      nombre: z.string().min(1),
      apellidos: z.string().min(1),
      correo: z.string().email(),
      telefono: z.string().min(5),
      mensaje: z.string().min(1).max(500)
    });

    const result = schema.safeParse(form);

    if (!result.success) {
      setStatus({ type: 'error', message: 'Verifica los campos. Asegúrate de llenarlos correctamente.' });
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/contact', {
        ...result.data,
         recaptchaToken
      });

      setStatus({ type: 'success', message: 'Mensaje enviado con éxito' });
      setShowSuccessModal(true);
      setForm({ nombre: '', apellidos: '', correo: '', telefono: '', mensaje: '' });
      setAceptaTerminos(false);
      setRecaptchaToken(null);

      timerRef.current = setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
    } catch (error) {
      setStatus({ type: 'error', message: 'Error al enviar el mensaje. Intenta más tarde.' });
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
              <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required placeholder=" " />
              <span>Nombre</span>
            </div>
          </div>
          <div className="input-group">
            <div className="inputBox">
              <input type="text" name="apellidos" value={form.apellidos} onChange={handleChange} required placeholder=" " />
              <span>Apellidos</span>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="input-group">
            <div className="inputBox">
              <input type="email" name="correo" value={form.correo} onChange={handleChange} required placeholder=" " />
              <span>Correo</span>
            </div>
          </div>
          <div className="input-group">
            <div className="inputBox">
              <input type="tel" name="telefono" value={form.telefono} onChange={handleChange} required placeholder=" " />
              <span>Teléfono</span>
            </div>
          </div>
        </div>

        <div className="input-group">
          <div className="inputBox">
            <textarea name="mensaje" value={form.mensaje} onChange={handleChange} required placeholder=" "></textarea>
            <span>Mensaje</span>
          </div>
        </div>

        <label className="checkbox-label">
          <input type="checkbox" checked={aceptaTerminos} onChange={() => setAceptaTerminos(!aceptaTerminos)} />
          Acepto los <a href="#">términos y condiciones</a>.
        </label>

        <div style={{ marginTop: '1rem' }}>
          <ReCAPTCHA
            sitekey="6Lc5a2srAAAAABickqzYHyNlQxBYumIh5AwgesG9" // Reemplaza con tu clave de reCAPTCHA v2
            onChange={token => setRecaptchaToken(token)}
          />
        </div>

        {status && status.type === 'error' && (
          <div className="minimal-status error">{status.message}</div>
        )}

        <button type="submit" className="enter" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar'} ➤
        </button>
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
