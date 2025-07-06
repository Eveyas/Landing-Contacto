const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const expressApp = require('../server/app');

module.exports = async (req, res) => {
  const parsedUrl = parse(req.url, true);
  const { pathname } = parsedUrl;
  
  if (pathname.startsWith('/api')) {
    return expressApp(req, res);
  }
  
  return handle(req, res, parsedUrl);
};