const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
// const port = process.env.SERVER_PORT; 
// const port = process.env.PORT;
const port = process.env.PORT || 3000;
const db = require('./Config/Db');
const corsOptions = {
  origin: function (origin, callback) {
    // Lista de dominios permitidos
    const allowedOrigins = [
      process.env.FRONTEND_ORIGIN, // Tu frontend en Render
      'http://localhost:3001',     // Desarrollo local
      'https://landing-contacto-front.onrender.com' // URL explícita
    ];
    
    // Permitir solicitudes sin origen (como apps móviles o Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.error(`Origen no permitido: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200,
  maxAge: 86400 // Cachear configuraciones CORS por 24 horas
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Habilitar preflight para todas las rutas
app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));
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
  res.send('✅ Backend funcionando correctamente');
});

// Endpoint de verificación de salud
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    db: process.env.DB_HOST ? 'configured' : 'missing'
  });
});

// Iniciar servidor
// app.listen(port, async () => {
//   console.log(`🚀 Servidor corriendo en el puerto ${port}`);
// });

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en https://landing-contacto-back.onrender.com`);
  console.log(`🔗 Frontend: ${process.env.FRONTEND_ORIGIN}`);
});
