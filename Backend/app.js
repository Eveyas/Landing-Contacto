const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const db = require('./Config/Db');

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

// Endpoint raíz
app.get('/', (req, res) => {
  res.send('✅ Backend funcionando correctamente en producción');
});

// Iniciar servidor
app.listen(port, async () => {
  console.log(`🚀 Server is running on port ${port}`);
});