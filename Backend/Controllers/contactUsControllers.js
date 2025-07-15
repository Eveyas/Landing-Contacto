const mysql = require('mysql2');
require('dotenv').config();
const axios = require('axios');
const sgMail = require('@sendgrid/mail');

// Configuración de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Crear conexión a la base de datos
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

const getContactUs = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM ContacUs');
    res.status(200).json(results);
  } catch (error) {
    console.error('❌ Error en consulta:', error);
    res.status(500).json({ error: 'Error al obtener datos de contacto' });
  }
};

const postContactUs = async (req, res) => {
  const { 
	  nombre, 
	  apellidos, 
	  correo, 
	  telefono, 
	  mensaje, 
	  aceptaTerminos, 
	  recaptchaResponse 
	  } = req.body;
	  
  try {
    // Verificación del reCAPTCHA
    const recaptchaRes = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: recaptchaResponse
      })
    );

    console.log('🔍 Respuesta reCAPTCHA:', recaptchaRes.data);
    
    if (!recaptchaRes.data.success) {
      return res.status(400).json({ error: 'Verificación reCAPTCHA fallida', detalle: recaptchaRes.data });
    }
    
    // Notificación al administrador (SendGrid)
    // Insertar en la base de datos
    const [results] = await db.query(
      `INSERT INTO ContacUs (nombre, apellidos, correo, telefono, mensaje, acepta_terminos)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, apellidos, correo, telefono, mensaje, aceptaTerminos]
    );

    // Notificación por correo
    try {
      const msg = {
        to: process.env.ADMIN_EMAIL,
        from: process.env.SENDGRID_SENDER_EMAIL,
        subject: 'Nuevo lead registrado - Soporte Técnico Profesional',
        text: `Se ha registrado un nuevo lead:
               Nombre: ${nombre} ${apellidos}
               Correo: ${correo}
               Teléfono: ${telefono}
               Mensaje: ${mensaje.substring(0, 200)}...`,
        html: `<strong>Nuevo lead:</strong>
               <p><b>Nombre:</b> ${nombre} ${apellidos}</p>
               <p><b>Correo:</b> ${correo}</p>
               <p><b>Teléfono:</b> ${telefono}</p>
               <p><b>Mensaje:</b> ${mensaje.substring(0, 500)}...</p>
               <p><a href="${process.env.ADMIN_PANEL_URL || '#'}">Ver en panel de administración</a></p>`,
      };
    
      await sgMail.send(msg);
      console.log('✅ Notificación enviada con éxito');
    } catch (emailError) {
      console.error('❌ Error al enviar la notificación:', emailError);
    }

    res.status(201).json({ 
      message: 'Mensaje enviado con éxito', 
      id: results.insertId
    });
  } catch (error) {
    console.error('❌ Error en el proceso:', error);

    let errorMessage = 'Error en el servidor';
    if (error.response && error.response.data) {
      errorMessage = error.response.data.error || JSON.stringify(error.response.data);
    } else if (error.message) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: errorMessage });
  }
};

module.exports = {
  getContactUs,
  postContactUs
};