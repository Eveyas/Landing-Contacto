const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Verificar tabla de usuarios al iniciar
async function createUsersTable() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla "users" verificada.');
  } catch (error) {
    console.error('❌ Error creando/verificando tabla "users":', error.message);
  }
}

// Ruta inicial
app.get('/', (req, res) => {
  res.send('✅ Backend funcionando correctamente en producción');
});

// Rutas
const ContactUs = require('./Routes/contactUsRoutes.js');
app.use('/api/contact', ContactUs);

const authRoutes = require('./Routes/authRoutes');
app.use('/api/auth', authRoutes);

const leadRoutes = require('./Routes/leadRoutes');
app.use('/api/leads', leadRoutes);

// Inicialización del servidor
app.listen(port, async () => {
  console.log(`🚀 Servidor corriendo en el puerto ${port}`);
  await createUsersTable();
});

module.exports = db;
