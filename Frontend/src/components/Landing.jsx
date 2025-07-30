//Landing-contacto/frontend/src/components/LandingPage
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ContactForm from './ContactForm';

const Landing = () => {
  const navigate = useNavigate();

  const scrollToForm = () => {
    const formSection = document.getElementById('contact-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="landing-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Soporte Técnico <span>Profesional</span></h1>
          <p className="hero-subtitle">Soluciones inmediatas y confiables para problemas tecnológicos complejos </p>    
            <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Soporte continuo</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">98%</div>
              <div className="stat-label">Problemas resueltos</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">30 min</div>
              <div className="stat-label">Respuesta promedio</div>
            </div>
          </div>
          <div className="hero-buttons">
            <button className="hero-button" onClick={scrollToForm}>👨🏻‍💻 Solicitar Soporte</button>
            <button 
              className="hero-button admin-button" 
              onClick={goToLogin}
            >
              🔐 Panel Administrador
            </button>
          </div>
        </div>

        <div className="hero-illustration">
          <div className="tech-circle">
            <div className="server-icon"></div>
            <div className="shield-icon"></div>
            <div className="code-icon"></div>
          </div>
        </div>
      </div>

      {/* Servicios */}
      <div className="services-section">
        <h2 className="section-title">Nuestros Servicios</h2>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon hardware"></div>
            <h3>Soporte de Hardware</h3>
            <p>Reparación y mantenimiento de equipos físicos, desde computadoras hasta servidores</p>
          </div>
          <div className="service-card">
            <div className="service-icon software"></div>
            <h3>Soporte de Software</h3>
            <p>Instalación, configuración y solución de problemas en aplicaciones y sistemas operativos</p>
          </div>
          <div className="service-card">
            <div className="service-icon network"></div>
            <h3>Soporte de Redes</h3>
            <p>Configuración y solución de problemas en redes LAN, WAN, WiFi y seguridad de red</p>
          </div>
          <div className="service-card">
            <div className="service-icon security"></div>
            <h3>Seguridad Informática</h3>
            <p>Protección de sistemas, detección de vulnerabilidades y respuesta a incidentes</p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div id="contact-form" className="form-section">
        <div className="form-header">
          <h2 className="section-titleForm">Completa el Formulario</h2>
            <p style={{ fontWeight: 'bold', fontSize:'1.2rem', marginTop: '-20px'}}>Escribe tu problema y nos pondremos en contacto contigo en minutos</p>        
        </div>
        <ContactForm />
      </div>

        <div className="footer-bottom">
          <p>© 2025 Soporte Técnico Profesional. Todos los derechos reservados.
            👥 Laines Cupul Evelin Yasmin & Medrano Cordova Edgar
          </p>
        </div>
      </div>
  );
};

export default Landing;