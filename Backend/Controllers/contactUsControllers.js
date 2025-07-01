const mysql = require('mysql2');
require('dotenv').config();
const axios = require('axios');
const sgMail = require('@sendgrid/mail');

// Configuración de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
    console.error('Database query failed:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
};

const postContactUs = async (req, res) => {
  const { nombre, apellidos, correo, telefono, mensaje, aceptaTerminos, recaptchaResponse } = req.body;
  
  // Validar campos
  if (!nombre || !apellidos || !correo || !telefono || !mensaje) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  // Validar términos y condiciones
  if (!aceptaTerminos) {
    return res.status(400).json({ error: 'Debe aceptar los términos y condiciones' });
  }

  // Validar reCAPTCHA
  if (!recaptchaResponse) {
    return res.status(400).json({ error: 'Token reCAPTCHA no proporcionado' });
  }

  try {
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaResponse}`;
    const recaptchaRes = await axios.post(verificationUrl);
    
    if (!recaptchaRes.data.success) {
      return res.status(400).json({ error: 'Verificación reCAPTCHA fallida' });
    }

    // Insertar en base de datos
    const query = 'INSERT INTO ContacUs (nombre, apellidos, correo, telefono, mensaje, acepta_terminos) VALUES (?,?,?,?,?,?)';
    const [results] = await db.query(query, [nombre, apellidos, correo, telefono, mensaje, true]);
    
    // Notificación al administrador (SendGrid)
    try {
      const msg = {
        to: process.env.ADMIN_EMAIL,
        from: process.env.SENDGRID_SENDER_EMAIL,
        subject: 'Nuevo lead registrado - Soporte Técnico',
        text: `Se ha registrado un nuevo lead:
               Nombre: ${nombre} ${apellidos}
               Correo: ${correo}
               Teléfono: ${telefono}
               Mensaje: ${mensaje.substring(0, 200)}...`,
        html: `<strong>Se ha registrado un nuevo lead:</strong>
               <p><b>Nombre:</b> ${nombre} ${apellidos}</p>
               <p><b>Correo:</b> ${correo}</p>
               <p><b>Teléfono:</b> ${telefono}</p>
               <p><b>Mensaje:</b> ${mensaje.substring(0, 500)}...</p>
               <p><a href="${process.env.ADMIN_PANEL_URL || 'https://admin.com'}">Ver en panel de administración</a></p>`,
      };
      
      await sgMail.send(msg);
      console.log('✅ Notificación enviada exitosamente');
    } catch (emailError) {
      console.error('❌ Error al enviar la notificación:', emailError);
    }

    res.status(201).json({ 
      message: 'Mensaje enviado con éxito', 
      id: results.insertId 
    });
    
  } catch (error) {
    console.error('Error en el proceso:', error);
    
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