const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());


// Rutas públicas
const ContactUs = require('./Routes/contactUsRoutes.js');
app.use('/api/contact', ContactUs);

// Rutas de autenticación
const authRoutes = require('./Routes/authRoutes');
app.use('/api/auth', authRoutes);

// Rutas protegidas
const leadRoutes = require('./Routes/leadRoutes');
app.use('/api/leads', leadRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  
  // Creación de usuario admin
  const db = require('./Config/Db.js');
  db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(100) NOT NULL
    )
  `).then(() => {
    console.log('Tabla de usuarios verificada');
  });
});

module.exports = app;

// Inicia el servidor
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}