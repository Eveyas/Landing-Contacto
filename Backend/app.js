const express = require('express');
const cors = require('cors');
require('dotenv').config();

const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,    
  user: process.env.DB_USER,     
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db;

// Rutas públicas
const ContactUs = require('./Routes/contactUsRoutes.js');
app.use('/api/contact', ContactUs);

// Rutas de autenticación
const authRoutes = require('./Routes/authRoutes');
app.use('/api/auth', authRoutes);

// Rutas protegidas
const leadRoutes = require('./Routes/leadRoutes');
app.use('/api/leads', leadRoutes);

async function createUsersTable() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL
      )
    `);
    console.log('Tabla de usuarios verificada');
  } catch (error) {
    console.error('Error creando tabla users:', error);
  }
}

// Redirección al endpoint
app.get('/', (req, res) => {
  res.redirect('/api/contact');
});

// Inicia el servidor
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`)
});
