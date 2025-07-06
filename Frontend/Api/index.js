const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Importa tu servidor Express
const expressApp = require('../server/app');

module.exports = async (req, res) => {
  const parsedUrl = parse(req.url, true);
  const { pathname } = parsedUrl;
  
  if (pathname.startsWith('/api')) {
    // Maneja rutas de la API con Express
    return expressApp(req, res);
  }
  
  // Maneja rutas del frontend con Next.js
  return handle(req, res, parsedUrl);
};
