require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;

// Configuración de PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware
app.use(cors());
app.use(express.json());

// Verificar conexión a la base de datos
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
  } else {
    console.log('Connected to PostgreSQL at:', res.rows[0].now);
  }
});

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Ruta para el formulario de contacto
app.post('/api/contact', async (req, res) => {
  try {
    const { nombre, apellidos, correo, telefono, mensaje } = req.body;
    
    const result = await pool.query(
      'INSERT INTO leads (nombre, apellidos, correo, telefono, mensaje, estado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nombre, apellidos, correo, telefono, mensaje, 'nuevo']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ error: 'Error al guardar el mensaje' });
  }
});

// Ruta de login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Credenciales hardcodeadas (admin/admin123)
    if (username === 'admin' && password === 'admin123') {
      const user = {
        id: 1,
        username: 'admin',
        name: 'Administrador',
        email: 'admin@example.com'
      };
      
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token, user });
    }
    
    res.status(401).json({ error: 'Credenciales inválidas' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Ruta para obtener leads (protegida)
app.get('/api/leads', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    
    const leadsQuery = await pool.query(
      'SELECT * FROM leads ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    
    const countQuery = await pool.query('SELECT COUNT(*) FROM leads');
    const totalLeads = parseInt(countQuery.rows[0].count);
    const totalPages = Math.ceil(totalLeads / limit);
    
    res.json({
      leads: leadsQuery.rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalLeads
      }
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Error al obtener los leads' });
  }
});

// Ruta para obtener conteo de estados
app.get('/api/leads/status-counts', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT estado, COUNT(*) FROM leads GROUP BY estado'
    );
    
    const counts = {
      nuevo: 0,
      contactado: 0,
      descartado: 0
    };
    
    result.rows.forEach(row => {
      counts[row.estado] = parseInt(row.count);
    });
    
    res.json(counts);
  } catch (error) {
    console.error('Error fetching status counts:', error);
    res.status(500).json({ error: 'Error al obtener los conteos' });
  }
});

// Ruta para actualizar estado de lead
app.put('/api/leads/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await pool.query(
      'UPDATE leads SET estado = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lead no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating lead status:', error);
    res.status(500).json({ error: 'Error al actualizar el estado' });
  }
});

// Ruta para obtener información del usuario (protegida)
app.get('/api/auth/user', authenticateToken, async (req, res) => {
  try {
    // En este caso, como tenemos un usuario hardcodeado, devolvemos esos datos
    res.json({
      name: 'Administrador',
      lastname: '',
      email: 'admin@example.com'
    });
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ error: 'Error al obtener la información del usuario' });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});