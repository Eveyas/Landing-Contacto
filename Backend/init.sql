-- Crear base de datos
CREATE DATABASE landing;

-- Conectarse a la base de datos
\c landing

-- Crear tabla leads
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  correo VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  mensaje TEXT NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'nuevo',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuario admin (opcional, ya que las credenciales están hardcodeadas en el backend)
INSERT INTO users (username, password, name, email) VALUES (
  'admin', 
  '$2a$10$xD7TzO7.5Uw2aQ1Qh6r0.evJQ9YV7sJZ8J9kZ1l3mYn1JkXf3rJdO', -- bcrypt hash de 'admin123'
  'Administrador', 
  'admin@gmail.com'
);
