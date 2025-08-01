// Backend/Middleware/adminMiddleware.js
module.exports = (req, res, next) => {
  // Implementación básica - ajusta según tu lógica de administrador
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ 
      error: 'Acceso denegado. Se requieren privilegios de administrador' 
    });
  }
  next();
};